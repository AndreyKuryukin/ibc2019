const group = require('./gp');
const kqi = require('./kqi');

module.exports = (app) => {
    group(app);
    kqi(app);

    app.get('/api/v1/alerts', (req, res) => {
        res.send({
            alerts: [{
                severity: "CRITICAL",
                type: 'SIMPLE',
                closed: false,
                duration: 1219232,
                external_id: "",
                id: 1,
                mrf: 3,
                notification_status: "WAITING",
                object: "SAN=0303936751094, Л/С=352010230624",
                policy_name: "T2",
                raise_time: new Date().toISOString(),
                rf: 145453,
                san: '1231qwe3eds2',
                mac: ['111111111111', '333CCCCCCCCC'],
                nls: '666',
                object: 'object',
            }, {
                severity: "CRITICAL",
                type: 'SIMPLE',
                closed: false,
                duration: 1219232,
                external_id: "",
                id: 2,
                mrf: 3,
                notification_status: "WAITING",
                object: "SAN=0303936751094, Л/С=352010230624",
                policy_name: "T2",
                raise_time: new Date().toISOString(),
                rf: 145453,
                san: '1231qwe3eds2',
                mac: ['111111111111', '333CCCCCCCCC'],
                nls: '666',
                object: 'object',
            }],
            total: 2,
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