require('dotenv').config({path: '../.env'})
const AWS = require('aws-sdk')
const rekognitionClient = new AWS.Rekognition({region: process.env.REGION})

// add face from S3 or bytes to Rekognition Collection
function addFaceToRekognitionCollection() {
    const params = {
        CollectionId: process.env.REKOGNITION_COLLECTION_ID,
        ExternalImageId: "Joey",
        DetectionAttributes: ['ALL'],
        Image: {
            S3Object: {
                Bucket:  process.env.S3_BUCKET_NAME,
                Name: "joey.jpg"
            }
        }
    
    }
    rekognitionClient.indexFaces(params, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            console.log(data)
            console.log(data.FaceRecords[0])
        }
    })
}
addFaceToRekognitionCollection()
// compareFaceWithRekognitionCollection()
// compare image from S3 or bytes with images in Rekognition collection
function compareFaceWithRekognitionCollection() {
    const params = {
        CollectionId: process.env.REKOGNITION_COLLECTION_ID,
        FaceMatchThreshold: 60,
        Image: {
            S3Object: {
                Bucket: process.env.S3_BUCKET_NAME,
                Name: "1635175575991"
            }
        },
        MaxFaces: 5
    }
    rekognitionClient.searchFacesByImage(params, (err,data) => {
        if (err) {
            console.log(err)
        } else {
            console.log(data)
            console.log(data.FaceMatches[0].Face)
        }
    })
}

