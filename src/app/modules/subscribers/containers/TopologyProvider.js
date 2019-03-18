import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';
import {
    fetchTopology,
    fetchTopologyError,
    fetchTopologySuccess,
    selectTopologyDevices,
} from '../modules/Topology/reducers';
import {
    fetchMacKQI,
    fetchMacKQISuccess,
    fetchMacKQIError,
} from '../reducers/kqi/mac';
import {
    fetchDevicesKQI,
    fetchDevicesKQISuccess,
    fetchDevicesKQIError,
} from '../reducers/kqi/devices';
import {
    topology as topologyRequest,
    macKQI as macKQIRequest,
    devicesKQI as devicesKQIRequest,
} from '../rest';
import {selectSubscriberDevices} from '../modules/Topology/reducers';
import {RANGES, selectRange} from '../reducers/kqi/range';

function getMacs(devices) {
    if (devices === null) return [];
    return devices.map(device => device.mac_address);
}

export const KQIPropType = PropTypes.shape({
    id: PropTypes.oneOfType(PropTypes.string, PropTypes.number).isRequired,
    common: PropTypes.number.isRequired,
    broadband_access: PropTypes.number.isRequired,
    vod: PropTypes.number.isRequired,
    pvr: PropTypes.number.isRequired,
    channel_switching_time: PropTypes.number.isRequired,
    load_time: PropTypes.number.isRequired,
    epg: PropTypes.number.isRequired,
});

class Provider extends React.Component {
    static propTypes = {
        subscriber: PropTypes.object,
        periodUnit: PropTypes.oneOf([
            RANGES.HOUR,
            RANGES.DAY,
            RANGES.WEEK,
        ]).isRequired,
        subscriberDevices: PropTypes.arrayOf(PropTypes.shape({
            mac_address: PropTypes.string,
            device_type: PropTypes.string,
            terminal_name: PropTypes.string,
            device_details: PropTypes.shape({
                fw_version: PropTypes.string,
                stb_ip: PropTypes.string,
                stb_model: PropTypes.string,
                manufacturer: PropTypes.string,
                uptime: PropTypes.number,
            }),
        })),
        topologyDevices: PropTypes.arrayOf(PropTypes.shape({
            device_id: PropTypes.number.isRequired,
            device_type: PropTypes.string,
            device_name: PropTypes.string,
            device_vendor: PropTypes.string,
            device_model: PropTypes.string,
            ip: PropTypes.string,
            sqm_device_type: PropTypes.oneOf(['ACC', 'AGG', 'PE']).isRequired,
        })),
        children: PropTypes.node,
        onFetchTopology: PropTypes.func.isRequired,
        onFetchTopologySuccess: PropTypes.func.isRequired,
        onFetchTopologyError: PropTypes.func.isRequired,
    };

    lastDevicesRequest = null;
    lastMacKQIRequest = null;
    lastDevicesKQIRequest = null;

    componentDidMount() {
        this.fetchDevices();
        this.fetchDevicesKQI();
    }

    componentWillReceiveProps(nextProps) {
        const isSubscriberChanged = this.props.subscriber !== nextProps.subscriber;
        if (isSubscriberChanged) {
            this.fetchDevices(nextProps);
        }
        const isPeriodChanged = this.props.periodUnit !== nextProps.periodUnit;
        if (isSubscriberChanged || isPeriodChanged) {
            this.fetchDevicesKQI(nextProps);
        }

        const prevMacs = getMacs(this.props.subscriberDevices);
        const nextMacs = getMacs(nextProps.subscriberDevices);
        if (nextMacs.length !== 0 && (!isEqual(prevMacs, nextMacs) || isPeriodChanged)) {
            this.fetchMacKQI(nextProps);
        }
    }

