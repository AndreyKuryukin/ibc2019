module.exports = (app) => {
    app.post('/login/api/v1/auth/login', (req, res) => {
        console.log( req.body );
        res.send({userName: 'USER', jwtToken: 'eiwuric7f3q48on57c83574938459c839'})
    })
};