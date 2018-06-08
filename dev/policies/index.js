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
        res.send(policies);
    });


    app.post('/api/v1/policy', (req, res) => {
        const policies = readPoliciesFile();
        const policy = Object.assign(
            {},
            req.body,
            {
                id: policies.length
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
    fs.writeFileSync('policies.json', JSON.stringify(policies, undefined, 2));
};

