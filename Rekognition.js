// require('dotenv').config({path: '../.env'})
const fs = require('fs')
const AWS = require('aws-sdk')
AWS.config.loadFromPath('./s3_config.json')
var s3Bucket = new AWS.S3({params: {Bucket:'faceentrybucket'}})

const rekognitionClient = new AWS.Rekognition({region: process.env.REGION})
// add face from S3 or bytes to Rekognition Collection
module.exports = class Rekog {
    addFaceToRekognitionCollection(data, userName, callback) {
        if (data === undefined) return
        console.log("DATA",data)
        const splitBase64 = data.replace("data:image/jpeg;base64,", "");
        fs.writeFile("out2.png", splitBase64,{encoding: 'base64'} ,(err) => {
            if(err) console.log("Error writing file", err)
    
            const key = Date.now().toString()
            const data = {
                Key: key,
                Body: fs.readFileSync('out2.png'),
                ContentEncoding: 'base64',
                ContentType: 'image/jpeg'
            }
            s3Bucket.putObject(data, function(err,data) {
                if (err) console.log("Error upload to S3",err)
                else {
                    console.log("returned data from S3", data)
                    
                    // rekognition params
                    const params = {
                        CollectionId: process.env.REKOGNITION_COLLECTION_ID,
                        ExternalImageId: userName,
                        DetectionAttributes: ['ALL'],
                        Image: {
                            S3Object: {
                                Bucket:  process.env.S3_BUCKET_NAME,
                                Name: key
                            }
                        }
                    
                    }
                    // add face to rekognition
                    rekognitionClient.indexFaces(params, (err, data) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(data)
                            console.log(data.FaceRecords[0])
                            callback(data.FaceRecords[0])
                        }
                    })
        
                }
            })  
        })
    
    }
}


// addFaceToRekognitionCollection()
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

