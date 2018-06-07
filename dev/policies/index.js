const _ = require('lodash');
const proxy = require('express-http-proxy');

const policyTypes = {
    'STB': ['Type1', 'Type2'],
    'VB': ['Type3', 'Type4'],
};

const vbMetaData = {
    "function_name": "VB_MULTICAST_SIMPLE",
    "group": "GROUP_AGGREGATION",
    "channel_suppression": "false",
    "hierarchy_suppression": "true",
    "parameters": [
        {
            "name": "type",
            "type": "enum",
            "operators": [
                "!=",
                "="
            ],
            "values": [
                "mlr",
                "bitrate"
            ]
        }
    ]
};
const sbtMetaData = {
    "function_name": "SMART_SPY_SIMPLE",
    "group": "SIMPLE",
    "channel_suppression": "true",
    "hierarchy_suppression": "true",
    "parameters": [
        {
            "name": "linkFaults",
            "type": "integer",
            "operators": [
                ">",
                "<",
                "="
            ]
        },
        {
            "name": "lost",
            "type": "integer",
            "operators": [
                ">",
                "<",
                "="
            ]
        },
        {
            "name": "lostOverflow",
            "type": "integer",
            "operators": [
                ">",
                "<",
                "="
            ]
        }
    ]
};

module.exports = (app) => {
    // app.get('/api/v1/policy/policyTypes/:objectType', (req, res) => {
    //     const { objectType } = req.params;
    //     res.send(policyTypes['STB'])
    // });
    //
    //
    // app.get('/api/v1/policy/objectTypes', (req, res) => {
    //     res.send(["SBT", "VB"]);
    // });
    //
    // app.get('/api/v1/policy/function/:objectType/:policyType', (req, res) => {
    //     const { objectType } = req.params;
    //     res.send(objectType === 'SBT' ? sbtMetaData : vbMetaData);
    // });
    app.get('/api/v1/policy/354591424089292801', (req, res) => {

        res.send({
            "name": "Test",
            "notification_template": null,
            "threshold": {
                "rise_value": 1000,
                "rise_duration": 1000,
                "cease_value": 1000,
                "cease_duration": 1000,
                "id": "354623693906935809"
            },
            "scope": [],
            "policy_type": "VB_UNICAST_SIMPLE",
            "scope_type": null,
            "channel_suppression": true,
            "parent_policy": null,
            "suppression_timeout": 0,
            "objectType": "STB",
            "condition": {
                "condition": "%7B%22conjunction%22%3A%7B%22conjunctionList%22%3A%5B%7B%22value%22%3A%22aid%20!%3D%201%22%7D%2C%7B%22value%22%3A%22aid%20%3D%208%22%7D%5D%2C%22type%22%3A%22OR%22%7D%2C%22conditionDuration%22%3A%226%22%7D",
                "id": "354623693847166977"
            },
            "id": "354591424089292801",
            "allow_accident": true,
            "waiting_time": "3"
        });

    });

    const target = 'http://192.168.192.209:8010';
    const config = {
        proxyReqPathResolver: (req) => {
            console.log('Proxied: ' + target + require('url').parse(req.originalUrl).path + ` ${req.method}`);
            return target + require('url').parse(req.originalUrl).path;
        },
    };
    console.log(`Specific proxy for /api/v1/policy  ->  http://192.168.192.209:8010`);
    app.use('/api/v1/policy', proxy(target, config));

    // const policiesById = {
    //     1: {
    //         id: 1,
    //         name: 'Policy',
    //         notification_template: 'Счётчик',
    //         type: 'SIMPLE',
    //         threshold: {
    //             rise_value: '0',
    //             rise_duration: '1',
    //             cease_value: '3',
    //             cease_duration: '4'
    //         }
    //     },
    //     2: {
    //         id: 2,
    //         name: 'Шаблон',
    //         notification_template: 'Шаблон уведомлений',
    //         type: 'SIMPLE',
    //         threshold: {
    //             rise_value: '1',
    //             rise_duration: '2',
    //             cease_value: '2',
    //             cease_duration: '3'
    //         }
    //     }
    // };
    // app.get('/api/v1/policy/all', (req, res) => {
    //     res.send(_.values(policiesById));
    // });
    //
    //
    // app.post('/api/v1/policy', (req, res) => {
    //     res.send(Object.assign(
    //         {},
    //         req.body,
    //         {
    //             id: Date.now()
    //         }
    //     ));
    // });
    //
    // app.put('/api/v1/policy', (req, res) => {
    //     res.send(req.body);
    // });
    //
    // app.delete('/api/v1/policy', (req, res) => {
    //     res.end();
    // });
    //
    // app.post('/api/v1/policy/:id/condition', (req, res) => {
    //     res.end();
    // });
    //
    // app.post('/api/v1/policy/:id/action', (req, res) => {
    //     res.end();
    // });
};