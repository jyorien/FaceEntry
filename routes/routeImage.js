const Webcam = require('../Webcam')
const webcam = new Webcam()
module.exports = class RouteImage {
    routeImage(app) {
        app.route('/image')
        .post(publishImage)
        function publishImage(req, res) {
            const base64 = req.body.data
            const temp = req.body.temp
            // const byteArray = new Buffer.from(base64,"base64")
            console.log(base64, temp)
            webcam.publishToWebcamTopic(base64, temp)
        }

        
    }


}


