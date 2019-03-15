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
        },
        3: {
            id: 3,
            description: 'Small comment',
            disabled: false,
            email: 'a.smirnov@gmail.com',
            first_name: 'Alex',
            last_name: 'Smirnov',
            ldap_auth: true,
            login: 'a.smirnov',
            notify_language: 'Russian',
            phone: '+79200000002'
        },
        4: {
            id: 4,
            description: 'Small comment',
            disabled: false,
            email: 'a.smirnov@gmail.com',
            first_name: 'Alex',
            last_name: 'Smirnov',
            ldap_auth: true,
            login: 'a.smirnov',
            notify_language: 'Russian',
            phone: '+79200000002'
        },
        5: {
            id: 5,
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

    app.get('/api/v1/user/current', (req, res) => {
        res.json({
            "id": "360775744165314561",
            "login": "admin",
            "roles": [{
                "name": "Admin",
                "description": "Admin role",
                "access_level": [{
                    "access_level_type": "ALL",
                    "subject": { "name": "Reports", "description": "Reports subject", "id": "360775743261114369" },
                    "id": "360775743371837441"
                },{
                    "access_level_type": "ALL",
                    "subject": { "name": "SUBSCRIBERS", "description": "SUBSCRIBERS", "id": "360775743261114366" },
                    "id": "360775743371837441"
                }],
                "id": "360775743335923713"
            }],
            "first_name": "Admin",
            "last_name": "Admin"
        });
    });

    app.get('/api/v1/user/language/current/', (req, res) => {
        res.send("ENGLISH");
    });

    app.get('/api/v1/user/:id', (req, res) => {
        if (req.params.id) {
            res.send(usersById[req.params.id]);
        } else {
            res.status = 401;
            res.end();
        }
    });

    app.post('/api/v1/user', (req, res) => {
        res.send(Object.assign(
            {},
            req.body,
            {
                id: Date.now()
            }
        ));
    });

    app.put('/api/v1/user', (req, res) => {
        res.send(req.body);
    });

    app.delete('/api/v1/user/:id', (req, res) => {
        res.end();
    });
};