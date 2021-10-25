const file_input = document.getElementById("image_input")
file_input.addEventListener('change', (event) => {
    const img = event.target.files[0]

    const reader = new FileReader()
    reader.addEventListener('load', (event2) => {
        console.log("data",event2.target.result)

        const request = new XMLHttpRequest()
        request.open('POST','/image')
        request.setRequestHeader("Content-type", "application/json");
    
        const imageObject = new Object()
        imageObject.temp = 37.5
        imageObject.data = event2.target.result
        request.send(JSON.stringify(imageObject))
    })
    console.log("image",img)
    reader.readAsDataURL(img)
})

var point1 
var point2

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
              console.log(faces.size());
          }catch(err){
              console.log(err);
          }
          for (let i = 0; i < faces.size(); ++i) {
              let face = faces.get(i);
               point1 = new cv.Point(face.x, face.y);
               point2 = new cv.Point(face.x + face.width, face.y + face.height);
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
          console.log(rawImage)
          var cav2 = document.getElementById("canvas2")
          var ctx = cav2.getContext("2d")
          const image = new Image()
          image.onload = () => {
              ctx.drawImage(image,point1.x, point1.y, point2.x, point2.y, 0, 0, point2.x, point2.y)


          }
          image.src = rawImage

    }
  });
