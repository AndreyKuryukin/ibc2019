import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import _ from 'lodash';
import XLSX from 'xlsx';
import moment from 'moment';
import memoize from 'memoizejs';
import ls, { createLocalizer } from 'i18n';
import { fetchAlertsSuccess, fetchMrfSuccess, fetchPoliciesSuccess, FILTER_ACTIONS, readNewAlert } from '../actions';
import rest from '../../../rest';
import AlertsComponent from '../components';
import { SENDING_ALERT_TYPES, CLIENTS_INCIDENTS_ALERTS } from '../constants';
import { convertDateToUTC0, convertUTC0ToLocal } from '../../../util/date';
import { getQueryParams, setQueryParams } from "../../../util/state";
import { applyCiFilter, fetchCiAlertsSuccess, flushCiHighlight, setCiFilter, unhighlightCiAlert } from "../actions/ci";
import {
    applyGpFilter,
    fetchGpAlertsSuccess,
    fetchGpFilter,
    flushGpHighlight,
    unhighlightGpAlert
} from "../actions/gp";
import {
    applyKqiFilter,
    fetchKqiAlertsSuccess,
    fetchKqiFilter,
    flushKqiHighlight,
    unhighlightKqiAlert
} from "../actions/kqi";

const TAB_TITLES = {
    'GP': 'ГП',
    'CI': 'КИ',
    'KQI': 'KQI',
};

const ALERT_POLICY_MAP = {
    ci: ['STB', 'OTT'],
    gp: ['VB'],
    kqi: ['KQI']
};

class Alerts extends React.PureComponent {
    static contextTypes = {
        navBar: PropTypes.object.isRequired,
        notifications: PropTypes.object.isRequired,
    };

