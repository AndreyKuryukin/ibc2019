module.exports = (app) => {
    const reports = [{
        templ_name: 'velcom kpi_nnov',
        templ_id: 1,
        report_config: [{
            config_name: 'iptv kpi',
            config_id: 2,
            reports: [{
                id: 3,
                file_name: 'ttt',
                file_path: 'http://report.xls',
                create_start: '',
                create_end: '',
                state: 'state 2',
                type: '',
                author: 'author 1',
                comment: '123',
                notify_users_name: ['User 1', 'User 2'],
            }, {
                id: 4,
                file_name: 'fff',
                file_path: 'http://report.xls',
                create_start: '',
                create_end: '',
                state: 'state',
                type: '',
                author: 'author',
                comment: 'ewq',
                notify_users_name: ['User 1'],
            }]
        }]
    }, {
        templ_name: 'velcom kpi_nnov 1',
        templ_id: 5,
        report_config: [{
            config_name: 'iptv kpi 2',
            config_id: 6,
            reports: [{
                id: 7,
                file_name: 'ttt 1',
                file_path: 'http://report.xls',
                create_start: '',
                create_end: '',
                state: 'state',
                type: '',
                author: 'author',
                comment: 'qwe',
                notify_users_name: ['User 1', 'User 2'],
            }, {
                id: 8,
                file_name: 'fff 2',
                file_path: 'http://report.xls',
                create_start: '',
                create_end: '',
                state: 'state',
                type: '',
                author: 'author',
                comment: 'ewq',
                notify_users_name: ['User 1'],
            }]
        }]
    }];

    app.get('/api/v1/report', (req, res) => {
        res.send(reports);
    });
};