import React from 'react';
import { connect } from 'react-redux';
import SockJS from 'sockjs';
import { flush, onNewNotifications } from '../actions/index';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styles from './styles.scss';

import classnames from "classnames";

import Stomp from '@stomp/stompjs';


class Notification extends React.PureComponent {

    static NOTIFICATION_PORTAL_ID = 'notification-portal';

    static CRITICAL = 'CRITICAL';
    static WARNING = 'WARNING';
    static ACKNOWLEDGEMENT = 'ACKNOWLEDGEMENT';
    static CONFIRMATION = 'CONFIRMATION';

    static propTypes = {};

    static defaultProps = {};

    static childContextTypes = {
        notifications: PropTypes.object.isRequired,
    };

    getChildContext = () => ({
        notifications: {
            notify: this.notify,
            close: this.onNotificationClose,
        }
    });


    constructor(props) {
        super(props);
        this.state = {
            notifications: []
        };
    }

    componentDidMount = () => {
        this.connectToWebSocket('192.168.192.144', 8020)
    };

    onStompMessage = (message, topic) => {
        debugger;
    };

    onWsConnect = (client) => {
        client.subscribe('/alerts', (message) => this.onStompMessage(message, '/alerts'))
    };

    connectToWebSocket = (host = 'localhost', port = 8020, token = localStorage.getItem('jwtToken')) => {

        const url = `http://${host}:${port}/notifications?jwt=${token}&t=${new Date().getTime()}`;
        const socket = new SockJS(url);
        const client = Stomp.over(socket);
        client.connect({}, () => this.onWsConnect(client))
    };

    dispatchNotifications = (notifications, topic) => {
        let count = 0;
        if (_.isArray(notifications)) {
            notifications = _.reduce(notifications, (result, alert) => {
                const { type } = alert;
                if (!_.isArray(result[type])) {
                    result[type] = []
                }
                result[type].push(alert);
                count++;
                return result;
            }, {})
        }
        this.props.onNewNotifications(notifications, topic, count)
    };

    notify = (notif) => {
        const notifications = [...this.state.notifications, notif];
        this.setState({
            notifications: _.uniqBy(notifications, notific => notific.code)
        });
    };

    onNotificationClose = (code) => {
        const { notifications } = this.state;
        const newNotifications = notifications.filter(ntf => ntf.code !== code);
        this.setState({ notifications: newNotifications })
    };

    renderNotifications = () => this.state.notifications.map(notif => {
        const { type = Notification.CRITICAL, message, title, ...rest } = notif;
        const className = classnames(styles.notificationMessage, {
            [styles.criticalMsg]: type === Notification.CRITICAL,
            [styles.confirmationMsg]: type === Notification.CONFIRMATION,
            // [styles.warningMsg]: type === Notification.WARNING,
            // [styles.ackMsg]: type === Notification.ACKNOWLEDGEMENT,
        });
        return <div className={className}
                    key={`notification-msg-${notif.code}`}
        >
            <div>
                {title}
                <br/>
                {message}
                <br/>
                {!_.isEmpty(notif.actions) &&
                <div className={styles.notificationActions}>
                    {notif.actions}
                </div>}
            </div>
            <div className={styles.closeIcon}
                 key={notif.code}
                 onClick={() => this.onNotificationClose(notif.code)}
            />
        </div>
    });

    renderContainer = (props) => {
        return <div id={Notification.NOTIFICATION_PORTAL_ID}
                    key={Notification.NOTIFICATION_PORTAL_ID}
                    className={classnames(styles.notification, props.className)}
        >
            {this.renderNotifications()}
        </div>
    };

    wrapChildren = (children, props) => {
        if (_.isObject(children)) {
            return [this.renderContainer(props), children]
        }
    };

    render() {
        const { children } = this.props;
        return this.wrapChildren(children, this.props);
    }
}


const mapStateToProps = state => ({
    notifications: state.notifications
});

const mapDispatchToProps = dispatch => ({
    onNewNotifications: (msg, topic, count) => dispatch(onNewNotifications(msg, topic, count)),
    onFlushNotifications: (topic, type) => dispatch(flush(topic, type)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Notification);
