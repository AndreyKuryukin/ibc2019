const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const proxy = require('express-http-proxy');
const querystring = require('querystring');
const request = require('request');
const http = require('http');
const WebSocket = require('ws');

const _ = require('lodash');

const PROXY_HOST = process.env.PROXY_HOST;
const PROXY_PORT = process.env.PROXY_PORT || 8080;
const AUTHORIZE = process.env.AUTHORIZE === 'true';
const INTERCEPT = process.argv.indexOf('--intercept') !== -1;


const PORT = process.env.PORT || 8088;

const USER_NAME = process.env.USER_NAME || 'User';
const PASSWORD = process.env.PASSWORD || 'User';

const AUTHORIZATION_PATH = 'api/v1/authorize';

const app = express();
require('express-ws')(app);

app.use(bodyParser.json({
    limit: '50mb',
}));
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.set('etag', false);
app.set('port', (PORT));

const plugins = [
    './login',
    './roles',
    './users',
    './policies',
    './kqi',
    './reports',
    './sources',
    './alarms',
    './common',
    './dashboard',
    './notifications',
];

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});


function useStatic() {
    const buildPath = path.resolve(__dirname, '../build');
    const filesPath = path.resolve(__dirname, buildPath, 'files');
    app.use('/*.css', function (req, res) {
        res.sendFile(path.resolve(__dirname, '../build/styles.css'));
    });
    app.use('/*.js', function (req, res) {
        res.sendFile(path.resolve(__dirname, '../build/app.js'));
    });
    app.use('/*.json', function (req, res) {
        res.sendFile(path.resolve(__dirname, `../build${req.baseUrl}`));
    });
    app.use('/*.ico', function (req, res) {
        res.sendFile(path.resolve(__dirname, '../build/favicon.ico'));
    });
    app.use('/*', express.static(buildPath, {
        index: 'index.html',
    }));

    app.listen(PORT, () => {
        console.log(`Listening on ${app.get('port')}`);
    })
}

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



if (PROXY_HOST) {
    const target = `http://${PROXY_HOST}:${PROXY_PORT}`;
    const config = {
        proxyReqPathResolver: (req) => {
            console.log('Proxied: ' + target + require('url').parse(req.originalUrl).path + ` ${req.method}`);
            return target + require('url').parse(req.originalUrl).path;
        },
    };
    if (INTERCEPT) {
        console.log('Intercept mode ON');
        plugIn(app, plugins);
    }

    app.use('/api/*', proxy(target, config));
    app.use('/policy/*', proxy(target, config));
    app.use('/data/*', proxy(target, config));
    useStatic();
    console.log(`Proxied to ${PROXY_HOST}:${PROXY_PORT}`);

} else {
    plugIn(app, plugins);
    useStatic();
}
