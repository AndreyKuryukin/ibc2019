module.exports = (app) => {
    const kqiResults = [
        {
            id: 1,
            name: 'Кгс',
            kpi_parameter_type: '23',
            ['kpi-object_type']: 'STB',
            operator: 'EQ',
            level: '1.1',
            projection_count: 10,
        },
        {
            id: 2,
            name: 'Каб',
            kpi_parameter_type: '11',
            ['kpi-object_type']: 'ACC',
            operator: 'GT',
            level: '1.1',
            projection_count: 2,
        },
        {
            id: 3,
            name: 'Кспд',
            kpi_parameter_type: '10',
            ['kpi-object_type']: 'AGG',
            operator: 'LT',
            level: '1.1',
            projection_count: 5,
        },
    ];

    const projectionsByKqiId = {
        1: [{
            projection_id: 1,
            projection_name: 'МРФ_Волга',
            results: [
                {
                    id: 10,
                    creation_date: new Date(),
                    author: 'User 1',
                    status: 'SUCCESS'
                },
                {
                    id: 11,
                    creation_date: new Date(),
                    author: 'User 2',
                    status: 'FAILED'
                },
                {
                    id: 12,
                    creation_date: new Date(),
                    author: 'User 3',
                    status: 'RUNNING'
                }
            ]
        }],
        2: [{
            projection_id: 2,
            projection_name: 'МРФ_Волга',
            results: [
                {
                    id: 20,
                    creation_date: new Date(),
                    author: 'User 4',
                    status: 'FAILED'
                }
            ]
        }],
        3: [{
            projection_id: 3,
            projection_name: 'МРФ_Волга',
            results: []
        }, {
            projection_id: 4,
            projection_name: 'МРФ',
            results: [
                {
                    id: 40,
                    creation_date: new Date(),
                    author: 'User 5',
                    status: 'FAILED'
                }
            ]
        }]
    };

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

    app.get('/api/v1/kqi/:id/projection', (req, res) => {
        if (req.params.id) {
            const response = projectionsByKqiId[req.params.id] || null;
            res.send(response);
        } else {
            res.status = 401;
            res.end();
        }
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