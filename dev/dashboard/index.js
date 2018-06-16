const details = require('./details.js');
const dynamicKAB = require('./dynamicKAB.js');
const drilldown = require('./drilldown.js');
const barchartKAB = require('./barchartKAB.js');
const ki = require('./ki.js');
const abonents = require('./abonents.js');

module.exports = (app) => {
    app.get('/api/v1/dashboard/head', (req, res) => {
        res.json({
            KAB: {
                current: 99.9,
                previous: 99.7,
                plan: 98.5
            },
            KGS: {
                current: 99.9,
                previous: 99.7,
                plan: 98.5
            },
            KSPD: {
                current: 99.9,
                previous: 99.7,
                plan: 98.5
            },
        });
    });
    app.post('/api/v1/dashboard/map/detailed', (req, res) => {
        res.json(details);
    });
    app.get('/api/v1/dashboard/dynamic/kab', (req, res) => {
        res.json(dynamicKAB);
    });
    app.get('/api/v1/dashboard/drilldown', (req, res) => {
        res.json(drilldown);
    });
    app.get('/api/v1/dashboard/barchart/kab', (req, res) => {
        res.json(barchartKAB);
    });
    app.get('/api/v1/dashboard/ki', (req, res) => {
        res.json(ki);
    });
    app.get('/api/v1/dashboard/abonents', (req, res) => {
        res.json(abonents);
    });
};
