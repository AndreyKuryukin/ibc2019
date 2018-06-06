const details = require('./details.js');

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
};
