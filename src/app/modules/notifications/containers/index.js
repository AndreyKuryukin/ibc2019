import React from 'react';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { onNewNotifications } from '../actions/index';
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

    onAlerts = (alertsMessage) => {
        const { error, alerts } = alertsMessage;
        const activeTab = this.getActiveTab();
        const filter = this.extractFilter(this.props.alertsState, activeTab);

        if (!!error && error === 'STORM') {
            this.alertStorm();
        } else if (!filter || !filter.auto_refresh) {
            const notifications = this.avSplit(alerts);
            this.props.addAlertNotifications(notifications, '/alerts', notifications.length);
        } else if (filter.auto_refresh) {
            const { ok, nok } = this.commonSplit(alerts, filter);
            const { add, remove, update, av } = this.actionSplit(ok, filter);

            const notifications = av.concat(this.avSplit(nok));
            const uiAlerts = { add, remove, update };

            this.props.addAlertNotifications(notifications, '/alerts', notifications.length);
            this.props.applyAlerts(uiAlerts);
        }
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
        alerts.forEach(alert => matcher(alert) ? ok.push(alert) : nok.push(alert));
        return { ok, nok }
    };

    actionSplit = (alerts = [], filter) => {
        const { current, historical } = filter;
        const add = [], update = [], remove = [], av = [];
        if (current && historical) {
            alerts.forEach(alert => {
                (alert.action === 'RAISE') && add.push(alert);
                (alert.action === 'CEASE') && update.push(alert);
            })
        } else if (current) {
            alerts.forEach(alert => {
                (alert.action === 'RAISE') && add.push(alert);
                (alert.action === 'CEASE') && remove.push(alert);
            })
        }
        else if (historical) {
            alerts.forEach(alert => {
                (alert.action === 'RAISE') && av.push(alert);
                (alert.action === 'CEASE') && add.push(alert);
            });
        }
        return { add, update, remove, av };
    };

    avSplit = (alerts) => alerts.filter(alert => alert.action === 'RAISE');

    alertStorm = () => {
        this.props.alertStorm();
    };

    getActiveTab = () => ((/\/ci\/|\/gp\/|\/kqi\//g).exec(this.props.location.pathname) || [''])[0].replace(/\//g, '');

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
        addAlertNotifications: (notifications, topic, count) => {
            debugger;
            dispatch(onNewNotifications(notifications, topic, count))
        },
        applyAlerts: (alerts) => {
            debugger;
        },
        alertStorm: () => {
        },
    });

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps)(Notification)
);
