import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import _ from 'lodash';
import { fetchAlarmsSuccess, fetchMrfSuccess, FILTER_ACTIONS } from '../actions';
import { flush } from '../../notifications/actions';
import rest from '../../../rest';
import AlarmsComponent from '../components';
import ls from "i18n";
import { SENDING_ALARM_TYPES } from '../constants';
import { convertDateToUTC0 } from '../../../util/date';

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
        onFetchAlarmsSuccess: PropTypes.func,
        onFetchLocationsSuccess: PropTypes.func,
        onChangeFilter: PropTypes.func,
    };

    static defaultProps = {
        filter: null,
        alarms: [],
        locations: [],
        onFetchAlarmsSuccess: () => null,
        onFetchLocationsSuccess: () => null,
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
        rest.get('/api/v1/common/location')
            .then((response) => {
                const mrf = response.data;
                this.props.onFetchLocationsSuccess(mrf);
            })
            .catch((e) => {
                console.error(e);
            });
    }

    componentWillReceiveProps(nextProps) {
        const type = _.get(this.state, 'type');
        const nextType = _.get(nextProps, 'match.params.type', type);
        if (nextType && type !== nextType) {
            this.context.navBar.setPageTitle([ls('ALARMS_PAGE_TITLE', 'Аварии'), ls(`ALARMS_TAB_TITLE_${nextType.toUpperCase()}`, '')]);
            this.setState({ type: nextType })
        }
    }

    onFetchAlarms = (filter) => {
        this.setState({ isLoading: true });
        const queryParams = {
            ...filter,
            type: SENDING_ALARM_TYPES[this.props.match.params.type],
            start: convertDateToUTC0(filter.start.getTime()).valueOf(),
            end: convertDateToUTC0(filter.end.getTime()).valueOf(),
        };
        rest.get('/api/v1/alerts', {}, { queryParams })
            .then((response) => {
            const typeMap = {
                'gp': 'gp',
                'kqi': 'kqi',
                'ci': 'ki'
            };
                const alarms = response.data;
                this.props.onFetchAlarmsSuccess(alarms);
                this.props.flushNotifications(typeMap[this.props.match.params.type]);
                this.setState({ isLoading: false });
            })
            .catch((e) => {
                console.error(e);
                this.context.notifications.notify({
                    title: ls('LOGIN_ERROR_FIELD', 'Ошибка загрузки аварий:'),
                    message: ls('LOGIN_ERROR_FIELD', 'Данные по авариям не получены'),
                    type: 'CRITICAL',
                    code: 'alarms-failed',
                    timeout: 10000
                });
                this.setState({ isLoading: false });
            });
    };

    render() {
        return (
            <AlarmsComponent
                history={this.props.history}
                match={this.props.match}
                filter={this.props.filter}
                alarms={this.props.alarms}
                locations={this.props.locations}
                onChangeFilter={this.props.onChangeFilter}
                notifications={this.props.notifications}
                onFetchAlarms={this.onFetchAlarms}
                isLoading={this.state.isLoading}
            />
        );
    }
}

const mapStateToProps = (state, props) => ({
    filter: _.get(state, `alarms.${props.match.params.type}`, null),
    alarms: state.alarms.alarms,
    locations: state.alarms.mrf,
    notifications: _.get(state, 'notifications.alerts')
});

const mapDispatchToProps = (dispatch, props) => ({
    onFetchLocationsSuccess: mrf => dispatch(fetchMrfSuccess(mrf)),
    onFetchAlarmsSuccess: alarms => dispatch(fetchAlarmsSuccess(alarms)),
    onChangeFilter: filter => _.isFunction(FILTER_ACTIONS[props.match.params.type]) ? dispatch(FILTER_ACTIONS[props.match.params.type](filter)) : null,
    flushNotifications: type => dispatch(flush('alerts', type))
});

export default connect(mapStateToProps, mapDispatchToProps)(Alarms);
