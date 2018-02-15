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


app.listen(8081, () => {
    console.log('listening 8081')
});
