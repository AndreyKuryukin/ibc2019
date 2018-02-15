const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

const plugins = [
    './login'
];


const plugIn = (app, plugins) => {
    plugins.forEach((pluginPath) => {
        try {
            const plugin = require(pluginPath);
            if (plugin && typeof plugin === 'function') {
                plugin(app);
            }
        } catch (e) {
            console.error(e);
        }
    })
};

plugIn(app, plugins);


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
