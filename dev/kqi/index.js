const _ = require("lodash");

const fs = require('fs');

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
            id: 1,
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
                    value: 99.1
                },
                {
                    date_time: '2018-04-02T00:12:40',
                    value: 97
                },
                {
                    date_time: '2018-04-03T00:12:50',
                    value: 98
                },
                {
                    date_time: '2018-04-04T00:13:00',
                    value: 98.5
                },
                {
                    date_time: '2018-04-05T00:13:10',
                    value: 98.9
                },
                {
                    date_time: '2018-04-06T00:13:20',
                    value: 99.1
                },
                {
                    date_time: '2018-04-07T00:13:30',
                    value: 97
                },
                {
                    date_time: '2018-04-08T00:13:40',
                    value: 98
                },
                {
                    date_time: '2018-04-09T00:13:50',
                    value: 98.5
                },
                {
                    date_time: '2018-04-10T00:14:00',
                    value: 98.9
                },
            ]
        },
        {
            id: 2,
            location: 'Нижегородский',
            last_mile_technology: 'FTTB',
            last_inch_technology: 'WIFI',
            manufacturer: 'Hawai',
            equipment_type: 'EquipmentType',
            abonent_group: 'Все',
            date_time: '2018-04-01T00:12:21.434',
            values: [
                {
                    date_time: '2018-04-01T00:12:30',
                    value: 99.8
                },
                {
                    date_time: '2018-04-02T00:12:40',
                    value: 99.4
                },
                {
                    date_time: '2018-04-03T00:12:50',
                    value: 97.5
                },
                {
                    date_time: '2018-04-04T00:13:00',
                    value: 98.5
                },
                {
                    date_time: '2018-04-05T00:13:10',
                    value: 98.6
                },
                {
                    date_time: '2018-04-06T00:13:20',
                    value: 99.1
                },
                {
                    date_time: '2018-04-07T00:13:30',
                    value: 97
                },
                {
                    date_time: '2018-04-08T00:13:40',
                    value: 99
                },
                {
                    date_time: '2018-04-09T00:13:50',
                    value: 98
                },
                {
                    date_time: '2018-04-10T00:14:00',
                    value: 90
                },
            ]
        }
    ];

    const kpi = [
        {
            id: 1,
            name: 'Кгс',
            kpi_parameter_type: '1',
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

    const projectionResults = [
        {
            id: 10,
            creation_date: '2018-04-01T00:13:10',
            author: 'User 1',
            status: 'SUCCESS'
        },
        {
            id: 11,
            creation_date: '2018-04-01T00:13:10',
            author: 'User 2',
            status: 'FAILED'
        },
        {
            id: 12,
            creation_date: '2018-04-01T00:13:10',
            author: 'User 3',
            status: 'RUNNING'
        },
        {
            id: 40,
            creation_date: '2018-04-01T00:13:10',
            author: 'User 5',
            status: 'FAILED'
        },
        {
            id: 20,
            creation_date: '2018-04-01T00:13:10',
            author: 'User 4',
            status: 'FAILED'
        }
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

    const parameters = [
        {
            id: 1,
            name: 'loading',
        },
        {
            id: 2,
            name: 'bandwidth',
        },
    ];


    app.get('/api/v1/kqi/:configId/projection/:projectionId/result/:resultId', (req, res) => {
        res.send(kqiResults);
    });


    app.get('/api/v1/kqi/:configId', (req, res) => {
        res.send(kpi[0]);
    });

    app.post('/api/v1/kqi/:configId/projection/:projectionId/result/:resultId', (req, res) => {
        const body = req.body;
        if (body) {
            res.send(history.slice(0, body.length));
        } else {
            res.send(history);
        }
    });

    app.get('/api/v1/kqi/:id/projection', (req, res) => {
        const projections = readProjectionsFile();
        const projectionsByKqi = _.reduce(projections, (result, projection) => {
            const {
                kqi_id: kqiId,
                name: projection_name,
                id: projection_id
            } = projection;

            const remapedProjection = {
                projection_name,
                projection_id,
                results: projectionResults.map(res => ({ ...res, id: `${projection_id}-${res.id}` }))
            };

            if (result[kqiId]) {
                result[kqiId].push(remapedProjection)
            } else {
                result[kqiId] = [remapedProjection];
            }
            return result;
        }, {});

        if (req.params.id) {
            const response = projectionsByKqi[req.params.id] || [];
            res.send(response);
        } else {
            res.status = 401;
            res.end();
        }
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

    app.post('/api/v1/kqi', (req, res) => {
        res.send(Object.assign(
            {},
            req.body,
            {
                id: Date.now()
            }
        ));
    });

    app.get('/api/v1/kqi/projection/:projectionId', (req, res) => {
        res.send({
            name: "Some Name",
            auto_gen: true,
            service_type: "IPTV",
            kqi_id: 1,
            period: "DAY",
            start_date_time: '2018-04-01T00:13:10',
            end_date_time: '2018-04-01T00:13:10',
            date_time_grouping: "DAY",
            location: 1,
            location_grouping: "BRANCH",
            last_mile_technology: "FTTB",
            last_mile_technology_grouping: "SELF",
            last_inch_technology: "WIFI",
            last_inch_technology_grouping: "SELF",
            manufacturer: [1],
            manufacturer_grouping: "NONE",
            equipment_type: 1,
            equipment_type_grouping: "HW",
            abonent_group: "1",
            abonent_group_grouping: "ABONENT"
        });
    });


    app.get('/api/v1/kqi', (req, res) => {
        res.send(kpi);
    });

    const readProjectionsFile = () => {
        const projectionsFile = fs.readFileSync('dev/kqi/projections.json', 'utf8');
        let projections;
        try {
            projections = JSON.parse(projectionsFile);
        } catch (e) {
            projections = [];
        }
        return projections;
    };

    const writeProjectionsToFile = (projections) => {
        fs.writeFileSync('dev/kqi/projections.json', JSON.stringify(projections, undefined, 2));
    };

    app.post('/api/v1/kqi/projection', (req, res) => {
        const projection = req.body;
        const projections = readProjectionsFile();
        projection.id = (new Date()).getTime();
        projections.push(projection);
        writeProjectionsToFile(projections);
        res.send(projections);
    })
};