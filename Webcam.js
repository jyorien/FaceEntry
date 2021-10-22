require('dotenv').config()

var awsIot = require('aws-iot-device-sdk')

var device = awsIot.device({
    keyPath: process.env.KEY_PATH,
    certPath: process.env.CERT_PATH,
    caPath: process.env.CA_PATH,
    clientId: 'first-try',
    host: process.env.HOST
})

device.on('connect',()=> {
    console.log("connect")
    device.subscribe('henlo')
    device.publish('henlo', JSON.stringify({test_data: 1}))
})

device.on('message', (topic, payload) => {
    console.log('message', topic, payload.toString())
})