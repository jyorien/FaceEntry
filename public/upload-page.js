if (window.location.href != "http://127.0.0.1:8086/upload-page") {
    window.location.href = "http://127.0.0.1:8086/"
}

const file_input = document.getElementById("image_input")
const name_input = document.getElementById("name_input")
var data
file_input.addEventListener('change', (event) => {
    const img = event.target.files[0]

    const reader = new FileReader()
    reader.addEventListener('load', (event2) => {
        console.log("data",event2.target.result)
        data = event2.target.result

    })
    reader.readAsDataURL(img)
})

function uploadFileToRekognition() {
    const request = new XMLHttpRequest()
    request.open('POST','/upload-page')
    request.setRequestHeader("Content-type", "application/json");
    const imageObject = new Object()
    imageObject.data = data
    imageObject.name = name_input.value
    request.onload = function() {
        var response = JSON.parse(request.responseText)
        console.log(response)
    }
    request.send(JSON.stringify(imageObject))
}