const Rekognition = require('../Rekognition')
const rekognition = new Rekognition()
module.exports = class RouteUpload {
    routeUpload(app) {
        app.route('/upload-page')
        .get(authenticate)
        .post(addFaceToRekognition)

        function authenticate(req, res) {
           if (req.session.isLoggedIn == true)
            res.sendFile('public/upload-page.html', {root: __dirname + '/../' })
        }

        function addFaceToRekognition(req, res) {
            rekognition.addFaceToRekognitionCollection(req.body.data, req.body.name, (data) => {
                console.log("REKOG RESPONSE", data)
                res.json({"data": data})
            })
        }

        
    }


}