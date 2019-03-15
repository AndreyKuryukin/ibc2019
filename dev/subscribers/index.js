const _ = require("lodash");

const subscribers = require('./suscribers');
const topology = require('./topology');
const metrics =  require('./metrics');
const thresholds =  require('./thresholds');
const kgs =  require('./kgs');
const macs =  require('./macs');
const devices =  require('./devices');
const alerts =  require('./alerts');
const mcast =  require('./mcast');
const neighbors =  require('./neighbors');
const graph =  require('./graph');
const aggregated =  require('./aggregated');

module.exports = (app) => {
    app.get('/api/v1/subscribers', (req, res) => {
        res.send(subscribers);
    });

    app.get('/api/v1/common/subscriber/metrics', (req, res) => {
        // const { query } = req;
        res.send(metrics);
    });

    app.post('/api/v1/subscribers/topology', (req, res) => {
        const san = _.get(req, 'body.san', 'ААААAA');
        res.send(topology[san]);
    });

    app.get('/api/v1/dashboard/thresholds/kqi', (req, res) => {
        res.send(thresholds);
    });

    app.get('/kqi/v1/online/kgs/kgs', (req, res) => {
        res.send(kgs);
    });

    app.get('/kqi/v1/online/kabs/macs', (req, res) => {
        const { query } = req;
        const queryMacs = _.get(query, 'macs', []);
        const result = {
            current: macs.current.filter(mac => queryMacs.includes(mac.id)),
            previous: macs.previous.filter(mac => queryMacs.includes(mac.id)),
        };
        res.send(result);
    });

    app.get('/kqi/v1/online/kabs/devices', (req, res) => {
        const { query } = req;
        const serviceId = _.get(query, 'serviceId');
        res.send(devices[serviceId]);
    });

    app.post('/api/v1/subscribers/alerts', (req, res) => {
        const devices = _.get(req, 'query.devices');
        res.send(alerts[devices]);
    });

    app.get('/kqi/v1/online/kabs/mcast', (req, res) => {
        const { query } = req;
        res.send(mcast);
    });


    app.get('/kqi/v1/online/kabs/neighbors', (req, res) => {
        const { query } = req;
        res.send(neighbors);
    });

    app.get('/kqi/v1/online/kabs/devices/graph/', (req, res) => {
        const { query } = req;
        res.send(graph);
    });

    app.get('/api/v1/subscribers/stb/aggregated', (req, res) => {
        const { query } = req;
        res.send(aggregated);
    });

};