require('dotenv').config({path: __dirname + '/.env'})
const fs = require('fs')
var awsIot = require('aws-iot-device-sdk')
var AWS = require('aws-sdk')
AWS.config.loadFromPath('./s3_config.json')
var s3Bucket = new AWS.S3({params: {Bucket:'faceentrybucket'}})
const device = awsIot.device({
    keyPath: process.env.KEY_PATH,
    certPath: process.env.CERT_PATH,
    caPath: process.env.CA_PATH,
    host: process.env.HOST,
    clientId: 'first-try',
    region: process.env.REGION
}) 

// uncomment when server is needed ready, just trying to save resources
module.exports = class Webcam {
    constructor() {
        

        device.on('connect',()=> {
            console.log("connect")
            device.subscribe(process.env.TOPIC_NAME)
            console.log("subscribed to", process.env.TOPIC_NAME)
        })
        
        device.on('message', (topic, payload) => {
            console.log("message received:")
            console.log('message', topic, payload.toString())
        })


    }

    getS3BucketReference(base64) {

        
    }

    publishToWebcamTopic(base64,temp) {
        const splitBase64 = base64.replace("data:image/png;base64,", "");
        fs.writeFile("out.png", splitBase64,{encoding: 'base64'} ,(err) => {
            console.log("Error writing file", err)

            const key = Date.now().toString()
            const data = {
                Key: key,
                Body: fs.readFileSync('out.png'),
                ContentEncoding: 'base64',
                ContentType: 'image/jpeg'
            }
            s3Bucket.putObject(data, function(err,data) {
                if (err) console.log("Error upload to S3",err)
                else {
                    console.log("returned data from S3", data)
                    
                    // publish s3 link and temp
                    const params = {
                        topic: process.env.TOPIC_NAME,
                        payload: JSON.stringify({
                            'ImageKey': key,
                            'Temperature': temp
                        })
                    }
    
                    device.publish(params.topic, params.payload)
        
                }
            })  
        })
       
    }
}
