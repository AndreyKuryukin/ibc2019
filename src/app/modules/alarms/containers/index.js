import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import _ from 'lodash';
import XLSX from 'xlsx';
import moment from 'moment';
import { fetchAlarmsSuccess, fetchMrfSuccess, fetchPoliciesSuccess, FILTER_ACTIONS } from '../actions';
import { flush } from '../../notifications/actions';
import rest from '../../../rest';
import AlarmsComponent from '../components';
import ls from 'i18n';
import { SENDING_ALARM_TYPES } from '../constants';
import { convertDateToUTC0, convertUTC0ToLocal } from '../../../util/date';
import { getQueryParams, setQueryParams } from "../../../util/state";

const TAB_TITLES = {
    'GP': 'ГП',
    'CI': 'КИ',
    'KQI': 'KQI',
};

class Alarms extends React.PureComponent {
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
        alarms: PropTypes.array,
        locations: PropTypes.array,
        policies: PropTypes.array,
        onFetchAlarmsSuccess: PropTypes.func,
        onFetchLocationsSuccess: PropTypes.func,
        onFetchPoliciesSuccess: PropTypes.func,
        onChangeFilter: PropTypes.func,
    };

    static defaultProps = {
        filter: null,
        alarms: [],
        locations: [],
        policies: [],
        onFetchAlarmsSuccess: () => null,
        onFetchLocationsSuccess: () => null,
        onFetchPoliciesSuccess: () => null,
        onChangeFilter: () => null,
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
            this.context.navBar.setPageTitle([ls('ALARMS_PAGE_TITLE', 'Аварии'), ls(`ALARMS_TAB_TITLE_${nextType.toUpperCase()}`, TAB_TITLES[nextType.toUpperCase()])]);
            this.setState({ type: nextType });
        }
        if (nextProps.filter.auto_refresh && !this.props.filter.auto_refresh) {
            console.log('Активировать веб-сокет');
        }
    }

    getReadableDuration = (milliseconds = 0) =>
        ['days', 'hours', 'minutes', 'seconds'].reduce((result, key) => {
            const duration = moment.duration(milliseconds, 'milliseconds');
            const method = duration[key];
            const units = method.call(duration).toString();
            const readableUnits = (key === 'hours' || key === 'minutes' || key === 'seconds') && units.length === 1 ? '0' + units : units;
            const nextPart = readableUnits + ls(`ALARMS_GROUP_POLICIES_DURATION_${key.toUpperCase()}_UNIT`, '');

            return `${result}${nextPart}`;
        }, '');

    onChangeFilter = (filter) => {
        if (this.props.filter.filter !== filter.filter) {
            this.onFilterAlarms(filter, this.props.onChangeFilter.bind(this, filter));
        } else {
            this.props.onChangeFilter(filter);
        }
    };

    onFetchingAlarmsError = (e) => {
        console.error(e);

        this.context.notifications.notify({
            title: ls('ALARMS_GETTING_ERROR_TITLE_FIELD', 'Ошибка загрузки аварий:'),
            message: ls('ALARMS_GETTING_ERROR_MESSAGE_FIELD', 'Данные по авариям не получены'),
            type: 'CRITICAL',
            code: 'alarms-failed',
            timeout: 10000
        });

        this.setState({ isLoading: false });
    };

    onExportXLSX = (filter) => {
        this.setState({ isLoading: true });

        const queryParams = {
            ...this.prepareFilter(filter),
            limit: 65000,
        };

        delete queryParams.filter;

        const success = (response) => {
            if (!response.data.length) {
                this.setState({ isLoading: false });

                return;
            }

            const workbook = XLSX.utils.book_new();
            const worksheetCols = [
                { wpx: 250 },
                { wpx: 250 },
                { wpx: 300 },
                { wpx: 220 },
                { wpx: 150 },
                { wpx: 150 },
                { wpx: 200 },
            ];
            const worksheet = XLSX.utils.json_to_sheet(response.data.map(node => ({
                id: node.id.toString(),
                external_id: node.external_id || '',
                policy_name: node.policy_name,
                notification_status: node.notification_status || '',
                raise_time: convertUTC0ToLocal(node.raise_time).format('HH:mm DD.MM.YYYY'),
                duration: this.getReadableDuration(node.duration),
                object: node.object || '',
            })));
            const range = XLSX.utils.decode_range(worksheet['!ref']);

            worksheet['!cols'] = worksheetCols;

            for (let col = range.s.c; col <= range.e.c; ++col) {
                var address = XLSX.utils.encode_col(col) + '1';
                worksheet[address].v = ls(`ALARMS_${worksheet[address].v.toUpperCase()}_COLUMN`, '');
            }

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Alarms');
            XLSX.writeFile(workbook, 'Alarms.xlsx', {
                type: 'base64',
                bookType: 'xlsx',
            });

            this.setState({ isLoading: false });
        };

        this.handleAlarmsFetching(queryParams, success);
    };

    onFetchAlarms = (filter) => {
        this.setState({ isLoading: true });

        const queryParams = this.prepareFilter(filter);
        delete queryParams.filter;

        const success = (response) => {
            const typeMap = {
                'gp': 'gp',
                'kqi': 'kqi',
                'ci': 'ki'
            };
            const alarms = response.data;
            this.props.onFetchAlarmsSuccess(alarms);
            this.props.flushNotifications(typeMap[this.props.match.params.type]);
            this.setState({ isLoading: false });
        };

        this.handleAlarmsFetching(queryParams, success);
    };

    onFilterAlarms = _.debounce((filter, callback) => {
        this.setState({ isLoading: true });

        const queryParams = this.prepareFilter(filter);

        const success = (response) => {
            const alarms = response.data;

            this.props.onFetchAlarmsSuccess(alarms);
            callback();
            this.setState({ isLoading: false });
        };

        this.handleAlarmsFetching(queryParams, success, callback);
    }, 700);

    handleAlarmsFetching = (queryParams, success, error) => {
        rest.get('/api/v1/alerts', {}, { queryParams })
            .then(success)
            .catch((e) => {
                this.onFetchingAlarmsError(e);
                _.isFunction(error) && error(e);
            });
    };

    fetchAlarms = (filter) => {
        const queryParams = this.prepareFilter(filter);
        delete queryParams.filter;

        setQueryParams(queryParams, this.props.history, this.props.location);
        this.onFetchAlarms(filter);
    };

    prepareFilter = (filter) => {
        const preparedFilter = {
            ...filter,
            type: SENDING_ALARM_TYPES[this.props.match.params.type],
            start: filter.start && convertDateToUTC0(filter.start.getTime()).valueOf(),
            end: filter.end && convertDateToUTC0(filter.end.getTime()).valueOf(),
        };

        delete preparedFilter.auto_refresh;

        return preparedFilter;
    };

    render() {
        return (
            <AlarmsComponent
                history={this.props.history}
                match={this.props.match}
                filter={this.props.filter}
                alarms={this.props.alarms}
                policies={this.props.policies}
                locations={this.props.locations}
                onChangeFilter={this.onChangeFilter}
                notifications={this.props.notifications}
                onFetchAlarms={this.fetchAlarms}
                onExportXLSX={this.onExportXLSX}
                onFilterAlarms={this.onFilterAlarms}
                isLoading={this.state.isLoading}
            />
        );
    }
}

const mapStateToProps = (state, props) => ({
    filter: _.get(state, `alarms.${props.match.params.type}`, null),
    alarms: state.alarms.alarms,
    policies: state.alarms.policies,
    locations: state.alarms.mrf,
    notifications: _.get(state, 'notifications.alerts')
});

const mapDispatchToProps = (dispatch, props) => ({
    onFetchLocationsSuccess: mrf => dispatch(fetchMrfSuccess(mrf)),
    onFetchPoliciesSuccess: policies => dispatch(fetchPoliciesSuccess(policies)),
    onFetchAlarmsSuccess: alarms => dispatch(fetchAlarmsSuccess(alarms)),
    onChangeFilter: filter => _.isFunction(FILTER_ACTIONS[props.match.params.type]) ? dispatch(FILTER_ACTIONS[props.match.params.type](filter)) : null,
    flushNotifications: type => dispatch(flush('alerts', type))
});

export default connect(mapStateToProps, mapDispatchToProps)(Alarms);
