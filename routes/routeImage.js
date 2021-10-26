const Webcam = require('../Webcam')
const webcam = new Webcam()
webcam.connectToDevice()
module.exports = class RouteImage {
    routeImage(app) {
        app.route('/image')
        .post(publishImage)
        function publishImage(req, res) {
            const base64 = req.body.data
            const temp = req.body.temp
            webcam.publishToWebcamTopic(base64, temp)
        }

        
    }


}


