const _ = require("lodash");
const moment = require("moment");

const subscribers = require('./suscribers');
const stbs = require('./stbs');
const accs = require('./accs');
const kabByServices = require('./kabByServices');
const sans = require('./sans');

const metrics = require('./metrics');
const aggregated = require('./aggregated');

const thresholds = require('./thresholds');
const kgs = require('./kgs');

const neighbors = require('./neighbors');
const stbData = require('./stbData');

const alerts = require('./alerts');
const alertsDetails = require('./alertsDeatils');

module.exports = (app) => {
    // OK
    app.get('/api/v1/subscribers', (req, res) => {
        const {serviceId: service_id, san, nls, mac} = _.get(req, 'query', {});
        const query = {service_id, san, nls, mac};
        res.send(subscribers.filter(sub => Object.keys(query).filter(field => {
            return query[field] && sub[field] && sub[field].indexOf(query[field]) !== -1
        }).length > 0));
    });

    // ОК
    app.get('/kqi/v1/online/kabs/macs', (req, res) => {
        const {query} = req;
        const queryMacs = _.get(query, 'macs', '').split(',');
        const devices = queryMacs.map(mac => stbs[mac]).filter(dev => !!dev);
        const result = {
            current: devices.map(dev => dev.kabByServices.current),
            previous: devices.map(dev => dev.kabByServices.previous),
        };
        res.send(result);
    });

    // OK
    app.get('/kqi/v1/online/kabs/devices/graph/', (req, res) => {
        const {query} = req;
        res.send(Object.values(stbs).concat(Object.values(accs)).map(dev => ({
            id: dev.id,
            value: dev.graph
        })));
    });

    // OK
    app.get('/kqi/v1/online/kabs/macs/graph', (req, res) => {
        const {query} = req;
        const queryMacs = _.get(query, 'macs');
        if (_.isArray(queryMacs)) {
            const result = Object.keys(stbs).filter(mac => queryMacs.includes(mac)).map(mac => ({
                    id: mac,
                    value: stbs[mac].graph
                })
            );
            res.send(result);
        } else if (queryMacs) {
            const result = {id: queryMacs, value: stbs[queryMacs].graph};
            res.send([result]);
        }
    });
    // OK
    app.post('/api/v1/subscribers/topology', (req, res) => {
        const san = _.get(req, 'body.san', '');
        res.send(sans[san]);
    });

    // OK
    app.get('/api/v1/common/subscriber/metrics', (req, res) => {
        // const { query } = req;
        res.send(metrics);
    });

    // OK
    app.get('/api/v1/dashboard/thresholds/kqi', (req, res) => {
        res.send(thresholds);
    });

    // OK
    app.get('/kqi/v1/online/kgs/kgs', (req, res) => {
        res.send(kgs);
    });

    // OK
    app.get('/kqi/v1/online/kabs/devices', (req, res) => {
        const {query} = req;
        const serviceId = _.get(query, 'serviceId');
        res.send(kabByServices[serviceId]);
    });

    // OK
    app.get('/kqi/v1/online/kabs/mcast', (req, res) => {
        const mac = _.get(req, 'query.mac', '');
        const mcast = _.get(stbs, `${mac}.mcast`, []);
        res.send(mcast);
    });

    // OK
    app.get('/kqi/v1/online/kabs/neighbors', (req, res) => {
        const {query} = req;
        res.send(neighbors);
    });



    // ??????????????????
    app.get('/api/v1/subscribers/stb/aggregated', (req, res) => {
        const {query} = req;
        res.send(aggregated);
    });

    app.get('/api/v1/subscribers/stb/data', (req, res) => {
        const paramKey = _.get(req, 'query.paramKey');
        res.send(stbData[paramKey]);
    });

    app.get('/api/v1/alerts/:alertId', (req, res) => {
        const alertId = _.get(req, 'params.alertId', '');
        const alert = alerts.alertsById[alertId];
        res.send(alert);
    });

    app.post('/api/v1/subscribers/alerts', (req, res) => {
        const devices = _.get(req, 'query.devices', '').split(',');
        const subscriberAlerts = _.reduce(alerts, (result, alrts, mac) => {
            if (mac === devices || _.find(devices, dev => dev === mac)) {
                result = result.concat(alrts)
            }
            return result
        }, []);
        res.send(subscriberAlerts);
    });

};