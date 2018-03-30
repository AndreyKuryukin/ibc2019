const reports = [{
    id: 101,
    name: 'Статистические отчёты',
    templates: [{
        templ_name: 'Базовый отчёт IPTV',
        templ_id: 1,
        report_config: [{
            config_name: 'Ежедневный',
            config_id: 2,
            reports: [{
                id: 3,
                file_name: 'Волга_22102017-23102017',
                file_path: 'http://localhost:8088',
                create_start: '',
                create_end: '',
                state: 'SUCCESS',
                type: 'PDF',
                author: 'author 1',
                comment: '123',
                notify_users_name: ['Максим Уваров', 'Дмитрий Строганов'],
            }, {
                id: 4,
                file_name: 'Волга_21102017-22102017',
                file_path: 'http://localhost:8088',
                create_start: '',
                create_end: '',
                state: 'SUCCESS',
                type: 'PDF',
                author: 'author',
                comment: 'ewq',
                notify_users_name: ['Максим Уваров', 'Дмитрий Строганов'],
            }]
        }, {
            config_name: 'Еженедельный',
            config_id: 21,
            reports: [{
                id: 31,
                file_name: 'Волга_22102017-29102017',
                file_path: 'http://localhost:8088',
                create_start: '',
                create_end: '',
                state: 'SUCCESS',
                type: 'PDF',
                author: 'author 1',
                comment: '123',
                notify_users_name: ['Сергей Лобанов', 'Андрей Смолин'],
            }, {
                id: 41,
                file_name: 'Волга_15102017-22102017',
                file_path: 'http://localhost:8088',
                create_start: '',
                create_end: '',
                state: 'SUCCESS',
                type: 'PDF',
                author: 'author',
                comment: 'ewq',
                notify_users_name: ['Сергей Лобанов', 'Андрей Смолин'],
            }]
        }]
    }, {
        templ_name: 'Скорость загрузки STB',
        templ_id: 5,
        report_config: [{
            config_name: 'Ежедневный',
            config_id: 6,
            reports: [{
                id: 7,
                file_name: 'Волга_21102017-22102017',
                file_path: 'http://localhost:8088',
                create_start: '',
                create_end: '',
                state: 'RUNNING',
                type: 'XLS',
                author: 'author',
                comment: 'qwe',
                notify_users_name: ['Максим Уваров', 'Дмитрий Строганов'],
            }, {
                id: 8,
                file_name: 'Волга_22102017-23102017',
                file_path: 'http://localhost:8088',
                create_start: '',
                create_end: '',
                state: 'FAILED',
                type: 'PDF',
                author: 'author',
                comment: 'ewq',
                notify_users_name: ['Максим Уваров', 'Дмитрий Строганов'],
            }]
        }, {
            config_name: 'Ежемесячный',
            config_id: 66,
            reports: [{
                id: 71,
                file_name: 'Волга_21102017-21112017',
                file_path: 'http://localhost:8088',
                create_start: '',
                create_end: '',
                state: 'RUNNING',
                type: 'XLS',
                author: 'author',
                comment: 'qwe',
                notify_users_name: ['Сергей Лобанов', 'Андрей Смолин'],
            }, {
                id: 88,
                file_name: 'Волга_21092017-21102017',
                file_path: 'http://localhost:8088',
                create_start: '',
                create_end: '',
                state: 'FAILED',
                type: 'PDF',
                author: 'author',
                comment: 'ewq',
                notify_users_name: ['Сергей Лобанов', 'Андрей Смолин'],
            }]
        }]
    }]
}, {
    id: 102,
    name: 'Оперативные отчёты',
    templates: [{

    }]
}];

module.exports = (app) => {
    app.get('/api/v1/report', (req, res) => {
        res.send(reports);
    });
    app.delete('/api/v1/reports/results/:id', (req, res) => {
        reports[0].report_config[0].reports.shift();
        res.end();
    });
};