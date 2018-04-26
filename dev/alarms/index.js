const group = require('./gp');
const kqi = require('./kqi');

module.exports = (app) => {
    group(app);
    kqi(app);
};