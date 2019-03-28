import React from 'react';
import PropTypes from 'prop-types';
import TreeView from '../../../components/TreeView';
import { createKRenderer } from '../../../helpers';
import { KQIPropType } from '../../../containers/TopologyProvider';
import { formatMAC } from '../../../util';
import KabGraph from "./Graph";
import * as _ from "lodash";

import LoadingNode from "../../../components/TreeView/LoadingNode";

class KABGrid extends React.Component {
    static propTypes = {
        devices: PropTypes.arrayOf(PropTypes.shape({
            mac: PropTypes.string.isRequired,
            type: PropTypes.string,
            ip: PropTypes.string,
            name: PropTypes.string,
            model: PropTypes.string,
            version: PropTypes.string,
        })),
        kabByService: PropTypes.arrayOf(PropTypes.object),
        kqi: PropTypes.objectOf(PropTypes.shape({
            current: KQIPropType,
            previous: KQIPropType,
        })),
        isKQILoading: PropTypes.bool.isRequired,
        isTopologyLoading: PropTypes.bool.isRequired,
        isKabLoading: PropTypes.bool.isRequired,
        verbose: PropTypes.bool,
        periodUnit: PropTypes.string,
        threshold: PropTypes.number,
    };

    state = {};

    getKRenderer = (threshold) => createKRenderer(_.isNumber(threshold) ? threshold : 95);

    getData() {
        if (this.props.devices == null) return [];

        return this.props.devices.map((device) => {
            const { current, previous } = (this.props.kqi !== null && this.props.kqi[device.mac]) || {
                current: {},
                previous: {},
            };
            const kqi = {
                current: current || {},
                previous: previous || {},
            };

            return {
                id: device.mac,
                mac: formatMAC(device.mac),
                ...{
                    children: this.props.verbose ? [{
                        graph: true,
                        id: device.mac,
                        getData: () => {
                            if (this.props.isKabLoading) {
                                return false
                            }
                            const macResults = _.find(_.get(this.props, 'kabByService', []), {id: device.mac});
                            return macResults ? macResults.value : false;
                        }
                    }] : undefined
                },
                kab: [
                    kqi.current.common,
                    kqi.previous.common,
                ],
                kabVOD: [
                    kqi.current.vod,
                    kqi.previous.vod,
                ],
                kabLive: [
                    kqi.current.broadband_access,
                    kqi.previous.broadband_access,
                ],
                kabSwitch: [
                    kqi.current.channel_switching_time,
                    kqi.previous.channel_switching_time,
                ],
                kabPVR: [
                    kqi.current.pvr,
                    kqi.previous.pvr,
                ],
                kabEPG: [
                    kqi.current.epg,
                    kqi.previous.epg,
                ],
                kabLoad: [
                    kqi.current.load_time,
                    kqi.previous.load_time,
                ],
            };
        });
    }

    checkIsCellLoading = (value, node, columnKey) => {
        if (!columnKey.startsWith('kab')) return false;
        return this.props.isKQILoading;
    };

    renderNoData = () => {
        return <div style={{ height: '24px' }}>{'No data'}</div>
    };

    renderGraph = (data, periodUnit, id) => {
        return <KabGraph
            id={id}
            data={data}
            periodUnit={periodUnit}/>
    };

    renderItem = (item) => {
        if (!item.graph) return;
        const data = item.getData();
        let component;
        if (data === false) {
            component = <LoadingNode small/>
        }
        if (data && data.length > 0) {
            component = this.renderGraph(data, this.props.periodUnit, item.id)
        } else {
            component = this.renderNoData();
        }

        return component;
    };

    render() {
        return (
            <TreeView
                id="subscriber-kab"
                data={this.getData()}
                isLoading={this.props.isTopologyLoading}
                columns={[
                    {
                        getTitle: () => 'Address (UID/MAC)',
                        name: 'mac',
                        width: '30%',
                    }, {
                        getTitle: () => <span>КQI<sub>sub</sub> Total</span>,
                        name: 'kab',
                        width: '10%',
                    }, {
                        getTitle: () => <span>КQI<sub>sub</sub> VOD</span>,
                        name: 'kabVOD',
                        width: '10%',
                    }, {
                        getTitle: () => <span>КQI<sub>sub</sub> Live</span>,
                        name: 'kabLive',
                        width: '10%',
                    }, {
                        getTitle: () => <span>КQI<sub>sub</sub> Switch</span>,
                        name: 'kabSwitch',
                        width: '10%',
                    }, {
                        getTitle: () => <span>КQI<sub>sub</sub> PVR</span>,
                        name: 'kabPVR',
                        width: '10%',
                    }, {
                        getTitle: () => <span>КQI<sub>sub</sub> EPG</span>,
                        name: 'kabEPG',
                        width: '10%',
                    }, {
                        getTitle: () => <span>КQI<sub>sub</sub> Load</span>,
                        name: 'kabLoad',
                        width: '10%',
                    },
                ]}
                itemRenderer={this.renderItem}
                cellRenderer={(value, item, columnKey) => {
                    if (columnKey.startsWith('kab') && value) {
                        const [current, previous] = value;
                        return this.getKRenderer(this.props.threshold)(current, previous);
                    }
                }}
                checkIsCellLoading={this.checkIsCellLoading}
            />
        );
    }
}

export default KABGrid;
