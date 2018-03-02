const _ = require('lodash');

module.exports = (app) => {
    const policiesById = {
        1: {
            id: 1,
            name: 'Policy',
            notification_template: 'Счётчик',
            type: 'SIMPLE',
            threshold: {
                rise_value: '0',
                rise_duration: '1',
                cease_value: '3',
                cease_duration: '4'
            }
        },
        2: {
            id: 2,
            name: 'Шаблон',
            notification_template: 'Шаблон уведомлений',
            type: 'SIMPLE',
            threshold: {
                rise_value: '1',
                rise_duration: '2',
                cease_value: '2',
                cease_duration: '3'
            }
        }
    };
    app.get('/api/v1/policy/all', (req, res) => {
        res.send(_.values(policiesById));
    });

    app.get('/api/v1/policy/:id', (req, res) => {
        if (req.params.id) {
            res.send(policiesById[req.params.id]);
        } else {
            res.status = 401;
            res.end();
        }
    });

    app.post('/api/v1/policy', (req, res) => {
        res.send(Object.assign(
            {},
            req.body,
            {
                id: Date.now()
            }
        ));
    });

    app.put('/api/v1/policy', (req, res) => {
        res.send(req.body);
    });

    app.delete('/api/v1/policy', (req, res) => {
        res.end();
    });

    app.post('/api/v1/policy/:id/condition', (req, res) => {
        res.end();
    });

    app.post('/api/v1/policy/:id/action', (req, res) => {
        res.end();
    });
};