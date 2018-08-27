const group = require('./gp');
const kqi = require('./kqi');

module.exports = (app) => {
    group(app);
    kqi(app);

    app.get('/api/v1/alerts', (req, res) => {
        let alerts = [];
        if (global.alertsGenerator) {
            alerts = global.alertsGenerator.getAlerts()
        }
        res.send({
            alerts,
            total: alerts.length,
        });
    });
};