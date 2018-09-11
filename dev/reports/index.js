const path = require('path');


const reports = [{
    id: 101,
    type: 'STATISTIC',
    templates: [{
        name: 'Basic OTT Report',
        id: 1,
        report_config: [{
            name: 'Daily',
            id: 2,
            type: 'XLSX',
            author: 'Operator',
            comment: '123',
            notify_users: ['Admin', 'CEO'],
            reports: [{
                id: '7',
                name: 'BASIC_OTT_REPORT_DAILY_12092018.xlsx',
                file_path: '/api/v1/files/BASIC_OTT_REPORT_DAILY_12092018.xlsx',
                create_start: '2018-09-12T00:00:40.434',
                create_end: '2018-09-12T00:00:50.434',
                state: 'SUCCESS'
            }, {
                id: '8',
                name: 'BASIC_OTT_REPORT_DAILY_13092018',
                file_path: '/api/v1/files/BASIC_OTT_REPORT_DAILY_13092018.xlsx',
                create_start: '2018-09-13T00:00:40.434',
                create_end: '2018-09-13T00:00:50.434',
                state: 'SUCCESS'
            }, {
                id: '9',
                name: 'BASIC _OTT_REPORT_DAILY_14092018',
                file_path: '/api/v1/files/BASIC_OTT_REPORT_DAILY_14092018.xlsx',
                create_start: '2018-09-14T00:00:40.434',
                create_end: '2018-09-14T00:00:50.434',
                state: 'SUCCESS'
            }]
        }]
    }]
}, {
    id: 102,
    type: 'OPERATIVE',
    templates: [{
        name: 'TOP subscribers with failures',
        id: 'a',
        report_config: [{
            name: 'Daily',
            id: 'a6',
            type: 'XLSX',
            author: 'Senior engineer',
            comment: 'TOP subscribers with failures',
            notify_users: ['Admin', 'CEO'],
            reports: [{
                id: 'a7',
                name: 'TOP_SUBSCRIBERS_WITH_DEGRADATION_DAILY_12092018',
                file_path: '/api/v1/files/TOP_SUBSCRIBERS_WITH_DEGRADATION_DAILY_12092018.xlsx',
                create_start: '2018-09-12T00:00:40.434',
                create_end: '2018-09-12T00:00:50.434',
                state: 'SUCCESS'
            }, {
                id: 'a8',
                name: 'TOP_SUBSCRIBERS_WITH_DEGRADATION_DAILY_13092018',
                file_path: '/api/v1/files/TOP_SUBSCRIBERS_WITH_DEGRADATION_DAILY_13092018.xlsx',
                create_start: '2018-09-13T00:00:40.434',
                create_end: '2018-09-13T00:00:50.434',
                state: 'SUCCESS'
            }, {
                id: 'a9',
                name: 'TOP_SUBSCRIBERS_WITH_DEGRADATION_DAILY_14092018',
                file_path: '/api/v1/files/TOP_SUBSCRIBERS_WITH_DEGRADATION_DAILY_14092018.xlsx',
                create_start: '2018-09-14T00:00:40.434',
                create_end: '2018-09-14T00:00:50.434',
                state: 'SUCCESS'
            }]
        }]
    }]
}];


module.exports = (app) => {
    app.get('/api/v1/report/result', (req, res) => {
        res.send(reports);
    });

    app.get('/api/v1/files/:fileName', (req, res) => {
        const options = {
            headers: {
                'Accept-Ranges': 'bytes',
                'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers',
                'Access-Control-Allow-Methods': 'POST, GET, DELETE, PUT',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers': 'Access-Control-Allow-Headers',
                'Access-Control-Max-Age': '3600',
                'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
                'Connection': 'keep-alive',
                'Content-Disposition': '',
                'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXRoU3ViamVjdChsb2dpbj1hZG1pbiwgbGFuZ3VhZ2U9UlVTU0lBTikiLCJleHAiOjE1MzY2ODIzOTB9.6G9pb8FO3jXG0YisyB9kbXriPT4rOuL63uTqZW19kjq90VSUMq1eWMdtrjBRjiwydesZJZlCDntBxDdndLRR4A',
                'ETag': "5b833f1f-2c42",
                'Expires': 0,
                'Pragma': 'no-cache',
                'Server': 'nginx/1.12.2',
                'X-Application-Context': 'application:dictionary,backend,dev,default_data',
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'X-XSS-Protection': '1; mode=block',
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        };

        const { fileName } = req.params;
        res.sendFile(path.resolve(__dirname, 'files', fileName));
    });

    app.delete('/api/v1/reports/result/:id', (req, res) => {
        reports[0].report_config[0].reports.shift();
        res.end();
    });
    app.post('/api/v1/reports/result/:id', (req, res) => {
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