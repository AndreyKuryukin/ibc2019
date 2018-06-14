const _ = require('lodash');
const fs = require('fs');
const proxy = require('express-http-proxy');


const META_DATA = {
    'STB': {
        'STB_SIMPLE': {
            "function_name": "SMART_SPY_SIMPLE",
            "group": "SIMPLE",
            "channel_suppression": true,
            "hierarchy_suppression": true,
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
        },
        'STB_GROUP': {
            "function_name": "SMART_SPY_GROUP",
            "group": "SIMPLE",
            "channel_suppression": false,
            "hierarchy_suppression": false,
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
        }
    },
    'VB': {
        'VB_MULTICAST_SIMPLE': {
            "function_name": "VB_MULTICAST_SIMPLE",
            "group": "GROUP_AGGREGATION",
            "channel_suppression": false,
            "hierarchy_suppression": true,
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
        },
        'VB_UNICAST_GROUP': {
            "function_name": "VB_UNICAST_GROUP",
            "group": "SIMPLE",
            "channel_suppression": true,
            "hierarchy_suppression": true,
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
        }
    },
};

module.exports = (app) => {
    app.get('/api/v1/policy/policyTypes/:objectType', (req, res) => {
        const { objectType } = req.params;
        res.send(Object.keys(META_DATA[objectType]));
    });


    app.get('/api/v1/policy/objectTypes', (req, res) => {
        res.send(Object.keys(META_DATA));
    });

    app.get('/api/v1/policy/function/:objectType/:policyType', (req, res) => {
        const { objectType, policyType } = req.params;
        res.send(META_DATA[objectType][policyType]);
    });

    app.get('/api/v1/policy/:id', (req, res) => {
        const { id } = req.params;
        const policies = readPoliciesFile();
        res.send(policies[id])
    });


    app.get('/api/v1/policy', (req, res) => {
        const policies = readPoliciesFile();
        console.log(policies);
        res.send(policies);
    });


    app.post('/api/v1/policy', (req, res) => {
        const policies = readPoliciesFile();
        const policy = Object.assign(
            {},
            req.body,
            {
                id: policies.length,
                notifications_configs: [{
                    adapter_id: 'CRM',
                    instance_id: 'prod',
                    parameters: [{
                        uid: 'Type1Id',
                        value: 'TechSupport1',
                    }, {
                        uid: 'Type2Id',
                        value: 'Security cam',
                    }, {
                        uid: 'Type3Id',
                        value: 'Cant update PO',
                    }]
                }]
            }
        );
        policies.push(policy);
        writePoliciesToFile(policies);
        res.send(policy);
    });

    app.put('/api/v1/policy', (req, res) => {
        const policy = req.body;
        const policies = readPoliciesFile();
        policies[policy.id || policies.length] = policy;
        res.send(policy);
    });


    //
    // const target = 'http://192.168.192.209:8010';
    // const config = {
    //     proxyReqPathResolver: (req) => {
    //         console.log('Proxied: ' + target + require('url').parse(req.originalUrl).path + ` ${req.method}`);
    //         return target + require('url').parse(req.originalUrl).path;
    app.get('/api/v1/policies/notification/metadata', (req, res) => {
        res.send([{
            adapter_id: 'CRM',
            name: 'CRM',
            instances: [
                { instance_id: 'prod', name: 'Prod'},
                { instance_id: 'test', name: 'Test'}
            ],
            parameters: [{
                type: 'enum',
                uid: 'Type1Id',
                name: 'Type1Id',
                required: true,
                values: [{ name: 'Техподдержка', value: 'TechSupport1' }]
            }, {
                type: 'enum',
                uid: 'Type2Id',
                name: 'Type2Id',
                required: true,
                values: [{
                    name: 'SMS',
                    value: 'Messaging Service',
                }, {
                    name: 'Антивирус и родительский контроль',
                    value: 'Antivirus and parent control',
                }, {
                    name: 'ВЗ/МГ/МН связь',
                    value: 'OT international destination',
                }, {
                    name: 'Видеонаблюдение',
                    value: 'Security cam',
                }, {
                    name: 'Голосовая связь',
                    value: 'Voice connection',
                }]
            }, {
                type: 'enum',
                uid: 'Type3Id',
                name: 'Type3Id',
                required: true,
                values: [{
                    name: 'Задержка доставки сообщений',
                    value: 'Delay delivery of messages',
                }, {
                    name: 'Многократная доставка сообщений',
                    value: 'Многократная доставка сообщений',
                }, {
                    name: 'Не обновляется ПО',
                    value: 'Cant update PO',
                }, {
                    name: 'Прослушивается автоинформатор',
                    value: 'Listening autoinformer',
                }]
            }],
        }, {
            adapter_id: 'EMAIL',
            name: 'EMAIL',
            instances: [
                { instance_id: 'prod', name: 'Prod'},
                { instance_id: 'test', name: 'Test'}
            ],
            parameters: [{
                type: 'enum',
                uid: 'group',
                name: 'Группы',
                multiple: true,
                values: [
                    { name: 'UserGroup 1', value: 'UserGroup1' },
                    { name: 'UserGroup 2', value: 'UserGroup2' },
                    { name: 'UserGroup 3', value: 'UserGroup3' },
                    { name: 'UserGroup 4', value: 'UserGroup4' },
                    { name: 'UserGroup 5', value: 'UserGroup5' },
                    { name: 'UserGroup 6', value: 'UserGroup6' }
                ]
            }, {
                type: 'enum',
                uid: 'users',
                name: 'Пользователи',
                multiple: true,
                values: [
                    { name: 'TestUser 1', value: 'TestUser1' },
                    { name: 'TestUser 2', value: 'TestUser2' }
                ]
            }, {
                type: 'string',
                uid: 'emails',
                name: 'Emails',
                multiple: true
            }]
        }]);
    });
    app.get('/api/v1/policies/:id/notifications', (req, res) => {
        const policies = readPoliciesFile();
        res.send(policies[req.params.id].notifications_configs);
    });
    app.post('/api/v1/policies/:id/notifications', (req, res) => {
        const policies = readPoliciesFile();
        const policy = policies[req.params.id];

        policy.notifications_configs = req.body;
        writePoliciesToFile(policies);

        res.send(req.body);
    });

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
    // };
    // console.log(`Specific proxy for /api/v1/policy  ->  http://192.168.192.209:8010`);
    // app.use('/api/v1/policy', proxy(target, config));

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

const readPoliciesFile = () => {
    let policiesFile;
    try {
        policiesFile = fs.readFileSync('dev/policies/policies.json', 'utf8');
    } catch (e) {
        policiesFile = '[]'
    }
    let policies;
    try {
        policies = JSON.parse(policiesFile);
    } catch (e) {
        policies = [];
    }
    return policies;
};

const writePoliciesToFile = (policies) => {
    fs.writeFileSync('dev/policies/policies.json', JSON.stringify(policies, undefined, 2));
};

