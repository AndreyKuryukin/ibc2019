const proxy = require('express-http-proxy');
const app = require('express')();

const PORT = 8888;

app.use(proxy('192.168.10.16:8088'));

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});