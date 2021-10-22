const Webcam = require('../Webcam')

module.exports = class RouteImage {
    routeImage(app) {
        const webcam = new Webcam()
        app.route('/image')
        .post(publishImage)
        function publishImage(req, res) {
            const base64 = req.body.data
            const temp = req.body.temp
            const byteArray = new Buffer.from(base64,"base64")
            webcam.publishToWebcamTopic(base64, temp)
        }

        
    }


}


