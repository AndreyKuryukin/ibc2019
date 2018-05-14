module.exports = (app) => {
    app.get('/api/v1/user/current', (req, res) => {
        console.log( req.body );
        res.status(200);
        res.send({
            first_name: 'Admin',
            last_name: 'Admin',
            subjects: []
        })
    })
};