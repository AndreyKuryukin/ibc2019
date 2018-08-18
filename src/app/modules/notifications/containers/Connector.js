import SockJS from 'sockjs-client';
import Stomp from '@stomp/stompjs';
import _ from "lodash";

const devMode = DEV_MODE;

class Connector {
    constructor(topics) {
        this.topics = topics;
    };

    connect = () => {
        this._connectToWebSocket()
    };

    disconnect = () => {
        this.client && this.client.disconnect()
    };

    _onWsConnect = (client) => {
        _.reduce(this.topics, (result, onMessage, topicName) => {
            client.subscribe(topicName, (message) => {
                let parsedBody = [];
                try {
                    parsedBody = JSON.parse(message.body)
                } catch (e) {
                    console.error(e)
                }
                onMessage(parsedBody)
            });
            return result && true;
        }, true);
    };

    _connectToWebSocket = (token = localStorage.getItem('jwtToken')) => {
        const url = `${devMode ? 'http://localhost:9999' : ''}/notifications?jwt=${token}`;
        const socket = new SockJS(url);
        const client = Stomp.over(socket);
        client.connect({}, () => {
            this._onWsConnect(client);
            this.client = client;
        }, () => {
            this._connectToWebSocket();
        });
    };

}

export default Connector;