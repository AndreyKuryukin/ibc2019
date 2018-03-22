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

    app.get('/api/v1/kqi/all', (req, res) => {
        res.send(kqiResults);
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