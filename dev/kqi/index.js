module.exports = (app) => {
    const kqiResults = [
        {
            location: 'Нижегородский',
            last_mile_technology: 'FTTB',
            last_inch_technology: 'WIFI',
            manufacturer: 'Hawai',
            equipment_type: 'EquipmentType',
            abonent_group: 'Все',
            date_time: '2018-04-01T00:12:21.434',
            value: 99.95,
            weight: 0.1
        },
        {
            location: 'Нижегородский',
            last_mile_technology: 'FTTB',
            last_inch_technology: 'WIFI',
            manufacturer: 'Hawai',
            equipment_type: 'EquipmentType',
            abonent_group: 'Некоторые',
            date_time: '2018-04-01T00:12:21.434',
            value: 99.95,
            weight: 0.1
        }
    ];

    const history = [
        {
            location: 'Нижегородский',
            last_mile_technology: 'FTTB',
            last_inch_technology: 'WIFI',
            manufacturer: 'Hawai',
            equipment_type: 'EquipmentType',
            abonent_group: 'Некоторые',
            date_time: '2018-04-01T00:12:21.434',
            values: [
                {
                    date_time: '2018-04-01T00:12:30',
                    value: 52
                },
                {
                    date_time: '2018-04-01T00:12:40',
                    value: 47
                },
                {
                    date_time: '2018-04-01T00:12:50',
                    value: 68
                },
                {
                    date_time: '2018-04-01T00:13:00',
                    value: 41
                },
                {
                    date_time: '2018-04-01T00:13:10',
                    value: 79
                },
            ]
        }
    ];

    const kpi = [
        {
            id: 1,
            name: 'STB Packet Loss Performa',
            description: 'Small description',
            kpiObjectType: 'STB',
        },
        {
            id: 2,
            name: 'KPI 1',
            description: 'Description',
            kpiObjectType: 'ACC',
        },
        {
            id: 3,
            name: 'KPI 2',
            description: 'Description',
            kpiObjectType: 'AGG',
        },
    ];

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


    app.get('/api/v1/kqi/:configId/projection/:projectionId/result/:resultId', (req, res) => {
        res.send(kqiResults);
    });

    app.post('/api/v1/kqi/:configId/projection/:projectionId/result/:resultId', (req, res) => {
        res.send(history);
    });


    app.get('/api/v1/kqi/location', (req, res) => {
        res.send(locations);
    });

    app.get('/api/v1/kqi/manufacture', (req, res) => {
        res.send(manufacturers);
    });

    app.get('/api/v1/kqi/equipment', (req, res) => {
        res.send(equipments);
    });

    app.get('/api/v1/kqi/usergroup', (req, res) => {
        res.send(usergroups);
    });

    app.post('/api/v1/kqi', (req, res) => {
        res.send(Object.assign(
            {},
            req.body,
            {
                id: Date.now()
            }
        ));
    });

    app.get('/api/v1/kpi/all', (req, res) => {
        res.send(kpi);
    });

    app.post('/api/v1/kpi', (req, res) => {
        res.send(Object.assign(
            {},
            req.body,
            {
                id: Date.now()
            }
        ));
    });
};