const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const app = express();
app.use(bodyParser.json());

app.post('/login', (req, res) => {
    const login = _.get(req.body, 'login');
    const passwd = _.get(req.body, 'passwd');
    if (login === passwd) {
        res.redirect('/app')
    } else {
        res.status = 401;
        res.end();
    }
});

/* ROLES */
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
app.get('/api/v1/role/user/:login', (req, res) => {
    if (req.params.login) {
        res.send(_.values(rolesById));
    } else {
        res.status = 401;
        res.end();
    }
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

app.listen(8081, () => {
    console.log('listening 8081')
});

