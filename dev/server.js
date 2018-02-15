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

app.get('/api/v1/role/user/:login', (req, res) => {
    if (req.params.login) {
        res.send([{
            id: 1,
            name: 'SuperAdmin',
            description: 'Comment for SuperAdmin'
        }, {
            id: 2,
            name: `${req.params.login} role`,
            description: 'Your role'
        }]);
    } else {
        res.status = 401;
        res.end();
    }
});

app.listen(8081, () => {
    console.log('listening 8081')
});

