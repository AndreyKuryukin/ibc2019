const _ = require('lodash');

module.exports = (app) => {
    const regions = [{
        id: 1,
        name: 'Москва'
    }, {
        id: 2,
        name: 'Нижегородская область',
    }];

    app.get('/api/v1/common/locations/rf', (req, res) => {
        res.send(regions);
    });
};