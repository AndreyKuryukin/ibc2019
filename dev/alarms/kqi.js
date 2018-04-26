const _ = require('lodash');

const history = [{
    id: 23234,
    priority: 'major',
    raise_time: '2018-03-31T20:59:59.999Z',
    policy_name: 'Alarm_KQI_VLG_STB_LOSS_PERFOMANCE',
    period: 'day'
}, {
    id: 68468,
    priority: 'minor',
    raise_time: '2018-03-31T21:59:59.999Z',
    policy_name: 'Alarm_KQI_VLG_STB_LOSS_PERFOMANCE',
    period: 'week'
}, {
    id: 75675,
    priority: 'critical',
    raise_time: '2018-03-31T22:59:59.999Z',
    policy_name: 'Alarm_KQI_VLG_STB_LOSS_PERFOMANCE',
    period: 'month'
}, {
    id: 63454,
    priority: 'major',
    raise_time: '2018-03-31T23:59:59.999Z',
    policy_name: 'Alarm_KQI_VLG_STB_LOSS_PERFOMANCE',
    period: 'day'
}, {
    id: 44788,
    priority: 'minor',
    raise_time: '2018-03-31T22:59:59.999Z',
    policy_name: 'Alarm_KQI_VLG_STB_LOSS_PERFOMANCE',
    period: 'week'
}, {
    id: 86544,
    priority: 'critical',
    raise_time: '2018-03-31T22:49:59.999Z',
    policy_name: 'Alarm_KQI_VLG_STB_LOSS_PERFOMANCE',
    period: 'month'
}];

const DETAILS = [{
        location: "Нижегородский",
        last_mile_technology: "FTTB",
        value: 98.75,
        weight: 4.1
    },
    {
        location: "Кировский",
        last_mile_technology: "GPON",
        value: 94.95,
        weight: 3.8
    },
    {
        location: "Дзержинский",
        last_mile_technology: "ETHERNET",
        value: 98,
        weight: 4.3
    }
];

const enrichDetail = (detail) => {
    detail.details = DETAILS;
    return detail;
};

module.exports = (app) => {
    app.get('/api/v1/alarms/kqi/history', (req, res) => {
        res.status(200);
        res.send(history)
    });
    app.get('/api/v1/alarms/kqi/history/:id', (req, res) => {
        const id = req.params.id;
        const detail = _.find(history, detail => String(id) === String(detail.id));
        res.send(enrichDetail(detail))
    })
};