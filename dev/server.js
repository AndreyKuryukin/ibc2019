const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
const proxy = require('express-http-proxy');
const querystring = require('querystring');
const request = require('request');

const _ = require('lodash');

const PROXY_HOST = process.env.PROXY_HOST;
const PROXY_PORT = process.env.PROXY_PORT || 8080;
const AUTHORIZE = process.env.AUTHORIZE === 'true';

const PORT = process.env.PROXY_PORT || 8088;

const USER_NAME = process.env.USER_NAME || 'User';
const PASSWORD = process.env.PASSWORD || 'User';

const AUTHORIZATION_PATH = 'api/v1/authorize';

const app = express();
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
    './users'
];

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});


function useStatic() {
    const buildPath = path.resolve(__dirname, '../build');
    app.use('/*.css', function (req, res) {
        res.sendFile(path.resolve(__dirname, '../build/styles.css'));
    });
    app.use('/*.js', function (req, res) {
        res.sendFile(path.resolve(__dirname, '../build/app.js'));
    });

    app.use('/*', express.static(buildPath, {
        index: 'index.html',
    }));

    app.listen(PORT, () => {
        console.log(`Listening on ${app.get('port')}`);
    })
}
;
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

function getToken(headers) {
    return headers['authorization'];
}

function authorize(hostname, port) {
    return AUTHORIZE ? new Promise((resolve, reject) => {
        console.log('Authorisation ...')
        const form = {
            login: USER_NAME,
            password: PASSWORD,
        };
        const formData = querystring.stringify(form);
        const contentLength = formData.length;
        const authUrl = `http://${hostname}:${port}/${AUTHORIZATION_PATH}`;

        request({
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            uri: authUrl,
            body: formData,
            method: 'POST',
        }, (err, res) => {
            if (!err && res.statusCode === 200) {
                resolve(getToken(res.headers));
            } else {
                reject(err);
            }
        });
    }) : Promise.resolve(null);
}

if (PROXY_HOST) {
    authorize(PROXY_HOST, PROXY_PORT).then((token) => {
        if (token) {
            console.log(`Authorization success on ${PROXY_HOST}:${PROXY_PORT} token: "${token}"`);
        }
        const target = `http://${PROXY_HOST}:${PROXY_PORT}`;
        const config = {
            proxyReqPathResolver: (req) => {
                return target + require('url').parse(req.originalUrl).path;
            },
            proxyReqOptDecorator: (proxyReqOpts) => {
                proxyReqOpts.headers['authorization'] = token;
                return proxyReqOpts;
            },
        };
        app.use('/api/*', proxy(target, config));
        useStatic();
        console.log(`Proxied to ${PROXY_HOST}:${PROXY_PORT}`);
    }).catch((e) => {
        console.error(`problem with request: ${e.message}`);
    });
} else {
    plugIn(app, plugins);
    useStatic();
}