    static childContextTypes = {
        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    static propTypes = {
        filter: PropTypes.object,
        alerts: PropTypes.object,
        locations: PropTypes.array,
        policies: PropTypes.array,
        highLight: PropTypes.array,
        onFetchAlertsSuccess: PropTypes.func,
        onFetchLocationsSuccess: PropTypes.func,
        onFetchPoliciesSuccess: PropTypes.func,
        onChangeFilter: PropTypes.func,
        onReadNewAlert: PropTypes.func,
    };

    static defaultProps = {
        filter: null,
        alerts: {},
        locations: [],
        policies: [],
        highLight: [],
        onFetchAlertsSuccess: () => null,
        onFetchLocationsSuccess: () => null,
        onFetchPoliciesSuccess: () => null,
        onChangeFilter: () => null,
        onReadNewAlert: () => null,
    };

    getChildContext() {
        return {
            history: this.props.history,
            match: this.props.match,
            location: this.props.location,
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    componentDidMount() {
        const type = _.get(this.props, 'match.params.type');
        this.onTypeSwitch(type, this.props);
        Promise.all([rest.get('/api/v1/common/location'), rest.get('/api/v1/policy')])
            .then(([locationResponse, policyResponse]) => {
                this.props.onFetchLocationsSuccess(locationResponse.data);
                this.props.onFetchPoliciesSuccess(policyResponse.data);
            })
            .catch((e) => {
                console.error(e);
            });
    }

    componentWillReceiveProps(nextProps) {
        const type = _.get(this.state, 'type');
        const nextType = _.get(nextProps, 'match.params.type', type);
        if (nextType && type !== nextType) {
            this.context.navBar.setPageTitle([ls('ALERTS_PAGE_TITLE', 'Аварии'), ls(`ALERTS_TAB_TITLE_${nextType.toUpperCase()}`, TAB_TITLES[nextType.toUpperCase()])]);
            this.onTypeSwitch(nextType, nextProps);
        } else if (this.props.location.search !== nextProps.location.search && _.isEmpty(nextProps.location.search)) {
            this.onTypeSwitch(nextType, nextProps);
        }
    }

    onTypeSwitch = (newType, props) => {
        this.setState({ type: newType });
        const queryParams = getQueryParams(props.location);
        const stateFilter = props.filter;
        if (!_.isEmpty(queryParams)) {
            const filter = {
                ...queryParams,
                auto_refresh: stateFilter.auto_refresh,
                start: new Date(+queryParams.start),
                end: new Date(+queryParams.end),
                current: queryParams.current === 'true',
                historical: queryParams.historical === 'true',
            };
            this.props.onChangeFilter(filter);
            !this.state.isLoading && this.onFetchAlerts(filter, newType);
        } else {
            setQueryParams(this.prepareFilter(stateFilter, newType), props.history, props.location);
            !this.state.isLoading && this.onFetchAlerts(stateFilter, newType);
        }
    };

    getColumns = memoize((type = CLIENTS_INCIDENTS_ALERTS) => {
        const commonColumns = [
            {
                getTitle: createLocalizer('ALERTS_ID_COLUMN', 'ID'),
                name: 'id',
                resizable: true,
                searchable: true,
                sortable: true,
            }, {
                getTitle: createLocalizer('ALERTS_EXTERNAL_ID_COLUMN', 'ID во внешней системе'),
                name: 'external_id',
                resizable: true,
                searchable: true,
                sortable: true,
                width: 150,
            }, {
                getTitle: createLocalizer('ALERTS_STATUS_COLUMN', 'Статус'),
                name: 'status',
                sortable: true,
                resizable: true,
                width: 100,
            }, {
                getTitle: createLocalizer('ALERTS_POLICY_NAME_COLUMN', 'Имя политики'),
                name: 'policy_name',
                resizable: true,
                searchable: true,
                sortable: true,
            }, {
                getTitle: createLocalizer('ALERTS_NOTIFICATION_STATUS_COLUMN', 'Статус отправки во внешнюю систему'),
                name: 'notification_status',
                sortable: true,
                width: 250,
            }, {
                getTitle: createLocalizer('ALERTS_RAISE_TIME_COLUMN', 'Время и дата и возникновения'),
                name: 'raise_time',
                searchable: true,
                sortable: true,
                width: 150,
            }, {
                getTitle: createLocalizer('ALERTS_CEASE_TIME_COLUMN', 'Время и дата закрытия'),
                name: 'cease_time',
                resizable: true,
                searchable: true,
                sortable: true,
                width: 150,
            }, {
                getTitle: createLocalizer('ALERTS_DURATION_COLUMN', 'Длительность'),
                name: 'duration',
                searchable: true,
                sortable: true,
                width: 120,
            }
        ];

        const columnsByType = type === CLIENTS_INCIDENTS_ALERTS
            ? [{
                getTitle: createLocalizer('ALERTS_MAC_COLUMN', 'MAC'),
                name: 'mac',
                resizable: true,
                searchable: true,
                sortable: true,
            }, {
                getTitle: createLocalizer('ALERTS_SAN_COLUMN', 'SAN'),
                name: 'san',
                resizable: true,
                searchable: true,
                sortable: true,
            }, {
                getTitle: createLocalizer('ALERTS_PERSONAL_ACCOUNT_COLUMN', 'Лицевой счёт'),
                name: 'personal_account',
                resizable: true,
                searchable: true,
                sortable: true,
            }]
            : [{
                getTitle: createLocalizer('ALERTS_OBJECT_COLUMN', 'Объект'),
                name: 'object',
                resizable: true,
                searchable: true,
                sortable: true,
            }];

        return commonColumns.concat(columnsByType);
    });

    getReadableDuration = (milliseconds = 0) =>
        ['days', 'hours', 'minutes', 'seconds'].reduce((result, key) => {
            const duration = moment.duration(milliseconds, 'milliseconds');
            const method = duration[key];
            const units = method.call(duration).toString();
            const readableUnits = (key === 'hours' || key === 'minutes' || key === 'seconds') && units.length === 1 ? '0' + units : units;
            const nextPart = readableUnits + ls(`ALERTS_GROUP_POLICIES_DURATION_${key.toUpperCase()}_UNIT`, '');

            return `${result}${nextPart}`;
        }, '');

    onFetchingAlertsError = (e) => {
        this.context.notifications.notify({
            title: ls('ALERTS_GETTING_ERROR_TITLE_FIELD', 'Ошибка загрузки аварий:'),
            message: ls('ALERTS_GETTING_ERROR_MESSAGE_FIELD', 'Данные по авариям не получены'),
            type: 'CRITICAL',
            code: 'alerts-failed',
            timeout: 10000
        });

        this.setState({ isLoading: false });
    };

    onExportXLSX = (filter) => {
        this.setState({ isLoading: true });
        const queryParams = {
            ...this.prepareFilter(filter, this.props.match.params.type),
            limit: 65000,
        };

        delete queryParams.filter;

        const success = (response) => {
            if (!response.data.alerts.length) {
                this.setState({ isLoading: false });

                return;
            }

            const colsConfig = this.getColumns(this.props.match.params.type).reduce((config, column) => ({
                ...config,
                [column.name]: {
                    wpx: column.width || 200,
                    title: column.getTitle(),
                }
            }), {});
            const workbook = XLSX.utils.book_new();
            const worksheetCols = Object.values(colsConfig).map(({ wpx }) => ({ wpx }));
            const worksheet = XLSX.utils.json_to_sheet(response.data.alerts.map(node => ({
                id: String(node.id),
                external_id: node.external_id || '',
                status: node.closed ? ls('ALERTS_STATUS_CLOSED', 'Закрытая') : ls('ALERTS_STATUS_ACTIVE', 'Открытая'),
                policy_name: node.policy_name || '',
                notification_status: node.notification_status || '',
                raise_time: convertUTC0ToLocal(node.raise_time).format('HH:mm DD.MM.YYYY'),
                cease_time: node.cease_time ? convertUTC0ToLocal(node.cease_time).format('HH:mm DD.MM.YYYY') : '',
                duration: this.getReadableDuration(node.duration),
                ...(colsConfig.object
                    ? { object: node.object || '' }
                    : {
                        mac: _.isArray(node.mac) ? node.mac.join(', ') : node.mac,
                        san: this.mapSan(node.san),
                        personal_account: node.nls || '',
                    }
                ),
            })));
            const range = XLSX.utils.decode_range(worksheet['!ref']);

            worksheet['!cols'] = worksheetCols;

            for (let col = range.s.c; col <= range.e.c; ++col) {
                let address = XLSX.utils.encode_col(col) + '1';
                worksheet[address].v = colsConfig[worksheet[address].v].title;
            }

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Alerts');
            XLSX.writeFile(workbook, `${moment(queryParams.start).format('HH.mm_DD.MM.YYYY')}-${moment(queryParams.end).format('HH.mm_DD.MM.YYYY')}Alerts.xlsx`, {
                type: 'base64',
                bookType: 'xlsx',
            });

            this.setState({ isLoading: false });
        };

        this.handleAlertsFetching(queryParams, success);
    };

    onFetchAlerts = (filter, type) => {
        this.setState({ isLoading: true });

        const queryParams = this.prepareFilter(filter, type);

        const success = (response) => {
            const typeMap = {
                'gp': 'GROUP_AGGREGATION',
                'kqi': 'KPIKQI',
                'ci': 'SIMPLE'
            };
            const alerts = response.data;
            this.props.onFetchAlertsSuccess(alerts);
            this.setState({ isLoading: false });
        };

        this.handleAlertsFetching(queryParams, success);
    };

    onFilterAlerts = _.debounce((filter, callback) => {
        this.setState({ isLoading: true });

        const queryParams = this.prepareFilter(filter, this.props.match.params.type);

        const success = (response) => {
            const alerts = response.data;

            this.props.onFetchAlertsSuccess(alerts);
            callback();
            this.setState({ isLoading: false });
        };

        this.handleAlertsFetching(queryParams, success, callback);
    }, 700);

    adaptClosedParam = (queryParams) => {
        const clearParams = _.omit(queryParams, ['historical', 'current']);
        if (!(queryParams.historical && queryParams.current)) {
            clearParams.closed = queryParams.historical ? true : false
        }
        return clearParams;
    };

    handleAlertsFetching = (queryParams, success, error) => {

        rest.get('/api/v1/alerts', {}, { queryParams: this.adaptClosedParam(queryParams) })
            .then((response) => success({ data: { alerts: response.data.alerts, total: response.data.total } }))
            .catch((e) => {
                this.onFetchingAlertsError(e);
                _.isFunction(error) && error(e);
            });
    };

    fetchAlerts = (filter) => {
        const queryParams = this.prepareFilter(filter, this.props.match.params.type);
        setQueryParams(queryParams, this.props.history, this.props.location);
        if (!filter.auto_refresh) {
            this.props.onFlushHighlight();
        }
        this.props.applyFilter(filter);
        this.onFetchAlerts(filter, this.props.match.params.type);
    };

    prepareFilter = (filter, type) => {
        const preparedFilter = {
            ...filter,
            type: SENDING_ALERT_TYPES[type],
            start: filter.start && convertDateToUTC0(filter.start.getTime()).valueOf(),
            end: filter.end && convertDateToUTC0(filter.end.getTime()).valueOf(),
        };

        delete preparedFilter.auto_refresh;

        return _.reduce(preparedFilter, (result, value, paramName) => {
            if (value !== '' && !_.isUndefined(value)) {
                result[paramName] = value;
            }
            return result
        }, {});
    };

    onChangeFilter = (filter) => {
        const queryParams = this.prepareFilter(filter, this.props.match.params.type);
        if (this.props.filter.filter !== filter.filter) {
            this.onFilterAlerts(filter, () => {
                this.props.onChangeFilter(filter);
                setQueryParams(queryParams, this.props.history, this.props.location);
            });
        } else {
            setQueryParams(queryParams, this.props.history, this.props.location);
            this.props.onChangeFilter(filter);
        }
    };

    mapPolicies = (type, policies) => {
        const matcher = policy => (ALERT_POLICY_MAP[type] || []).findIndex(policy_type => policy.object_type === policy_type) !== -1;
        return policies.filter(matcher)
    };

    mapSan = (san) => {
        const digits = String(san).match(/\d+/g);
        return _.isEmpty(digits) ? '' : digits.join('_');
    };

    render() {
        return (
            <AlertsComponent
                history={this.props.history}
                match={this.props.match}
                filter={this.props.filter}
                alerts={this.props.alerts}
                policies={this.mapPolicies(this.props.match.params.type, this.props.policies)}
                locations={this.props.locations}
                onChangeFilter={this.onChangeFilter}
                notifications={this.props.notifications}
                onFetchAlerts={this.fetchAlerts}
                onExportXLSX={this.onExportXLSX}
                onFilterAlerts={this.onFilterAlerts}
                onReadNewAlert={this.props.onReadNewAlert}
                columns={this.getColumns(this.props.match.params.type)}
                isLoading={this.state.isLoading}
            />
        );
    }
}

const mapStateToProps = (state, props) => ({
    filter: _.get(state, `alerts.${props.match.params.type}.filter`, null),
    alerts: _.get(state, `alerts.${props.match.params.type}`, {}),
    policies: state.alerts.policies,
    locations: state.alerts.mrf,
    notifications: _.get(state, 'notifications.alerts')
});

const ACTIONS_MAP = {
    FETCH_ALERTS_SUCCESS: {
        ci: fetchCiAlertsSuccess,
        gp: fetchGpAlertsSuccess,
        kqi: fetchKqiAlertsSuccess,
    },
    SET_FILTER_VALUES: {
        ci: setCiFilter,
        gp: fetchGpFilter,
        kqi: fetchKqiFilter,
    },
    FLUSH_HIGHLIGHT: {
        ci: flushCiHighlight,
        gp: flushGpHighlight,
        kqi: flushKqiHighlight,
    },
    UNHIGHLIGHT_ALERT: {
        ci: unhighlightCiAlert,
        gp: unhighlightGpAlert,
        kqi: unhighlightKqiAlert,
    },
    APPLY_FILTER: {
        ci: applyCiFilter,
        gp: applyGpFilter,
        kqi: applyKqiFilter,
    }
};

const mapDispatchToProps = (dispatch, props) => ({
    onFetchLocationsSuccess: mrf => dispatch(fetchMrfSuccess(mrf)),
    onFetchPoliciesSuccess: policies => dispatch(fetchPoliciesSuccess(policies)),
    applyFilter: (filter) => {
        dispatch(ACTIONS_MAP.APPLY_FILTER[props.match.params.type](filter))
    },
    onFetchAlertsSuccess: alerts => dispatch(ACTIONS_MAP.FETCH_ALERTS_SUCCESS[props.match.params.type](alerts)),
    onChangeFilter: filter => dispatch(ACTIONS_MAP.SET_FILTER_VALUES[props.match.params.type](filter)),
    onReadNewAlert: alertId => dispatch(ACTIONS_MAP.UNHIGHLIGHT_ALERT[props.match.params.type](alertId)),
    onFlushHighlight: () => dispatch(ACTIONS_MAP.FLUSH_HIGHLIGHT[props.match.params.type]())
});

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
