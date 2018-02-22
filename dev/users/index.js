const _ = require('lodash');

module.exports = (app) => {
    const usersById = {
        1: {
            id: 1,
            description: 'Description',
            disabled: true,
            email: 'bill.sm@gmail.com',
            first_name: 'Billy',
            last_name: 'Smith',
            ldap_auth: true,
            login: 'Admin',
            notify_language: 'English',
            phone: '+79648381088'
        },
        2: {
            id: 2,
            description: 'Small comment',
            disabled: false,
            email: 'a.smirnov@gmail.com',
            first_name: 'Alex',
            last_name: 'Smirnov',
            ldap_auth: true,
            login: 'a.smirnov',
            notify_language: 'Russian',
            phone: '+79200000002'
        }
    };

    app.get('/api/v1/user/all', (req, res) => {
        res.send(_.values(usersById));
    });
};