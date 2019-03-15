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

    getNodes() {
        if (this.props.topologyDevices === null) return null;
        const { kgs, threshold } = this.state;
        const enrichTopologyDevice = (node, type) => {
            const result = { ...node };

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

        const access = enrichTopologyDevice({
            id: 'access',
            icon: ICONS.ACCESS,
            name: 'Оборудование доступа',
            children: [],
        }, 'ACC');
        const commutator = enrichTopologyDevice({
            id: 'commutator',
            icon: ICONS.COMMUTATOR,
            name: 'Коммутатор агрегации',
            children: [access],
        }, 'AGG');
        const peRouter = enrichTopologyDevice({
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
        const base = {
            id: 'base',
            kgs,
            icon: ICONS.BASE,
            name: 'Головная станция',
            children: [network],
        };

        let root = base;
        let parent = access;

        const router = {
            id: 'router',
            icon: ICONS.ROUTER,
            name: 'CPE',
            children: [],
        };
        parent.children.push(router);
        parent = router;

        if (this.props.subscriberDevices !== null) {
            for (const sDevice of this.props.subscriberDevices) {
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

                parent.children.push(device);
            }
        }

        return root;
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
