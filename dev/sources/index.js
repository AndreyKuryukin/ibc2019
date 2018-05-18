const sources = [
    {
        id: 1,
        name: 'Федеральные источники',
        children: [
            {
                id: 2,
                name: 'EIP',
                status: 'SUCCESS',
                last_data_received: '2018-03-26T00:00:50.434'
            },
            {
                id: 3,
                name: 'SDP Core',
                status: 'RUNNING',
                last_data_received: '2018-03-26T00:00:50.434'
            },
        ]
    },
    {
        id: 4,
        name: 'МРФ Волга',
        children: [
            {
                id: 5,
                name: 'СЛТУ',
                status: 'RUNNING',
                last_data_received: '2018-03-26T00:00:50.434'
            },
            {
                id: 6,
                name: 'РФ Нижегородский',
                children: [
                    {
                        id: 7,
                        name: 'DCP Сервер',
                        status: 'FAILED',
                        last_data_received: '2018-03-26T00:00:50.434'
                    }
                ]
            }
        ]
    },
    {
        id: 8,
        name: 'МРФ Урал',
        children: [
            {
                id: 9,
                name: 'СЛТУ',
                status: 'FAILED',
                last_data_received: '2018-03-26T00:00:50.434'
            }
        ]
    }
];

module.exports = (app) => {
    app.get('/api/v1/sources', (req, res) => {
        res.send(sources);
    });

};