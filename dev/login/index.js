module.exports = (app) => {
    app.post('/api/v1/authenticate', (req, res) => {
       console.log( req.body );
       res.send({userName: 'USER', jwtToken: 'eiwuric7f3q48on57c83574938459c839'})
    })
};