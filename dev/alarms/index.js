const group = require('./gp');
const kqi = require('./kqi');

module.exports = (app) => {
    group(app);
    kqi(app);

    app.get('/api/v1/alerts', (req, res) => {
        let alerts = [];
        const { type, closed } = req.query;
        if (global.alertsGenerator) {
            alerts = (global.alertsGenerator.getAlerts() || []).filter(alert => alert.type === type);
        }
        if (closed) {
            alerts = alerts.filter(alert => closed === String(alert.closed))
        }
        res.send({
            alerts,
            total: alerts.length,
        });
    });
    app.get('/api/v1/alerts/:id', (req, res) => {
        let { id } = req.params;
        const alerts = (global.alertsGenerator.getAlerts() || []);
        const alertIndex = alerts.findIndex(alert => alert.id === id);
        let alert = {};
        if (alertIndex !== -1) {
            alert = alerts[alertIndex];
        }
        res.send(alert);
    });
};