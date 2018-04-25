const _ = require('lodash');

module.exports = (app) => {
    const gpAlarmsById = {
        123: {
            id: 123,
            raise_time: new Date(),
            policy_name: 'Alarm_VLG_STB_LOSS_PERFOMANCE',
            duration: 431999,
            priority: 'CRITICAL',
            notification_text: 'Потеря пакетов (счетчик СС на STB) несколькими абонементами на агрегационном свитче nnov_ag_sw_1 (ip = 1.2.3.4)',
            notified: [{
                type: 'EMAIL',
                status: 'FAILED'
            }, {
                type: 'SMS',
                status: 'SUCCESS'
            }],
            attributes: ['attr1=attr1', 'attr2=attr2']
        },
        124: {
            id: 124,
            raise_time: new Date(),
            policy_name: 'Alarm_VLG_STB_LOSS_PERFOMANCE',
            duration: 3600,
            priority: 'CRITICAL',
            notification_text: 'Потеря пакетов (счетчик СС на STB) несколькими абонементами на агрегационном свитче nnov_ag_sw_1 (ip = 1.2.3.4)',
            notified: [{
                type: 'SMS',
                status: 'SUCCESS'
            }, {
                type: 'SMS',
                status: 'FAILED'
            }],
            attributes: ['attr1=attr1', 'attr2=attr2']
        }
    };

    app.get('/api/v1/alarms/gp', (req, res) => {
        setTimeout(() => {
            res.send(_.values(gpAlarmsById));
        }, 1000);
    });

    app.get('/api/v1/alarms/gp/:id', (req, res) => {
        if (req.params.id) {
            res.send(gpAlarmsById[req.params.id]);
        } else {
            res.status = 401;
            res.end();
        }
    });
};