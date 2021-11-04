const AmazonCognitoIdentity = require('amazon-cognito-identity-js')
const poolData = {
    UserPoolId: process.env.USER_POOL_ID,
    ClientId: process.env.COGNITO_CLIENT_ID
}

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)
var sessionUserAttributes, cognitoUser
module.exports = class RouteAuth {
    routeAuth(app) {
        app.route('/login')
        .post(login)
        function login(req, res) {
            const email = req.body.email
            const pass = req.body.password

            const loginDetails = {
                Username: email,
                Password: pass
            }

            const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(loginDetails)

            const userDetails = {
                Username: email,
                Pool: userPool
            }

            cognitoUser = new AmazonCognitoIdentity.CognitoUser(userDetails)
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function(data) {
                console.log("auth data",data)
                res.send
                req.session.isLoggedIn = true
                res.redirect("/upload-page")
            }, 
                onFailure: function(err) { console.log("error auth", err) }, 
                newPasswordRequired: function(userAttributes, requiredAttributes) {
                    delete userAttributes.email_verified
                    sessionUserAttributes = userAttributes
                    console.log("attr",userAttributes, requiredAttributes)
                    res.redirect("/newPass.html")
            } 
            })
        }
        app.route('/newPass')
        .post(newPass)
        function newPass(req,res) {
            cognitoUser.completeNewPasswordChallenge(req.body.newPass, sessionUserAttributes)
            req.session.isLoggedIn = true
            res.redirect("/upload-page")
        }
    }
}