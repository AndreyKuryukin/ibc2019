import React from 'react';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { applyAlerts, ceaseAlerts, updateAlertsNotifications } from '../actions/index';
import _ from 'lodash';
import Connector from "./Connector";

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

    onAlerts = (alertsMessage) => {
        const { error, alerts } = alertsMessage;
        const activeTab = this.getActiveTab();
        const filter = this.extractFilter(this.props.alertsState, activeTab);
        this.applyNotificationChain(alerts);
        // if (!!error && error === 'STORM') {
        //     this.alertStorm();
        // } else if (!filter || !filter.auto_refresh) {
        //     const notifications = this.avSplit(alerts);
        //     this.props.addAlertNotifications(this.typeSplit(notifications), 'alerts');
        // } else if (filter.auto_refresh) {
        //     const { ok, nok } = this.commonSplit(alerts, filter);
        //     const { add, remove, update, av } = this.actionSplit(ok, filter);
        //     const notifications = av.concat(this.avSplit(nok));
        //     const uiAlerts = { add, remove, update };
        //     this.props.addAlertNotifications(this.typeSplit(notifications), 'alerts', notifications.length);
        //     this.props.applyAlerts(uiAlerts);
        // }
    };

    composeFilter = (filter) => {
        return _.reduce(['type', 'mrf', 'rf', 'policy_id'], (result, key) => {
            if (!_.isEmpty(filter[key])) {
                result[key] = filter[key]
            }
            return result
        }, {})
    };

    commonSplit = (alerts, srcFilter) => {
        const filter = this.composeFilter(srcFilter);
        const matcher = _.matches(filter);
        const ok = [], nok = [];
        alerts.forEach(alert => {
            matcher(alert) ? ok.push(alert) : nok.push(alert)
        });
        return { ok, nok }
    };

    actionSplit = (alerts = [], filter) => {
        const { current, historical } = filter;
        const add = [], update = [], remove = [], av = [];
        if (current && historical) {
            alerts.forEach(alert => {
                (alert.closed === false) && add.push({ ...alert, status: 'ACTIVE' });
                (alert.closed === true) && update.push({ ...alert, status: 'CLOSED' });
            })
        } else if (current) {
            alerts.forEach(alert => {
                (alert.closed === false) && add.push({ ...alert, status: 'ACTIVE' });
                (alert.closed === true) && remove.push(alert);
            })
        }
        else if (historical) {
            alerts.forEach(alert => {
                (alert.closed === false) && av.push({ ...alert, status: 'ACTIVE' });
                (alert.closed === true) && add.push({ ...alert, status: 'CLOSED' });
            });
        }
        return { add, update, remove, av };
    };

    avSplit = (alerts) => alerts.filter(alert => alert.closed === false);

    typeSplit = notifications => _.reduce(notifications, (result, notification) => {
        if (!result[notification.type]) {
            result[notification.type] = [];
        }
        result[notification.type].push(notification);
        return result;
    }, {});

    alertStorm = () => {
        this.props.alertStorm();
    };

    getActiveTab = () => {
        const tabPath = ((/ci(\/|\??)|\/gp(\/|\??)|\/kqi(\/|\??)/g).exec(this.props.location.pathname) || [''])[0];
        const tab = tabPath.replace(/\/|\?/g, '');
        return tab;
    };

    extractFilter = (alertsState, activeTab) => alertsState[activeTab];

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

const
    mapStateToProps = state => ({
        notifications: state.notifications,
        alertsState: _.get(state, 'alerts')
    });

const
    mapDispatchToProps = dispatch => ({
        addAlertNotifications: (notifications) => {
            dispatch(updateAlertsNotifications(notifications))
        },
        onCeaseAlerts: (notifications) => {
            dispatch(ceaseAlerts(notifications))
        },
        applyAlerts: (alerts) => {
            dispatch(applyAlerts(alerts))
        },
        alertStorm: () => {
        },
    });

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps)(Notification)
);
