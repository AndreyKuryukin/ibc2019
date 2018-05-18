module.exports = (app) => {
    app.post('/api/v1/auth/login', (req, res) => {
        console.log( req.body );
        res.status(400);
        res.send({
            errors: [{
                type: 'VALIDATION',
                severity: 'CRITICAL',
                target: 'login',
            },{
                type: 'VALIDATION',
                severity: 'CRITICAL',
                target: 'password',
            }]
        })
    })
};