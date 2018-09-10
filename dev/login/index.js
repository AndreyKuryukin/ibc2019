module.exports = (app) => {
    app.post('/api/v1/auth/login', (req, res) => {
        console.log( req.body );
        res.status(200);
        res.send();
    })
};