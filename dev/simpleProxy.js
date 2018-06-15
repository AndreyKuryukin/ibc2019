const proxy = require('express-http-proxy');
const app = require('express')();

const PORT = 8888;

app.use(proxy('192.168.192.204:8010'));

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});