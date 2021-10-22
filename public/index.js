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
