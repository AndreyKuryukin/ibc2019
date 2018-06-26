const proxy = require('express-http-proxy');

const _ = require('lodash');


module.exports = (app) => {
    // const gpAlarmsById = {
    //     123: {
    //         id: 123,
    //         raise_time: new Date(),
    //         policy_name: 'Alarm_VLG_STB_LOSS_PERFOMANCE',
    //         duration: 431999,
    //         priority: 'Critical',
    //         notification_text: 'Потеря пакетов (счетчик СС на STB) несколькими абонементами на агрегационном свитче nnov_ag_sw_1 (ip = 1.2.3.4)',
    //         notified: [{
    //             type: 'EMAIL',
    //             status: 'FAILED'
    //         }, {
    //             type: 'SMS',
    //             status: 'SUCCESS'
    //         }],
    //         attributes: ['attr1=attr1', 'attr2=attr2'],
    //         mrf: 1,
    //         rf: 2,
    //     },
    //     124: {
    //         id: 124,
    //         raise_time: new Date(),
    //         policy_name: 'Alarm_VLG_STB_LOSS_PERFOMANCE',
    //         duration: 3600,
    //         priority: 'Major',
    //         notification_text: 'Потеря пакетов (счетчик СС на STB) несколькими абонементами на агрегационном свитче nnov_ag_sw_1 (ip = 1.2.3.4)',
    //         notified: [{
    //             type: 'EMAIL',
    //             status: 'SUCCESS'
    //         }, {
    //             type: 'TICKET',
    //             status: 'FAILED'
    //         }],
    //         attributes: ['attr1=attr1', 'attr2=attr2'],
    //         mrf: 1,
    //         rf: 1,
    //     },
    //     1234: {
    //         id: 1234,
    //         raise_time: new Date(),
    //         policy_name: 'Alarm_VLG_STB_LOSS_PERFOMANCE',
    //         duration: 123456,
    //         priority: 'Critical',
    //         notification_text: 'Потеря пакетов (счетчик СС на STB) несколькими абонементами на агрегационном свитче nnov_ag_sw_1 (ip = 1.2.3.4)',
    //         notified: [{
    //             type: 'SMS',
    //             status: 'SUCCESS'
    //         }, {
    //             type: 'TICKET',
    //             status: 'FAILED'
    //         }],
    //         attributes: ['attr1=attr1', 'attr2=attr2'],
    //         mrf: 2,
    //         rf: 1,
    //     },
    //     222: {
    //         id: 222,
    //         raise_time: new Date(),
    //         policy_name: 'Alarm_VLG_STB_LOSS_PERFOMANCE',
    //         duration: 286999,
    //         priority: 'Low',
    //         notification_text: 'Потеря пакетов (счетчик СС на STB) несколькими абонементами на агрегационном свитче nnov_ag_sw_1 (ip = 1.2.3.4)',
    //         notified: [{
    //             type: 'SMS',
    //             status: 'SUCCESS'
    //         }, {
    //             type: 'EMAIL',
    //             status: 'FAILED'
    //         }],
    //         attributes: ['attr1=attr1', 'attr2=attr2'],
    //         mrf: 2,
    //         rf: 2,
    //     },
    //     321: {
    //         id: 321,
    //         raise_time: new Date(),
    //         policy_name: 'Alarm_VLG_STB_LOSS_PERFOMANCE',
    //         duration: 444999,
    //         priority: 'Low',
    //         notification_text: 'Потеря пакетов (счетчик СС на STB) несколькими абонементами на агрегационном свитче nnov_ag_sw_1 (ip = 1.2.3.4)',
    //         notified: [{
    //             type: 'SMS',
    //             status: 'SUCCESS'
    //         }, {
    //             type: 'EMAIL',
    //             status: 'FAILED'
    //         }],
    //         attributes: ['attr1=attr1', 'attr2=attr2'],
    //         mrf: 1,
    //         rf: 2,
    //     },
    // };

    // app.get('/api/v1/alarms/gp', (req, res) => {
    //     setTimeout(() => {
    //         res.send(
    //             _.chain(gpAlarmsById)
    //                 .values()
    //                 .filter(gp => req.query.mrf ? gp.mrf == req.query.mrf : !req.query.mrf)
    //                 .filter(gp => req.query.rf ? gp.rf == req.query.rf : !req.query.rf)
    //                 .value()
    //         );
    //     }, 1000);
    // });
    //
    // app.get('/api/v1/alarms/gp/:id', (req, res) => {
    //     if (req.params.id) {
    //         res.send(gpAlarmsById[req.params.id]);
    //     } else {
    //         res.status = 401;
    //         res.end();
    //     }
    // });

    // const target = 'http://192.168.192.209:8010';
    // const config = {
    //     proxyReqPathResolver: (req) => {
    //         console.log('Proxied: ' + target + require('url').parse(req.originalUrl).path + ` ${req.method}`);
    //         return target + require('url').parse(req.originalUrl).path;
    //     },
    // };
    // console.log(`Specific proxy for /api/v1/alerts  ->  http://192.168.192.209:8010`);
    // app.use('/api/v1/alerts', proxy(target, config))

    app.use('/api/v1/alerts/684017e8-5e1c-457e-a5fa-d93fc246e0ba', (req, res) => {
        res.send({
            "notification_text": "Line 1\nLine 2\nEnd",
            "notified": [{ "type": "SMS", "status": "UNKNOWN" }, {
                "type": "EMAIL",
                "status": "UNKNOWN"
            }, { "type": "CRM", "status": "UNKNOWN" }],
            "attributes": {
                "SAN": "030397733788769",
                "SUPPRESSION_TIMEOUT": "0",
                "REGION_ID": "300001",
                "MAC": "001A790256FF",
                "POLICY_ID": "358587294912544770",
                "POLICY_TYPE": "SMART_SPY_SIMPLE",
                "AFFILIATE_ID": "VLG.NNV",
                "MRF_ID": "69",
                "TECH": "FTTB",
                "POLICY_NAME": "ddff",
                "STATE": "RISE",
                "SUB_REGION_ID": "0",
                "NLS": "352012223579"
            },
            "id": "684017e8-5e1c-457e-a5fa-d93fc246e0ba",
            "duration": 263432893,
            "mrf": "69",
            "rf": "300001",
            "closed": false,
            "object": "SAN=030397733788769, Л/С=352012223579",
            "raise_time": "2018-06-22T11:33:13.679",
            "policy_name": "ddff"
        })
    })
};