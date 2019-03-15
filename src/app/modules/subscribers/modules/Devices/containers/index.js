import React from 'react';
import PropTypes from 'prop-types';
import Widget from '../../../components/Widget';
import DevicesGrid from '../components/DevicesGrid';
import { connect } from 'react-redux';
import { selectDevicesKQILoading, selectDevicesKQIMap, selectSTBSKQIMap } from '../../../reducers/kqi/devices';
import { selectIsTopologyLoading } from '../../../modules/Topology/reducers';
import { selectRange } from "../../../reducers/kqi/range";
import rest from "../../../../../rest/index";
import * as _ from "lodash";

class SubscriberDevices extends React.Component {
    static propTypes = {
        subscriberDevices: PropTypes.array,
        topologyDevices: PropTypes.array,
        subscriber: PropTypes.object,
    };

    state = {};

    componentDidMount() {
        const { subscriber, periodUnit } = this.props;
        if (!_.isEmpty(subscriber) && periodUnit) {
            this.fetchKabData()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.subscriber !== this.props.subscriber || nextProps.periodUnit !== this.props.periodUnit) {
            this.fetchKabData(nextProps)
        }
    }

    fetchKabData = (props = this.props) => {
        const { periodUnit, subscriber = {} } = props;
        const { affilate_id: affilateId, service_id: serviceId } = subscriber;
        this.setState({ kabDataLoading: true });
        return rest.get('/kqi/v1/online/kabs/devices/graph', {}, { queryParams: { periodUnit, affilateId, serviceId } })
            .then(({ data: kabData }) => {
                this.setState({ kabDataLoading: false, kabData });
            })
            .catch(() => {
                this.setState({ kabDataLoading: false });
            })
    };

    render() {
        const { kabData, kabDataLoading } = this.state;
        return (
            <Widget title="Информация об оборудовании абонента">
                <DevicesGrid
                    subscriberDevices={this.props.subscriberDevices}
                    topologyDevices={this.props.topologyDevices}
                    devicesKQI={this.props.devicesKQI}
                    stbsKQI={this.props.stbsKQI}
                    isKQILoading={this.props.isKQILoading}
                    isTopologyLoading={this.props.isTopologyLoading}
                    subscriber={this.props.subscriber}
                    periodUnit={this.props.periodUnit}
                    kabData={kabData}
                    kabDataLoading={kabDataLoading}
                    verbose
                />
            </Widget>
        );
    }
}

const mapStateToProps = state => ({
    devicesKQI: selectDevicesKQIMap(state),
    stbsKQI: selectSTBSKQIMap(state),
    isKQILoading: selectDevicesKQILoading(state),
    isTopologyLoading: selectIsTopologyLoading(state),
    periodUnit: selectRange(state),
});

export default connect(mapStateToProps)(SubscriberDevices);

