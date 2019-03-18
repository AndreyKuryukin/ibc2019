import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectDevicesKQILoading, selectDevicesKQIMap, selectSTBSKQIMap } from '../../../reducers/kqi/devices';
import { KQIPropType } from '../../../containers/TopologyProvider';
import { selectIsTopologyLoading } from '../reducers';
import TopologyComponent from "../components/index";
import { ICONS } from "../components/Icon";
import rest from "../../../../../rest/index";
import { selectRange } from "../../../reducers/kqi/range";
import * as _ from "lodash";


class SubscriberTopology extends React.Component {
    static propTypes = {
        subscriberDevices: PropTypes.array,
        subscriber: PropTypes.object,
        periodUnit: PropTypes.string,
        topologyDevices: PropTypes.array,
        devicesKQI: PropTypes.objectOf(PropTypes.shape({
            current: KQIPropType,
            previous: KQIPropType,
        })),
        stbsKQI: PropTypes.objectOf(PropTypes.shape({
            current: KQIPropType,
            previous: KQIPropType,
        })),
        isKQILoading: PropTypes.bool.isRequired,
        isTopologyLoading: PropTypes.bool.isRequired,
    };

    state = {};

    componentDidMount() {
        const { subscriber, periodUnit } = this.props;
        this.fetchKgs(subscriber, periodUnit)
    }

    fetchKgs = ({ affilate_id: affilateId }, periodUnit) => {
        this.setState({
            kgsLoading: true,
        });
        return Promise.all([
            rest.get('/kqi/v1/online/kgs/kgs', {}, { queryParams: { affilateId, periodUnit } }),
            rest.get('/api/v1/dashboard/thresholds/kqi'),
        ]).then(([{ data: kgs }, { data: threshold }]) => {
            this.setState({
                kgsLoading: false,
                kgs,
                threshold
            });
        }).catch(() => {
            this.setState({
                kgsLoading: false,
            })
        });
    };

    enrichTopologyDevice = (node, type) => {
        const result = { ...node };
        const { threshold } = this.state;
        const device = this.props.topologyDevices.find(device => device.sqm_device_type === type);
        if (device === undefined) {
            result.disabled = true;
        }
        const kqi = device !== undefined ? this.props.devicesKQI[device.id] : undefined;
        if (kqi !== undefined) {
            result.kqi = {
                current: kqi.current ? kqi.current.common : undefined,
                previous: kqi.previous ? kqi.previous.common : undefined,
            }
        }
        if (threshold) {
            result.threshold = threshold
        }
        return result;
    };

    enrichTopology = (routers) => {
        const { kgs } = this.state;
        const access = this.enrichTopologyDevice({
            id: 'access',
            icon: ICONS.ACCESS,
            name: 'Оборудование доступа',
            children: routers,
        }, 'ACC');
        const commutator = this.enrichTopologyDevice({
            id: 'commutator',
            icon: ICONS.COMMUTATOR,
            name: 'Коммутатор агрегации',
            children: [access],
        }, 'AGG');
        const peRouter = this.enrichTopologyDevice({
            id: 'pe-router',
            icon: ICONS.RE_ROUTER,
            name: 'PE-роутер',
            children: [commutator],
        }, 'PE');
        const network = {
            id: 'network',
            icon: ICONS.NETWORK,
            name: 'Магистральная сеть',
            children: [peRouter],
        };
        return {
            id: 'base',
            kgs,
            icon: ICONS.BASE,
            name: 'Головная станция',
            children: [network],
        };
    };

    getNodes() {

        if (_.isEmpty(this.props.topologyDevices)) return null;

        const defaultRouter = {
            id: 'cpe',
            icon: ICONS.ROUTER,
            name: 'CPE',
            children: [],
        };

        const routers = this.props.topologyDevices
            .filter(dev => dev.sqm_device_type === 'CPE')
            .map(cpe => this.enrichTopologyDevice({
                id: `cpe-${cpe.id}`,
                icon: ICONS.ROUTER,
                device_id: cpe.id,
                name: 'CPE',
                children: [],
            }, 'CPE'))
        ;

        if (!_.isEmpty(this.props.subscriberDevices)) {
            this.props.subscriberDevices.forEach((sDevice) => {

                const kqi = (this.props.stbsKQI !== null && this.props.stbsKQI[sDevice.mac]) || {
                    current: null,
                    previous: null,
                };

                const device = {
                    id: sDevice.mac,
                    name: sDevice.name,
                    icon: ICONS.STB,
                    kqi: {
                        current: kqi.current !== null ? kqi.current.common : undefined,
                        previous: kqi.previous !== null ? kqi.previous.common : undefined,
                    },
                    children: [],
                };
                const headDevice = _.find(routers, { device_id: sDevice.router });
                if (!headDevice) {
                    defaultRouter.children.push(device)
                } else {
                    headDevice.children.push(device);
                }
            });
        }
        if (!_.isEmpty(defaultRouter.children)) {
            routers.push(defaultRouter)
        }
        const result = this.enrichTopology(routers);
        debugger;
        return result
    }

    render() {
        const { kgsLoading } = this.state;
        return <TopologyComponent isKQILoading={this.props.isKQILoading}
                                  kgsLoading={kgsLoading}
                                  isTopologyLoading={this.props.isTopologyLoading}
                                  nodes={this.getNodes()}
        />;
    }
}

const mapStateToProps = state => ({
    devicesKQI: selectDevicesKQIMap(state),
    stbsKQI: selectSTBSKQIMap(state),
    isKQILoading: selectDevicesKQILoading(state),
    isTopologyLoading: selectIsTopologyLoading(state),
    periodUnit: selectRange(state),
});

export default connect(mapStateToProps)(SubscriberTopology);
