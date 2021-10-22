require('dotenv').config({path: __dirname + '/.env'})
const fs = require('fs')
var awsIot = require('aws-iot-device-sdk')

module.exports = class Webcam {
    constructor() {
        const device = awsIot.device({
            keyPath: process.env.KEY_PATH,
            certPath: process.env.CERT_PATH,
            caPath: process.env.CA_PATH,
            host: process.env.HOST,
            clientId: 'first-try',
            region: process.env.REGION
        }) 

        device.on('connect',()=> {
            console.log("connect")
            device.subscribe(process.env.TOPIC_NAME)
        })
        
        device.on('message', (topic, payload) => {
            console.log('message', topic, payload.toString())
        })
        this.device = device

    }

    publishToWebcamTopic(base64,temp) {
        const params = {
            topic: process.env.TOPIC_NAME,
            payload: JSON.stringify({
                'ImageBase64': base64,
                'Temperature': temp
            })
        }
   
        this.device.publish(params.topic, params.payload)
        console.log("hello...")
  
    }
}
