const _ = require('lodash');

module.exports = (app) => {
    const kqiResults = [
        {
            id: 1,
            branch: 'Нижегородский',
            technology: 'DSL',
            result: '99%',
            weight: '0.1',
        },
        {
            id: 2,
            branch: 'Кировский',
            technology: 'GPON',
            result: '99.9%',
            weight: '0.2',
        },
        {
            id: 3,
            branch: 'Пензенский',
            technology: 'Ethernet',
            result: '98%',
            weight: '0.04',
        },
    ];

    app.get('/api/v1/kqi/all', (req, res) => {
        res.send(kqiResults);
    });
};