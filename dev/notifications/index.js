const http = require('http');
const StompServer = require('stomp-broker-js');

module.exports = (app) => {
    console.log('Notifications Plug-In ON');

    const server = http.createServer();
    server.listen(9999);

    const stompServer = new StompServer({ server, path: '/notifications', protocol: 'sockjs' });

    stompServer.subscribe("/alerts", function (msg, headers) {
        const topic = headers.destination;
        console.log(topic, "->", msg);
    });

    stompServer.on('connecting', (a, b) => {

    });

    stompServer.on('subscribe', (() => {
        let pinged;
        return () => {
            const ping = (msg) => {
                setTimeout(() => {
                    stompServer.send('/alerts', {}, msg);
                    ping(msg)
                }, 2000)
            };

            if (!pinged) {
                pinged = true;
                ping(JSON.stringify({
                    error: 'NONE | STORM',
                    alerts: [{
                        severity: "CRITICAL",
                        type: "SIMPLE",
                        action: 'RAISE | CEASE',
                        closed: false,
                        duration: 1219232,
                        external_id: "",
                        id: "331f8782-9303-421d-a1fb-b5b851438969",
                        mrf: "69",
                        notification_status: "WAITING",
                        object: "SAN=0303936751094, Л/С=352010230624",
                        policy_name: "123ww",
                        raise_time: "2018-08-16T07:38:24.395",
                        rf: "300001",
                    }]
                }))
            }

        }
    })());


};