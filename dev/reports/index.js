const reports = [{
    id: 101,
    name: 'Статистические отчёты',
    templates: [{
        templ_name: 'Базовый отчёт IPTV',
        templ_id: 1,
        report_config: [{
            config_name: 'Ежедневный',
            config_id: 2,
            type: 'PDF',
            author: 'author 1',
            comment: '123',
            notify_users_name: ['Максим Уваров', 'Дмитрий Строганов'],
            reports: [{
                id: 3,
                file_name: 'Волга_22102017-23102017',
                file_path: 'http://localhost:8088',
                create_start: '2018-04-01T00:00:01.434',
                create_end: '2018-04-01T00:00:21.434',
                state: 'SUCCESS'
            }, {
                id: 4,
                file_name: 'Волга_21102017-22102017',
                file_path: 'http://localhost:8088',
                create_start: '2018-04-02T00:00:01.434',
                create_end: '2018-04-02T00:00:21.434',
                state: 'SUCCESS'
            }]
        }, {
            config_name: 'Еженедельный',
            config_id: 21,
            type: 'PDF',
            author: 'author 1',
            comment: '123',
            notify_users_name: ['Сергей Лобанов', 'Андрей Смолин'],
            reports: [{
                id: 31,
                file_name: 'Волга_22102017-29102017',
                file_path: 'http://localhost:8088',
                create_start: '2018-04-02T00:00:01.434',
                create_end: '2018-04-02T00:00:50.434',
                state: 'SUCCESS'
            }, {
                id: 41,
                file_name: 'Волга_15102017-22102017',
                file_path: 'http://localhost:8088',
                create_start: '2018-03-26T00:00:01.434',
                create_end: '2018-03-26T00:00:50.434',
                state: 'SUCCESS',
            }]
        }]
    }, {
        templ_name: 'Базовый отчёт ОТТ',
        templ_id: 5,
        report_config: [{
            config_name: 'Ежедневный',
            config_id: 6,
            type: 'XLS',
            author: 'author',
            comment: 'qwe',
            notify_users_name: ['Максим Уваров', 'Дмитрий Строганов'],
            reports: [{
                id: 7,
                file_name: 'Волга_21102017-22102017',
                file_path: 'http://localhost:8088',
                create_start: '2018-04-01T00:00:01.434',
                create_end: '2018-04-01T00:00:21.434',
                state: 'RUNNING'
            }, {
                id: 8,
                file_name: 'Волга_22102017-23102017',
                file_path: 'http://localhost:8088',
                create_start: '2018-04-02T00:00:01.434',
                create_end: '2018-04-02T00:00:21.434',
                state: 'FAILED',
            }]
        }, {
            config_name: 'Ежемесячный',
            config_id: 66,
            type: 'XLS',
            author: 'author',
            comment: 'qwe',
            notify_users_name: ['Сергей Лобанов', 'Андрей Смолин'],
            reports: [{
                id: 71,
                file_name: 'Волга_21102017-21112017',
                file_path: 'http://localhost:8088',
                create_start: '2018-04-01T00:00:01.434',
                create_end: '2018-04-01T00:12:21.434',
                state: 'RUNNING'
            }, {
                id: 88,
                file_name: 'Волга_21092017-21102017',
                file_path: 'http://localhost:8088',
                create_start: '2018-03-01T00:00:01.434',
                create_end: '2018-03-01T00:12:21.434',
                state: 'FAILED'
            }]
        }]
    }]
}, {
    id: 102,
    name: 'Оперативные отчёты',
    templates: [{
        templ_name: 'Антирейтинг каналов по данным STB',
        templ_id: 'a',
        report_config: [{
            config_name: 'Еженедельный',
            config_id: 'a6',
            type: 'XLS',
            author: 'author',
            comment: 'qwe',
            notify_users_name: ['Максим Уваров', 'Дмитрий Строганов'],
            reports: [{
                id: 'a7',
                file_name: 'Волга_21102017-22102017',
                file_path: 'http://localhost:8088',
                create_start: '2018-04-02T00:00:01.434',
                create_end: '2018-04-02T00:00:50.434',
                state: 'RUNNING'
            }, {
                id: 'a8',
                file_name: 'Волга_22102017-23102017',
                file_path: 'http://localhost:8088',
                create_start: '2018-03-26T00:00:01.434',
                create_end: '2018-03-26T00:00:50.434',
            }]
        }, {
            config_name: 'Ежемесячный',
            config_id: 'a66',
            type: 'XLS',
            author: 'author',
            comment: 'qwe',
            notify_users_name: ['Сергей Лобанов', 'Андрей Смолин'],
            reports: [{
                id: 'a71',
                file_name: 'Волга_21102017-21112017',
                file_path: 'http://localhost:8088',
                create_start: '2018-04-01T00:00:01.434',
                create_end: '2018-04-01T00:12:21.434',
                state: 'RUNNING'
            }, {
                id: 'a88',
                file_name: 'Волга_21092017-21102017',
                file_path: 'http://localhost:8088',
                create_start: '2018-03-01T00:00:01.434',
                create_end: '2018-03-01T00:12:21.434',
                state: 'FAILED',
            }]
        }]
    }, {
        templ_name: 'Антирейтинг каналов по данным VB/Telescreen',
        templ_id: 'b',
    }, {
        templ_name: 'Антирейтинг каналов по данным STB',
        templ_id: 'v',
    }, {
        templ_name: 'Антирейтинг свитчей доступ',
        templ_id: 'd',
    }, {
        templ_name: 'Антирейтинг свитчей агрегация',
        templ_id: 'p',
    }, {
        templ_name: 'Скорость загрузки STB',
        templ_id: 'e',
    }, {
        templ_name: 'Скорость переключения каналов',
        templ_id: 't',
    }, {
        templ_name: 'Отчёт об авариях',
        templ_id: 'j',
    },]
}];


const findById = (data, id) => {

};

module.exports = (app) => {
    app.get('/api/v1/report', (req, res) => {
        res.send(reports);
    });
    app.delete('/api/v1/reports/results/:id', (req, res) => {
        reports[0].report_config[0].reports.shift();
        res.end();
    });
    app.post('/api/v1/reports/results/:id', (req, res) => {
        reports[0].templates[0].report_config[0].reports[1].state = 'RUNNING';
        res.end();
    });
    app.post('/api/v1/reports/configs', (req, res) => {
        res.send(Object.assign(
            {},
            req.body,
            {
                id: Date.now()
            }
        ));
    });
};