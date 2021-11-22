require('dotenv').config()
const express = require("express")
const session = require('express-session')
const app = express()
const host = process.env.DOMAIN
const start_page = "index.html"
const bodyParser = require("body-parser")
const WebSocket = require('ws')
app.use(express.static("./public"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '5mb'}));
app.use(session({
    secret:'key',
    resave: false,
    saveUninitialized: false
}))
const routeImage = require("./routes/routeImage")
const Webcam = require('./Webcam')
const routeAuth = require('./routes/routeAuth')
const routeUpload = require('./routes/routeUpload')
const webcam = new Webcam()
const RouteImage = new routeImage()
const RouteAuth = new routeAuth()
const RouteUpload = new routeUpload()
function goToIndex(req,res) {
    console.log(req.params)
    res.sendFile(__dirname + "/" + start_page)
}
app.get("/" + start_page, goToIndex)
app.route("/")

RouteImage.routeImage(app)
RouteAuth.routeAuth(app)
RouteUpload.routeUpload(app)
var server = app.listen(8088, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});

// create websocket server
const webSocketServer = new WebSocket.Server({server: server})
webSocketServer.on('connection', function connection(ws) {
    console.log("Client connected")
    // send payload over to client
    webcam.onMessageRecevied((payload) => {ws.send(payload)})
})
