import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TreeView from '../../../components/TreeView';
import DeviceDetails from './DeviceDetails';
import { selectDevicesKQILoading, selectDevicesKQIMap, selectSTBSKQIMap } from '../../../reducers/kqi/devices';
import { KQIPropType } from '../../../containers/TopologyProvider';
import { createKRenderer } from '../../../helpers';
import { formatMAC } from '../../../util';
import { selectIsTopologyLoading } from '../../../modules/Topology/reducers';
import ls from "i18n";

const KABRenderer = createKRenderer(95);

class DevicesGrid extends React.Component {
    static propTypes = {
        subscriberDevices: PropTypes.arrayOf(PropTypes.shape({
            mac: PropTypes.string.isRequired,
            type: PropTypes.string,
            ip: PropTypes.string,
            name: PropTypes.string,
            vendor: PropTypes.string,
            model: PropTypes.string,
            version: PropTypes.string,
            uptime: PropTypes.number,
        })),
        subscriber: PropTypes.object,
        periodUnit: PropTypes.string,
        topologyDevices: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            type: PropTypes.string,
            ip: PropTypes.string,
            name: PropTypes.string,
            vendor: PropTypes.string,
            model: PropTypes.string,
        })),
        devicesKQI: PropTypes.objectOf(PropTypes.shape({
            current: KQIPropType,
            previous: KQIPropType,
        })),
        kabData: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string,
            value: PropTypes.arrayOf(PropTypes.shape({
                common: PropTypes.number
            }))
        })),
        stbsKQI: PropTypes.objectOf(PropTypes.shape({
            current: KQIPropType,
            previous: KQIPropType,
        })),
        isKQILoading: PropTypes.bool.isRequired,
        kabDataLoading: PropTypes.bool.isRequired,
        isTopologyLoading: PropTypes.bool.isRequired,
        verbose: PropTypes.bool.isRequired,
    };
    static defaultProps = {
        verbose: false,
    };

    getData() {
        const data = [];

        const nameByType = {
            PE: ls('PE_ROUTER_TITLE', 'PE-роутер'),
            AGG: ls('AGG_TITLE', 'Коммутатор агрегации'),
            ACC: ls('ACC_TITLE', 'Оборудование доступа'),
        };

        const devicesByType = (this.props.topologyDevices || []).reduce((result, device) => {
            const type = device.sqm_device_type;
            if (result[type] === undefined) {
                result[type] = [];
            }

            const group = result[type];

            const kqi = (this.props.devicesKQI !== null && this.props.devicesKQI[device.id]) || {
                current: null,
                previous: null,
            };

            let item;

            if (group.length !== 0 && group[0].disabled) {
                item = group[0];
                item.id = device.id;
                item.kab = [
                    kqi.current !== null ? kqi.current.common : undefined,
                    kqi.previous !== null ? kqi.previous.common : undefined,
                ];
                item.ip = device.ip;
                item.mac = formatMAC(device.mac || '');
                delete item.disabled;
            } else {
                item = {
                    id: device.id,
                    itemType: 'device',
                    type: nameByType[device.sqm_device_type] || device.type,
                    kab: [
                        kqi.current !== null ? kqi.current.common : undefined,
                        kqi.previous !== null ? kqi.previous.common : undefined,
                    ],
                    mac: formatMAC(device.mac || ''),
                    ip: device.ip,
                };
                group.push(item);
            }

            if (this.props.verbose) {
                item.children = [
                    {
                        id: `${device.id}-details`,
                        itemType: 'details',
                        device: device,
                        name: device.name,
                        vendor: device.vendor,
                        model: device.model,
                        version: device.version ,
                        uptime: device.uptime ,
                    },
                ];
            }

            return result;
        }, {
            PE: [{
                id: 'pe',
                itemType: 'device',
                type: nameByType.PE,
                mac: '-',
                ip: '-',
                kab: [],
                disabled: true,
            }],
            AGG: [{
                id: 'agg',
                itemType: 'device',
                type: nameByType.AGG,
                mac: '-',
                ip: '-',
                kab: [],
                disabled: true,
            }],
            ACC: [{
                id: 'acc',
                itemType: 'device',
                type: nameByType.ACC,
                mac: '-',
                ip: '-',
                kab: [],
                disabled: true,
            }],
        });

        data.push(
            ..._.chain(devicesByType)
                .values()
                .flatten()
                .value()
        );
        // data.push({
        //     id: 'router',
        //     itemType: 'device',
        //     type: 'CPE',
        //     mac: '-',
        //     ip: '-',
        //     kab: [],
        //     disabled: true,
        // });

        if (this.props.subscriberDevices !== null) {
            for (const device of this.props.subscriberDevices) {
                const kqi = (this.props.stbsKQI !== null && this.props.stbsKQI[device.mac]) || {
                    current: null,
                    previous: null,
                };

                const item = {
                    id: device.mac,
                    itemType: 'device',
                    type: `${device.type} ${device.name}`,
                    kab: [
                        kqi.current !== null ? kqi.current.common : undefined,
                        kqi.previous !== null ? kqi.previous.common : undefined,
                    ],
                    mac: device.mac === '-' ? device.mac : formatMAC(device.mac),
                    ip: device.ip || '-',
                };
                if (this.props.verbose) {
                    let uptime = '-';
                    if (typeof device.uptime === 'number') {
                        const duration = moment.duration(device.uptime * 1000);
                        uptime = [Math.floor(duration.asHours()), duration.minutes(), duration.seconds()]
                            .map(d => d.toString().padStart(2, '0'))
                            .join(':');
                    }
                    item.children = [
                        {
                            id: `${device.mac}-details`,
                            itemType: 'details',
                            device: device,
                            name: device.name,
                            vendor: device.vendor,
                            model: device.model || '-',
                            version: device.version || '-',
                            uptime,
                        },
                    ];
                }
                data.push(item);
            }
        }

        return data;
    }

    renderItem = (item) => {
        if (item.itemType !== 'details') return;
        const stillLoading = this.props.isKQILoading || this.props.kabDataLoading;
        return <DeviceDetails item={item}
                              kabData={this.props.kabData}
                              periodUnit={this.props.periodUnit}
                              kabDataLoading={stillLoading}/>;
    };

    checkIsCellLoading = (value, node, columnKey) => {
        if (columnKey !== 'kab' || node.id === 'router') return false;
        return this.props.isKQILoading;
    };

    render() {
        return (
            <TreeView
                id="subscriber-topology-grid"
                data={this.getData()}
                isLoading={this.props.isTopologyLoading}
                columns={[
                    {
                        getTitle: () => ls('DEVICE_TYPE', 'Тип устройства'),
                        name: 'type',
                        width: '30%',
                    }, {
                        getTitle: () => <span>КQI<sub>sub</sub></span>,
                        name: 'kab',
                        width: '20%',
                    }, {
                        getTitle: () => ls('MAC_ADDRESS_TITLE', 'MAC адрес'),
                        name: 'mac',
                        width: '25%',
                    }, {
                        getTitle: () => ls('IP_ADDRESS_TITLE', 'IP адрес'),
                        name: 'ip',
                        width: '25%',
                    },
                ]}
                itemRenderer={this.renderItem}
                cellRenderer={(value, item, columnKey) => {
                    if (columnKey === 'kab') {
                        const [current, previous] = value;
                        return KABRenderer(current, previous);
                    }
                }}
                checkIsCellLoading={this.checkIsCellLoading}
            />
        );
    }
}

const mapStateToProps = state => ({
    devicesKQI: selectDevicesKQIMap(state),
    stbsKQI: selectSTBSKQIMap(state),
    isKQILoading: selectDevicesKQILoading(state),
    isTopologyLoading: selectIsTopologyLoading(state),
});

export default connect(mapStateToProps)(DevicesGrid);
