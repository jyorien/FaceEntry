module.exports = class RouteUpload {
    routeUpload(app) {
        app.route('/upload-page')
        .get(authenticate)
        function authenticate(req, res) {
           if (req.session.isLoggedIn == true)
            res.sendFile('public/upload-page.html', {root: __dirname + '/../' })
        }

        
    }


}