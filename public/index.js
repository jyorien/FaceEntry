
const hostName = '127.0.0.1'
const nameSpan = document.getElementById("name")
const tempSpan = document.getElementById("temp")
const tempWarnSpan = document.getElementById("temp_warn")
const successStatusSpan = document.getElementById("success_status")
const faceErrorSpan = document.getElementById("face_error")
const boxDiv = document.getElementById("box")
const socket = new WebSocket(`ws://${hostName}:8088`)
socket.addEventListener('message', function(event) {
    const reader = new FileReader()
    reader.addEventListener('load',(event2) => {
        const json = JSON.parse(reader.result)
        displayCheckInResult(json)
        setTimeout(function() {
            nameSpan.innerText = ""
            tempSpan.innerHTML = ""
            successStatusSpan.innerText = ""
            tempWarnSpan.innerHTML = ""
            boxDiv.hidden = true
            boxDiv.style.display = 'none'
            faceErrorSpan.innerText = ""
        },3000)

    })
    reader.readAsText(event.data)
})

function displayCheckInResult(json) {
    console.log("json", json)
    if (json["ErrorData"]) {
        faceErrorSpan.innerText = "No face identified"
    }
    boxDiv.hidden = false
    boxDiv.style.display = 'inline-block'
    if (Number(json.Temp) >= 37.5 || !json.FaceMatch) 
        successStatusSpan.innerText = "CHECK IN UNSUCCESSFUL"
    else 
        successStatusSpan.innerText = "CHECK IN SUCCESSFUL"

    if (!json.FaceMatch) 
        nameSpan.innerText = "FACE NOT RECOGNISED"
    else 
        nameSpan.innerText = `${json.ExternalImageId}`

    if (json.Temp != undefined)
        tempSpan.innerHTML = `${json.Temp}&#176;C`

    
    if (Number(json.Temp) >= 37.5 ) 
        tempWarnSpan.innerHTML+= "TEMPERATURE TOO HIGH"

}

var point1 
var point2
var fWidth
var fHeight
function onOpenCVReady() {

      let video = document.getElementById("videoInput"); 
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(function(stream) {
          video.srcObject = stream;
          video.play();
      })
      .catch(function(err) {
          console.log("An error occurred! " + err);
      });
      let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
      let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
      let gray = new cv.Mat();
      let cap = new cv.VideoCapture(video);
      let faces = new cv.RectVector();
      let classifier = new cv.CascadeClassifier();
      let utils = new Utils('errorMessage');
      let faceCascadeFile = 'haarcascade_frontalface_default.xml'; // path to xml
      utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
      classifier.load(faceCascadeFile); // in the callback, load the cascade from file 
  });
      const FPS = 24;
      function processVideo() {
          let begin = Date.now();
          cap.read(src);
          src.copyTo(dst);
          cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
          try{
              classifier.detectMultiScale(gray, faces, 1.1, 3, 0);
  
          }catch(err){
              console.log(err);
          }
          for (let i = 0; i < faces.size(); ++i) {
              let face = faces.get(i);
               point1 = new cv.Point(face.x, face.y)
               point2 = new cv.Point(face.x + face.width, face.y + face.height)
               fWidth = face.width
               fHeight = face.height

              cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);
          }
          cv.imshow("canvasOutput", dst);

          // schedule next one.
          let delay = 1000/FPS - (Date.now() - begin);
          setTimeout(processVideo, delay);
  }
  // schedule first one.
  setTimeout(processVideo, 0);
  
  }
  document.addEventListener("keypress", function(event) {
    if (event.keyCode == 32) {
          var canvasOutputElement = document.getElementById("canvasOutput")
          var rawImage = canvasOutputElement.toDataURL("image/jpeg;base64")  // here is the most important part because if you dont replace you will get a DOM 18 exception.
   
          var cav2 = document.getElementById("canvas2")
          var ctx = cav2.getContext("2d")
          const image = new Image()
          image.onload = () => {
              var extendedPt1x = point1.x
              var extendedPt1y = point1.y-15
              var extendedWidth = fWidth+100
              var extendedHeight = fHeight+15

              ctx.clearRect(0,0,cav2.width, cav2.height)
              ctx.drawImage(image,extendedPt1y, extendedPt1y, extendedWidth, extendedHeight,0,0,extendedWidth, extendedHeight)
              const request = new XMLHttpRequest()
              request.open('POST','/image')
              request.setRequestHeader("Content-type", "application/json");
          
              const imageObject = new Object()
              imageObject.temp = (Math.random() * (38.5 - 36.5) + 36.5).toFixed(1)
              imageObject.data = cav2.toDataURL()
              request.send(JSON.stringify(imageObject))
            }
          image.src = rawImage
    }
  });

  function login() {
      window.location.pathname = "/login.html"
  }


// back up if video feed doesn't work
// const file_input = document.getElementById("image_input")
// file_input.addEventListener('change', (event) => {
//     const img = event.target.files[0]

//     const reader = new FileReader()
//     reader.addEventListener('load', (event2) => {
//         console.log("data",event2.target.result)

//         const request = new XMLHttpRequest()
//         request.open('POST','/image')
//         request.setRequestHeader("Content-type", "application/json");
    
//         const imageObject = new Object()
//         imageObject.temp = 37.5
//         imageObject.data = event2.target.result
//         request.send(JSON.stringify(imageObject))
//     })
//     reader.readAsDataURL(img)
// })