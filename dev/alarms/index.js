const group = require('./gp');
const kqi = require('./kqi');

module.exports = (app) => {
    group(app);
    kqi(app);

    app.get('/api/v1/alerts', (req, res) => {
        res.send({
            alarms: [{
                "id": "f00b787b-36de-4dc7-bf28-7734edb6a77b",
                "raise_time": "2018-08-15T13:19:22.568",
                "duration": 585734,
                "policy_name": "e",
                "mrf": "69",
                "rf": "300007",
                "closed": false,
                "object": "SAN=0306951994, Л/С=363020094162",
                "external_id": "",
                "notification_status": "WAITING"
            }, {
                "id": "2524d379-8afd-446f-8e13-f81cbbf60892",
                "raise_time": "2018-08-15T13:19:22.568",
                "duration": 585734,
                "policy_name": "e",
                "mrf": "69",
                "rf": "300012",
                "closed": false,
                "object": "SAN=0313713360, Л/С=316020014716",
                "external_id": "",
                "notification_status": "WAITING"
            }],
            total: 12312,
        });
    });
};