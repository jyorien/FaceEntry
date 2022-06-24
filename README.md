# FaceEntry
Redesigned SafeEntry that uses your face to authenticate to provide a hassle-free checking-in experience.

## Features
- Deployed on Lightsail to the web (Contact me if you want to try!)
- Facial detection from OpenCV.js
- Facial recognition from AWS Rekognition
- Admin login via AWS Cognito only
- Upload your face to be identified by the system 

## Responses
There are three types of responses, namely: 
- Check In Successful - Person Identified AND Temperature below 37.5°C
- Check in Unsuccessful - Person Unidentified OR Temperature 37.5°C and above
- No face detected

## How to Set Up
- Create a copy of .env.empty and rename it to .env
- Specify paths in the variables. Details can be found in the respective AWS services

## Services Used
- OpenCV.js
- AWS Rekognition
- AWS Cognito
- Amazon S3
- AWS Lightsail
- AWS IoT Core
- AWS Lambda
- AWS SNS

## System Architecture
![ITAD FaceEntry drawio](https://user-images.githubusercontent.com/58991251/175478780-c99d9597-a8b0-471d-8dac-60ab25ee5b9e.png)