    fetchDevices = async (props = this.props) => {
        if (props.subscriber === null) return;

        this.props.onFetchTopology();

        const request = topologyRequest(props.subscriber);
        this.lastDevicesRequest = request;

        let topology;
        try {
            topology = await request;
        } catch (e) {
            console.error(e);
        }

        if (request === this.lastDevicesRequest) {
            if (topology !== undefined) {
                this.props.onFetchTopologySuccess(topology);
            } else {
                this.props.onFetchTopologyError();
            }
        }
    };

    fetchMacKQI = async (props = this.props) => {
        const macs = getMacs(props.subscriberDevices);
        const {periodUnit} = props;

        if (macs.length === 0) return;

        this.props.onFetchMacKQI();

        const request = macKQIRequest({
            macs,
            periodUnit,
        });
        this.lastMacKQIRequest = request;

        let kqi;
        try {
            kqi = await request;
        } catch (e) {
            console.error(e);
        }

        if (request === this.lastMacKQIRequest) {
            if (kqi !== undefined) {
                this.props.onFetchMacKQISuccess(kqi);
            } else {
                this.props.onFetchMacKQIError();
            }
        }
    };

    fetchDevicesKQI = async (props = this.props) => {
        const {subscriber, periodUnit} = props;

        if (subscriber === null) return;

        const {
            service_id: serviceId,
            affilate_id: affilateId,
        } = subscriber;

        this.props.onFetchDevicesKQI();

        const request = devicesKQIRequest({
            serviceId,
            affilateId,
            periodUnit,
        });
        this.lastDevicesKQIRequest = request;

        let kqi;
        try {
            kqi = await request;
        } catch (e) {
            console.error(e);
        }

        if (request === this.lastDevicesKQIRequest) {
            if (kqi !== undefined) {
                this.props.onFetchDevicesKQISuccess(kqi);
            } else {
                this.props.onFetchDevicesKQIError();
            }
        }
    };

    getSubscriberDevices() {
        if (this.props.subscriberDevices === null) return null;

        return this.props.subscriberDevices.map(device => ({
            type: device.device_type,
            mac: device.mac_address,
            ip: device.device_details ? device.device_details.stb_ip : '-',
            name: device.terminal_name,
            router: device.router,
            vendor: device.device_details ? device.device_details.manufacturer : '-',
            model: device.device_details ? device.device_details.stb_model : '-',
            version: device.device_details ? device.device_details.fw_version : '-',
            uptime: device.device_details ? device.device_details.uptime : null,
        }));
    }

    getTopologyDevices() {
        if (this.props.topologyDevices === null) return null;

        return this.props.topologyDevices.map(device => ({
            id: device.device_id.toString(),
            type: device.device_type,
            ip: device.ip,
            name: device.device_name,
            vendor: device.device_vendor,
            model: device.device_model,
            timestamp: device.timestamp,
            sqm_device_type: device.sqm_device_type,
        }));
    }

    render() {
        return React.Children.map(this.props.children, child => React.cloneElement(child, {
            subscriberDevices: this.getSubscriberDevices(),
            topologyDevices: this.getTopologyDevices(),
        }));
    }
}

const mapStateToProps = state => ({
    topologyDevices: selectTopologyDevices(state),
    subscriberDevices: selectSubscriberDevices(state),
    periodUnit: selectRange(state),
});
const mapDispatchToProps = dispatch => ({
    onFetchTopology: () => dispatch(fetchTopology()),
    onFetchTopologySuccess: subscriber => dispatch(fetchTopologySuccess(subscriber)),
    onFetchTopologyError: () => dispatch(fetchTopologyError()),

    onFetchMacKQI: () => dispatch(fetchMacKQI()),
    onFetchMacKQISuccess: kqi => dispatch(fetchMacKQISuccess(kqi)),
    onFetchMacKQIError: () => dispatch(fetchMacKQIError()),

    onFetchDevicesKQI: () => dispatch(fetchDevicesKQI()),
    onFetchDevicesKQISuccess: kqi => dispatch(fetchDevicesKQISuccess(kqi)),
    onFetchDevicesKQIError: () => dispatch(fetchDevicesKQIError()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Provider);
