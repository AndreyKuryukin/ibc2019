import React from 'react';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { applyAlerts, applyCiAlerts, applyGpAlerts, applyKqiAlerts, updateAlertsNotifications } from '../actions/index';
import _ from 'lodash';
import Connector from "./Connector";
import { CLIENTS_INCIDENTS_ALERTS, GROUP_POLICIES_ALERTS, KQI_ALERTS } from "../../alerts/constants";
import ls from "i18n";

const devMode = DEV_MODE;

class Notification extends React.PureComponent {
    static propTypes = {
        notifications: PropTypes.array,
        alertsState: PropTypes.object
    };

    static defaultProps = {
        notifications: [],
        alertsState: {},
    };

    static contextTypes = {
        notifications: PropTypes.object.isRequired,
    };

    //todo: Replace inline strings to constants
    //todo: Rework filter composing by componentWillReceiveProps

    constructor(props) {
        super(props);
        this.state = {
            notifications: []
        };
        this.connector = new Connector({ '/alerts': this.onAlerts })
    }

    applyNotificationChain = (alerts) => {
        const alertsByType = this.typeSplit(alerts);
        const alertsActions = _.reduce(alertsByType, (result, typeAlerts, typeName) => {
            const ceaseAlerts = typeAlerts.filter(alert => alert.closed === true);
            const raiseAlerts = typeAlerts.filter(raise => raise.closed === false);

            if (raiseAlerts.length > 0) {
                if (!result.add[typeName]) {
                    result.add[typeName] = []
                }
                result.add[typeName] = result.add[typeName].concat(raiseAlerts);
                result.add['count'] = (result.add['count'] || 0) + raiseAlerts.length;
            }

            if (ceaseAlerts.length > 0) {
                if (!result.remove[typeName]) {
                    result.remove[typeName] = []
                }
                result.remove[typeName] = result.remove[typeName].concat(ceaseAlerts);
            }

            return result;
        }, { add: { count: 0 }, remove: {} });
        this.props.addAlertNotifications(alertsActions)
    };

    composeFilter = (filter, fields) => {
        return _.reduce(fields, (result, key) => {
            if (!_.isEmpty(filter[key])) {
                result[key] = filter[key]
            }
            return result
        }, {})
    };

    composeFiltersByTypes = (appliedFilter, filterValues) => _.reduce(filterValues, (result, filter, type) => {
        if (filter.auto_refresh) {
            result[type] = this.composeFilter(_.get(appliedFilter, type, {}), ['type', 'mrf', 'rf', 'policy_id']);
        }
        return result;
    }, {});

    applyAutoRefreshChain = (alerts, appliedFilter, filterValues) => {
        const typeFilter = this.composeFiltersByTypes(appliedFilter, filterValues);
        const typesToRefresh = Object.keys(typeFilter);

        const matches = _.reduce(typesToRefresh, (result, type) => {
            const freshAlerts = alerts.filter(_.matches(typeFilter[type]));
            const split = this.actionSplit(freshAlerts, appliedFilter[type]);
            if (!_.isEmpty(split)) {
                result[type] = split;
            }
            return result
        }, {});
        if (!_.isEmpty(matches)) {
            this.props.applyAlerts(matches)
        }
    };

    onAlerts = (alertsMessage) => {
        const { error, alerts } = alertsMessage;
        const filter = this.extractAppliedFilterValues(this.props.alertsState);
        this.applyNotificationChain(alerts);
        if (!!error && error === 'STORM') {
            this.alertStorm();
        } else {
            const filterValues = this.extractFilterValues(this.props.alertsState);
            this.applyAutoRefreshChain(alerts, filter, filterValues);
        }
    };

    actionSplit = (alerts = [], filter) => {
        const { current, historical } = filter;
        const add = [], update = [], remove = [];
        const result = {};
        if (current && historical) {
            alerts.forEach(alert => {
                (alert.closed === false) && add.push(alert);
                (alert.closed === true) && update.push(alert);
            })
        } else if (current) {
            alerts.forEach(alert => {
                (alert.closed === false) && add.push(alert);
                (alert.closed === true) && remove.push(alert);
            })
        } else if (historical) {
            alerts.forEach(alert => {
                (alert.closed === true) && add.push(alert);
            });
        }
        (add.length > 0) && (result.add = add);
        (update.length > 0) && (result.update = update);
        (remove.length > 0) && (result.remove = remove);
        return result;
    };

    typeSplit = notifications => _.reduce(notifications, (result, notification) => {
        if (!result[notification.type]) {
            result[notification.type] = [];
        }
        result[notification.type].push(notification);
        return result;
    }, {});

    alertStorm = () => {
        this.context.notifications && this.context.notifications.notify({
            title: ls('NOTIFICATIONS_ALERT_STORM_TITLE', 'Зафиксировано аномально высокое количество аварий'),
            message: ls('NOTIFICATIONS_ALERT_STORM_MESSAGE', 'Уведомление о новых авариях приостановлено'),
            type: 'CRITICAL',
            code: 'alert-storm'
        });
    };

    extractAppliedFilterValues = (alertsState) => _.reduce(['ci', 'gp', 'kqi'], (result, type) => {
        result[type] = alertsState[type].appliedFilter;
        return result
    }, {});

    extractFilterValues = (alertsState) => _.reduce(['ci', 'gp', 'kqi'], (result, type) => {
        result[type] = alertsState[type].filter;
        return result
    }, {});

    componentWillReceiveProps(nextProps) {
        if (this.props.loggedIn !== nextProps.loggedIn) {
            if (nextProps.loggedIn) {
                this.connector && this.connector.connect();
            } else {
                this.connector && this.connector.disconnect()
            }
        }
    }

    render() {
        return '';
    }
}

const mapStateToProps = state => ({
    notifications: state.notifications,
    alertsState: _.get(state, 'alerts')
});

const ACTIONS_MAP = {
    [CLIENTS_INCIDENTS_ALERTS]: applyCiAlerts,
    [GROUP_POLICIES_ALERTS]: applyGpAlerts,
    [KQI_ALERTS]: applyKqiAlerts,
};

const mapDispatchToProps = dispatch => ({
    // alerts -> notificator
    addAlertNotifications: (notifications) => {
        dispatch(updateAlertsNotifications(notifications))
    },
    // alerts -> ui table
    applyAlerts: (alerts) => {
        Object.keys(alerts).forEach(type => dispatch(ACTIONS_MAP[type](alerts[type])))
    },
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps)(Notification)
);
