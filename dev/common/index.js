const _ = require('lodash');
const locations = [
    {
        id: 1,
        name: 'МРФ Волга',
    },
    {
        id: 2,
        name: 'МРФ Москва',
    },
];

const manufacturers = [
    {
        id: 1,
        name: 'Vendor 1',
    },
    {
        id: 2,
        name: 'Vendor 2',
    },
];

const equipments = [
    {
        id: 1,
        name: 'SuperSTB 300-x',
    },
    {
        id: 2,
        name: 'SuperSTB 200-x',
    },
];

const usergroups = [
    {
        id: 1,
        name: 'Группа 1',
    },
    {
        id: 2,
        name: 'Группа 2',
    },
];

const parameters = [
    {
        "name": "vidDataErrors",
        "description": "ошибки видео",
        "id": "345006664698855425"
    },
    {
        "name": "audioDataErrors",
        "description": "ошибки аудио",
        "id": "345006664800993281"
    }
];


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

    app.get('/api/v1/common/location', (req, res) => {
        res.send(locations);
    });

    app.get('/api/v1/common/manufacture', (req, res) => {
        res.send(manufacturers);
    });

    app.get('/api/v1/common/equipment', (req, res) => {
        res.send(equipments);
    });

    app.get('/api/v1/common/parameters', (req, res) => {
        res.send(parameters);
    });

    app.get('/api/v1/common/usergroup', (req, res) => {
        res.send(usergroups);
    });
};