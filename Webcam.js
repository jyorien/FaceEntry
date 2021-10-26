require('dotenv').config({path: __dirname + '/.env'})
const fs = require('fs')
var awsIot = require('aws-iot-device-sdk')
var AWS = require('aws-sdk')
AWS.config.loadFromPath('./s3_config.json')
var s3Bucket = new AWS.S3({params: {Bucket:'faceentrybucket'}})

// create IoT Device
const device = awsIot.device({
    keyPath: process.env.KEY_PATH,
    certPath: process.env.CERT_PATH,
    caPath: process.env.CA_PATH,
    host: process.env.HOST,
    clientId: 'first-try',
    region: process.env.REGION
}) 

module.exports = class Webcam {


    // get messages from MQTT
    // gives payload to callback function
    onMessageRecevied(callback) {
        device.on('message', (topic, payload) => {
            if (topic === process.env.RES_TOPIC_NAME) {
                console.log("payload",payload.toString())
                callback(payload)
            }
            console.log("message received:")
            console.log('message', topic, payload.toString())
       
           
        })
    }

    connectToDevice() {
        device.on('connect',()=> {
            console.log("connect")
            device.subscribe(process.env.TOPIC_NAME)
            device.subscribe(process.env.RES_TOPIC_NAME)
            console.log("subscribed to", process.env.TOPIC_NAME)
            console.log("subscribed to", process.env.RES_TOPIC_NAME)
        })
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
