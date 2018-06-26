const proxy = require('express-http-proxy');
const app = require('express')();

const PORT = 8888;

app.use(proxy('213.59.226.184:8088'));

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});