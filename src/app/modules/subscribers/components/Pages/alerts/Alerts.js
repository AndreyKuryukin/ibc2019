import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import TreeView from '../../TreeView';
import {alerts as fetchAlerts} from '../../../rest';
import {
    fetchStart,
    fetchSuccess,
    selectAlerts,
    selectIsAlertsLoading,
    selectRangeDates,
} from '../../../reducers/pages/alerts';
import {selectIsTopologyLoading, selectSubscriberMacs, selectTopologyDevices} from '../../../modules/Topology/reducers';
import Chart from './Chart';
import {MODE} from './ModeSwitcher';
import filterStyles from './ip-filter.scss';
import {formatMAC} from '../../../util';
import Preloader from '../../../../../components/Preloader';
import {convertUTC0ToLocal} from '../../../../../util/date';
import {TYPE} from './TypeFilter';
import MacSelector from './MacSelector';
import ls from "i18n";

const getDeviceIds = devices => Array.isArray(devices)
    ? devices.map(device => device.device_id)
    : [];

class Alerts extends React.Component {
    static propTypes = {
        subscriber: PropTypes.object.isRequired,
        startDate: PropTypes.number.isRequired,
        endDate: PropTypes.number.isRequired,
        devices: PropTypes.arrayOf(PropTypes.shape({
            device_id: PropTypes.number.isRequired,
            ip: PropTypes.string.isRequired,
        })),
        deviceID: PropTypes.string,
        desiredMAC: PropTypes.string,
        macs: PropTypes.arrayOf(PropTypes.string).isRequired,
        alerts: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            closed: PropTypes.bool.isRequired,
            policy_name: PropTypes.string.isRequired,
            type: PropTypes.oneOf(Object.values(TYPE)).isRequired,
            raise_time: PropTypes.string.isRequired,
            duration: PropTypes.number,
        })).isRequired,
        mode: PropTypes.oneOf(Object.values(MODE)),
        type: PropTypes.oneOf(Object.values(TYPE)),
        isLoading: PropTypes.bool.isRequired,
        buildLink: PropTypes.func.isRequired,
        onAlertSelect: PropTypes.func,
        onDeviceSelect: PropTypes.func.isRequired,
        onFetchAlerts: PropTypes.func.isRequired,
        onFetchAlertsSuccess: PropTypes.func.isRequired,
    };
    static defaultProps = {
        deviceID: null,
        desiredMAC: null,
        type: null,
    };

    lastRequest = null;

    componentDidMount() {
        this.fetchAlerts();
    }
    componentWillReceiveProps(nextProps) {
        if (
            this.props.subscriber !== nextProps.subscriber
            || this.props.startDate !== nextProps.startDate
            || this.props.endDate !== nextProps.endDate
            || !isEqual(getDeviceIds(this.props.devices), getDeviceIds(nextProps.devices))
        ) {
            this.fetchAlerts(nextProps);
        }
    }

    filterByType = alert => this.props.type === null || alert.type === this.props.type;

    fetchAlerts = async (props = this.props) => {
        const {subscriber, startDate, endDate} = props;
        const devices = this.getDeviceIds(props);

        if (startDate === null || devices.length === 0) return;

        this.props.onFetchAlerts();

        const request = fetchAlerts(subscriber, {
            startDate,
            endDate,
            devices,
            limit: 999,
        });
        this.lastRequest = request;

        let alerts = [];
        try {
            alerts = await request;
        } catch (e) {
            console.error(e);
        }

        if (request === this.lastRequest) {
            this.lastRequest = null;
            this.props.onFetchAlertsSuccess(alerts);
        }
    };

    getTableData() {
        return this.props.alerts
            .filter(this.filterByType)
            .map(alert => ({
                id: alert.id,
                status: alert.closed ? 'Закрытая' : 'Открытая',
                policy: alert.policy_name,
                outerStatus: '-',
                startDate: moment(convertUTC0ToLocal(alert.raise_time).valueOf()).format('HH:mm DD.MM.YYYY'),
                endDate: alert.cease_time ? convertUTC0ToLocal(alert.cease_time).format('HH:mm DD.MM.YYYY') : '-',
            }));
    }

    getDeviceIds = (props = this.props) => {
        if (props.filter) {
            if (Array.isArray(props.devices) && props.devices.length !== 0) return [props.devices[0].device_id];
            return [];
        }

        if (Array.isArray(props.devices)) return props.devices.map(device => device.device_id);
        return [];
    };

    getChartData() {
        const groups = ['KI', 'GP', 'KQI'];
        const colors = {
            KI: '#fd7f00',
            GP: '#ff001f',
            KQI: '#377dc4',
        };
        const names = {
            KI: 'Client incidends',
            GP: 'Group policies',
            KQI: 'KQI',
        };
        const groupByPolicyGroup = {
            [TYPE.KI]: 'KI',
            [TYPE.GP]: 'GP',
            [TYPE.KQI]: 'KQI',
        };
        const mac = this.getSelectedMac();
        const alerts = this.props.alerts
            .filter(this.filterByType)
            .filter(alert => alert.type !== 'SIMPLE' || mac === null || alert.mac === mac)
            .map(alert => ({
                id: alert.id,
                group: groupByPolicyGroup[alert.type],
                closed: alert.closed,
                startTime: convertUTC0ToLocal(alert.raise_time).valueOf(),
                endTime: convertUTC0ToLocal(alert.raise_time).valueOf() + alert.duration,
            }))
            .sort((a, b) => a.startTime - b.startTime);

        const result = groups.reduce((res, id) => ({
            ...res,
            [id]: {
                id: id,
                name: names[id],
                color: colors[id],
                alerts: [],
            },
        }), {});

        return alerts.reduce((groups, alert) => {
            groups[alert.group].alerts.push(alert);
            return groups;
        }, result);
    }

    renderChartFilter = () => {
        if (!Array.isArray(this.props.devices)) return null;

        const selectedMac = this.getSelectedMac();

        return (
            <MacSelector
                macList={this.getMacList()}
                selectedMac={selectedMac}
                onMacSelect={this.props.onDeviceSelect}
                subscriberDevices={this.props.subscriberDevices}
            />
        );
    };

    getSelectedMac() {
        if (this.props.deviceID !== null) return this.props.deviceID;

        const list = this.getMacList();
        const desired = this.props.desiredMAC === null ? null : this.props.desiredMAC.replace(/\W/g, '');
        if (desired !== null && list.includes(desired)) return desired;
        return this.getMacList()[0] || null;
    }

    getMacList() {
        return this.props.macs;
    }

    render() {
        if (this.props.mode === MODE.CHART) {
            return (
                <div style={{padding: '16px 26px'}}>
                    <Preloader active={this.props.isLoading}>
                        <Chart
                            data={this.getChartData()}
                            from={this.props.startDate}
                            to={this.props.endDate}
                            filter={this.renderChartFilter()}
                            buildLink={this.props.buildLink}
                        />
                    </Preloader>
                </div>
            );
        }

        return (
            <TreeView
                id="subscribers-alerts-grid"
                data={this.getTableData()}
                isLoading={this.props.isLoading}
                columns={[
                    {
                        getTitle: () => 'ID',
                        name: 'id',
                        width: '30%',
                    }, {
                        getTitle: () => ls('STATUS', 'Статус'),
                        name: 'status',
                        width: '10%',
                    }, {
                        getTitle: () => ls('POLICY', 'Политика'),
                        name: 'policy',
                        width: '10%',
                    }, {
                        getTitle: () => ls('CRM_STATUS', 'Статус отправки во внешнюю систему'),
                        name: 'outerStatus',
                        width: '20%',
                    }, {
                        getTitle: () => ls('RAISE_TIME', 'Время и дата возникновения'),
                        name: 'startDate',
                        width: '15%',
                    }, {
                        getTitle: () => ls('CEASE_TIME', 'Время и дата закрытия'),
                        name: 'endDate',
                        width: '15%',
                    },
                ]}
                onItemClick={this.props.onAlertSelect}
            />
        );
    }
}

const mapStateToProps = state => {
    const {startDate, endDate} = selectRangeDates(state);

    return {
        startDate,
        endDate,
        macs: selectSubscriberMacs(state),
        devices: selectTopologyDevices(state),
        alerts: selectAlerts(state),
        isLoading: selectIsAlertsLoading(state) || selectIsTopologyLoading(state),
    };
};
const mapDispatchToProps = dispatch => ({
    onFetchAlerts: () => dispatch(fetchStart()),
    onFetchAlertsSuccess: alerts => dispatch(fetchSuccess(alerts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
