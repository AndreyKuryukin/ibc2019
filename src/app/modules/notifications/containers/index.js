import React from 'react';
import { connect } from 'react-redux';
import SockJS from 'sockjs-client';
import { onNewNotifications } from '../actions/index';
import _ from 'lodash';

import Stomp from '@stomp/stompjs';

const devMode = DEV_MODE;

class Notification extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            notifications: []
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.loggedIn !== nextProps.loggedIn) {
            if (nextProps.loggedIn) {
                this.connectToWebSocket();
            } else {
                this.state.client && this.state.client.disconnect()
            }
        }
    }

    onWsConnect = (client) => {
        client.subscribe('/alerts', (message) => {
            let parsedBody = [];
            try {
                parsedBody = JSON.parse(message.body)
            } catch (e) {
                console.error(e)
            }
            this.dispatchNotifications(parsedBody, 'alerts')
        })
    };

    connectToWebSocket = (token = localStorage.getItem('jwtToken')) => {
        const url = `${devMode ? 'http://localhost:9999' : ''}/notifications?jwt=${token}`;
        const socket = new SockJS(url);
        const client = Stomp.over(socket);
        client.connect({}, () => {
            this.onWsConnect(client);
            this.setState({ client });
        }, () => {
            this.connectToWebSocket();
        });
    };

    dispatchNotifications = (message, topic) => {
        let notifications = message.alerts;
        let count = 0;
        if (_.isArray(notifications)) {
            count = notifications.length;
            notifications = _.reduce(notifications, (result, alert) => {
                const { type } = alert;
                if (!_.isArray(result[type])) {
                    result[type] = []
                }
                result[type].push(alert);
                return result;
            }, {})
        }
        this.props.onNewNotifications(notifications, topic, count)
    };

    render() {
        return '';
    }
}


const mapStateToProps = state => ({
    notifications: state.notifications
});

const mapDispatchToProps = dispatch => ({
    onNewNotifications: (notifications, topic, count) => dispatch(onNewNotifications(notifications, topic, count)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Notification);
