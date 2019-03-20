const moment = require("moment");

const _ = require('lodash');

const details = require('./details.js');
const dynamicKAB = require('./dynamicKAB.js');
const drilldown = require('./drilldown.js');
const barchartKAB = require('./barchartKAB.js');
const ki = require('./ki.js');
const abonents = require('./abonents.js');

const FILTERS = ['feature', 'segment', 'service', 'technology'];

const weights = {
    feature: {
        "LIVE": -3,
        "ALL": 1,
        "PVR": 1,
        "VOD": -1
    },
    segment: {
        "VIP": 3,
        "OTHER": 1,
        "BASE": 1,
        "PRIMIUM": -1
    },
    service: {
        "HUAWEI": 1,
        "OTHER": -1,
        "ZYXEL": 1,
        "ZTE": -1
    },
    technology: {
        "OTHER": 1,
        "XDSL": -2,
        "GPON": 3,
        "FTTB": 1
    },
};

const fakeKqi = (value, filter) => {
    let paramsCount = 0;
    const weightsSum = _.reduce(weights, (result, filterWeights, filterName) => {
        const filterValues = filter[filterName];
        filterValues.forEach((v) => {
            paramsCount = paramsCount + 1;
            result = filterWeights[v] + result;
        });
        return result;
    }, 0);

    if (paramsCount === 0) {
        return value;
    }
    const avgDeverge = weightsSum / paramsCount;
    const delta = 100 - value;
    return value + delta * Math.tanh(avgDeverge);
};

const walkThrough = (details, filter) => {
    const result = _.pick(details, ['id', 'name']);
    result.kqi = fakeKqi(details.kqi, filter);
    result.rf = details.rf.map(region => {
        return { ...region, kqi: fakeKqi(region.kqi, filter) }
    });
    return result;
};

module.exports = (app) => {
    app.get('/api/v1/dashboard/head', (req, res) => {
        res.json({
            KAB: {
                current: 95.5,
                previous: 95.8,
                plan: 95
            },
            KGS: {
                current: 95.8,
                previous: 95.9,
                plan: 95
            },
            KSPD: {
                current: 96.5,
                previous: 95.8,
                plan: 95
            },
        });
    });

    app.post('/api/v1/dashboard/map/detailed', (req, res) => {
        const { type = 'KAB' } = req.body;
        const filter = _.pick(req.body, FILTERS);
        res.json([walkThrough(details[type], filter)]);
    });

    app.get('/api/v1/dashboard/dynamic/kab', (req, res) => {
        const remaped = _.reduce(dynamicKAB, (result, data, key) => {
            result[key] = data.map(reading => {
                return { ...reading, date_time: moment(reading.date_time).add(6, 'months').add(3, 'weeks').toISOString() }
            });
            return result;
        }, {});
        res.json(remaped);
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
