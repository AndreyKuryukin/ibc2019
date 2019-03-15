import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import memoize from 'memoizejs';
import rest from '../../../../../rest';
import NeighboursComponent from '../components';
import { RANGES, selectRange } from '../../../reducers/kqi/range';

class Neighbours extends React.Component {
    static propTypes = {
        range: PropTypes.oneOf(Object.values(RANGES)).isRequired,
        subscriber: PropTypes.object.isRequired,
        topologyDevices: PropTypes.array.isRequired,
    };

    state = {
        isLoading: true,
        data: [],
        graphData: [],
    };

    shouldComponentUpdate(nextProps, nextState) {
        const { range, subscriber, topologyDevices } = this.props;
        const { isLoading, data, graphData } = this.state;

        return (range !== nextProps.range)
            || (subscriber !== nextProps.subscriber)
            || (topologyDevices !== nextProps.topologyDevices)
            || (isLoading !== nextState.isLoading)
            || (data !== nextState.data)
            || (graphData !== nextState.graphData);
    };

    componentDidMount() {
        const { subscriber, range } = this.props;

        // const accDevice = (topologyDevices || []).filter(device => device.sqm_device_type === 'ACC')[0] || null;
        this.fetchNeighbours(subscriber.service_id, subscriber.affilate_id, range);
    };

    componentDidUpdate(prevProps, prevState) {
        const { subscriber, range } = this.props;

        if (subscriber !== prevProps.subscriber || range !== prevProps.range) {
            this.fetchNeighbours(subscriber.service_id, subscriber.affilate_id, range);
        }
    };

    fetchNeighbours = (serviceId, affilateId, periodUnit, accDevice) => {
        if (!serviceId || !affilateId || !periodUnit) return;

        if (!this.state.isLoading) {
            this.setState({ isLoading: true });
        }

        Promise.all([
            rest.get('/kqi/v1/online/kabs/neighbors', {}, { queryParams: { serviceId, affilateId, periodUnit } }),
            rest.get('/kqi/v1/online/kabs/devices/graph', {}, { queryParams: { serviceId, affilateId, periodUnit } })
        ])
            .then(([neighboursResponse, graphResponse]) => {
                // const accDeviceData = accDevice ? graphResponse.find(g => g.id === accDevice.id) : null;

                this.setState({
                    isLoading: false,
                    data: neighboursResponse.data.map(node => ({
                        ...node,
                        value: node.value.filter(v => _.isNumber(v.common)),
                        main: node.id === serviceId,
                    })),
                    graphData: graphResponse.data,
                    // accDevice: accDeviceData ? {
                    //     ...accDeviceData,
                    //     value: accDeviceData.value.filter(v => _.isNumber(v.common)),
                    // } : null,
                });
            })
            .catch((e) => {
                console.error(e);
                this.setState({ isLoading: false });
            });
    };

    getAccDevice = memoize(topologyDevices => (topologyDevices || []).filter(device => device.sqm_device_type === 'ACC')[0] || null);

    render() {
        const accDevice = this.getAccDevice(this.props.topologyDevices);
        const accDeviceGraph = accDevice ? this.state.graphData.find(g => g.id === accDevice.id) : null;

        return (
            <NeighboursComponent
                data={this.state.data}
                isLoading={this.state.isLoading}
                accDevice={{
                    ...accDevice,
                    value: accDeviceGraph ? accDeviceGraph.value.filter(v => _.isNumber(v.common)) : [],
                }}
            />
        );
    }
}

const mapStateToProps = state => ({
    range: selectRange(state),
});


export default connect(mapStateToProps, null)(Neighbours);
