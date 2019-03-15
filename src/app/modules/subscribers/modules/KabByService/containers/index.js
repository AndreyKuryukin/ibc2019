import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isMacKQILoading, selectKQIMap } from '../../../reducers/kqi/mac';
import { selectIsTopologyLoading } from '../../../modules/Topology/reducers';
import Widget from '../../../components/Widget';
import KABGrid from '../components/KABGrid';
import rest from "../../../../../rest/index";
import * as _ from "lodash";
import { selectRange } from "../../../reducers/kqi/range";

class SubscriberKAB extends React.Component {
    static propTypes = {
        devices: PropTypes.array.isRequired,
        kqi: PropTypes.object,
        isKQILoading: PropTypes.bool,
        isTopologyLoading: PropTypes.bool,
        periodUnit: PropTypes.string
    };

    static defaultProps = {
        periodUnit: 'HOUR',
        kqi: {},
        isKQILoading: true,
        isTopologyLoading: true,
    };

    state = {};

    componentDidMount() {
        if (!this.props.isTopologyLoading) {
            (_.get(this.props, 'devices.length', 0) > 0) &&
            this.fetchData(this.getMacs(this.props.devices), this.props.periodUnit, this.props.verbose)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isTopologyLoading !== this.props.isTopologyLoading || this.props.periodUnit !== nextProps.periodUnit) {
            (_.get(nextProps, 'devices.length', 0) > 0) &&
            this.fetchData(this.getMacs(nextProps.devices), nextProps.periodUnit, nextProps.verbose)
        }
    }

    fetchData = (macs, periodUnit, verbose) => {
        this.setState({ kabByService: [], kabLoading: true });
        const queries = [rest.get('/api/v1/dashboard/thresholds/kqi')];
        if (verbose) {
            queries.push( rest.get('/kqi/v1/online/kabs/macs/graph', {}, { queryParams: { macs, periodUnit } }));
        }
        return Promise.all(queries).then(([{ data: threshold }, { data: kabByService }]) => {
            this.setState({
                kabLoading: false,
                kabByService,
                threshold: _.get(threshold, 'KAB.itv1')
            });
        });
    };

    getMacs = devices => devices.map(dev => dev.mac);

    render() {
        return (
                <KABGrid devices={this.props.devices}
                         kqi={this.props.kqi}
                         isKQILoading={this.props.isKQILoading}
                         isTopologyLoading={this.props.isTopologyLoading}
                         isKabLoading={this.state.kabLoading}
                         kabByService={this.state.kabByService}
                         periodUnit={this.state.periodUnit}
                         threshold={this.state.threshold}
                         verbose={this.props.verbose}
                />
        );
    }
}

const mapStateToProps = state => ({
    kqi: selectKQIMap(state),
    isKQILoading: isMacKQILoading(state),
    isTopologyLoading: selectIsTopologyLoading(state),
    periodUnit: selectRange(state),
});

export default connect(mapStateToProps)(SubscriberKAB);

