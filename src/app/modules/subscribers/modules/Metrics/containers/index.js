import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SubscriberMetricsCmp from '../components';
import { selectIsTopologyLoading, selectSubscriberMacs } from '../../Topology/reducers';
import { selectIsMetricsLoading, selectMetrics, selectRangeDuration, selectParameters } from '../reducers';

import rest from "../../../../../rest";
import { metrics as metricsRequest } from '../../../rest';


import { fetchMetrics, fetchMetricsSuccess } from "../reducers/index";
import { selectRange } from "../../../reducers/kqi/range";

class SubscriberMetrics extends React.Component {
    static propTypes = {
        subscriber: PropTypes.object.isRequired,
        macs: PropTypes.arrayOf(PropTypes.string).isRequired,
        isLoading: PropTypes.bool.isRequired,
        hoursLimit: PropTypes.number,
        range: PropTypes.string,
        parameters: PropTypes.object,
    };

    state = {};

    shouldComponentUpdate(nextProps, nextState) {
        const { macs, subscriber, isLoading, hoursLimit, range, parameters } = this.props;
        const { mac } = this.state;

        return (range !== nextProps.range)
            || (parameters !== nextProps.parameters)
            || (hoursLimit !== nextProps.hoursLimit)
            || (isLoading !== nextProps.isLoading)
            || (!_.isEqual(macs, nextProps.macs))
            || (subscriber !== nextProps.subscriber)
            || (mac !== nextState.mac);
    }

    componentDidMount() {
        if (this.props.mac && this.props.hoursLimit && this.props.subscriber) {
            this.fetchMetrics()
        }
    }

    componentWillUpdate(nextProps) {
        if (
            this.props.subscriber !== nextProps.subscriber
            || this.props.hoursLimit !== nextProps.hoursLimit
            || (nextProps.mac !== null && this.props.mac !== nextProps.mac)
        ) {
            this.fetchMetrics(nextProps);
        }
    }

    fetchStbData = (paramKey) => {
        const queryParams = {
            paramKey,
            mac: this.state.mac,
            hoursLimit: this.props.hoursLimit,
            affilateId: this.props.subscriber.affilate_id,
            serviceId: this.props.subscriber.service_id,
        };
        return rest.get('/api/v1/subscribers/stb/data', {}, { queryParams }).then(({ data }) => data)
    };

    onSelectMac = (mac) => {
        const props = { ...this.props, mac };
        this.setState({ mac });
        this.fetchMetrics(props);
    };

    fetchMetrics = async (props = this.props) => {
        const mac = props.mac;
        if (mac === null) return;

        const { subscriber, hoursLimit } = props;

        if (subscriber === null) return;

        this.props.onFetchMetrics();

        const request = metricsRequest({
            serviceId: subscriber.service_id,
            affilateId: subscriber.affilate_id,
            hoursLimit,
            mac
        });
        this.lastRequest = request;

        let metrics = [];
        let parameters = [];

        try {
            const metricsData = await request;
            metrics = metricsData.metrics;
            parameters = metricsData.parameters;
        } catch (e) {
            console.error(e);
        }

        if (this.lastRequest === request) {
            this.props.onFetchMetricsSuccess(metrics, parameters);
        }
    };

    render() {
        const { macs, isLoading, hoursLimit, metrics, subscriber, range, parameters } = this.props;
        return (<SubscriberMetricsCmp
            macs={macs}
            hoursLimit={hoursLimit}
            isLoading={isLoading}
            metrics={metrics}
            parameters={parameters}
            range={range}
            subscriber={subscriber}
            fetchStbData={this.fetchStbData}
            onSelectMac={this.onSelectMac}
        />);
    }
}

const mapStateToProps = state => ({
    macs: selectSubscriberMacs(state),
    isLoading: selectIsTopologyLoading(state) || selectIsMetricsLoading(state),
    hoursLimit: selectRangeDuration(state),
    range: selectRange(state),
    metrics: selectMetrics(state),
    parameters: selectParameters(state),
});

const mapDispatchToProps = dispatch => ({
    onFetchMetrics: () => dispatch(fetchMetrics()),
    onFetchMetricsSuccess: (metrics, parameters) => dispatch(fetchMetricsSuccess(metrics, parameters)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SubscriberMetrics);
