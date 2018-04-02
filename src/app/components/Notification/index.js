import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import styles from './styles.scss';
import classnames from "classnames";

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

export default Notification;
