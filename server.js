require('dotenv').config()
const express = require("express")
const app = express()
const host = "127.0.0.1"
const start_page = "index.html"
const bodyParser = require("body-parser")
app.use(express.static("./public"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '5mb'}));
const routeImage = require("./routes/routeImage")
const RouteImage = new routeImage()
function goToIndex(req,res) {
    console.log(req.params)
    res.sendFile(__dirname + "/" + start_page)
}
app.get("/" + start_page, goToIndex)
app.route("/")

RouteImage.routeImage(app)

var server = app.listen(process.env.PORT, host, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});