const _ = require('lodash');

module.exports = (app) => {
    const rolesById = {
        1: {
            id: 1,
            name: 'SuperAdmin',
            number: '1',
            description: 'Comment for SuperAdmin',
            subjects: ['ALERTS']
        },
        2: {
            id: 2,
            name: `User`,
            number: '4',
            description: 'Usual role',
            subjects: ['MAIN', 'CHARTS']
        }
    };
    app.get('/api/v1/role/all', (req, res) => {
        res.send(_.values(rolesById));
    });

    app.get('/api/v1/role/:id', (req, res) => {
        if (req.params.id) {
            res.send(rolesById[req.params.id]);
        } else {
            res.status = 401;
            res.end();
        }
    });

    app.post('/api/v1/role', (req, res) => {
        res.send(Object.assign(
            {},
            req.body,
            {
                id: Date.now()
            }
        ));
    });

    app.put('/api/v1/role', (req, res) => {
        res.send(req.body);
    });

    app.get('/api/v1/subjects', (req, res) => {
        res.send(['MAIN', 'ALERTS', 'CHARTS']);
    });

    app.delete('/api/v1/role', (req, res) => {
        res.end();
    });
};