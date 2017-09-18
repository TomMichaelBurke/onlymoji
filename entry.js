// compile using webpack: $ webpack ./entry.js bundle.js

var AWS = require('aws-sdk');

AWS.config.region = 'us-east-2';

var AWSCognitoIdentity = require('amazon-cognito-identity-js');

const poolData = {
    UserPoolId : 'us-east-2_gzO9nPh6T', // Your user pool id here
    ClientId : '4jq91ojnfkeui941jruuelp5kk' // Your client id here
};
const userPool = new AWSCognitoIdentity.CognitoUserPool(poolData);

    function omSignIn( username, password, callback ) {
        //const userPool = new CognitoUserPool(poolData);
        var userData = {
            Username : username, // your username here
            Pool : userPool
        };
        var authenticationData = {
            Username : username, // your username here
            Password : password // your password here
        };
        var authenticationDetails = new AWSCognitoIdentity.AuthenticationDetails(authenticationData);
 
        var cognitoUser = new AWSCognitoIdentity.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                console.log('access token + ' + result.getAccessToken().getJwtToken());
                //console.log('refresh token + ' + result.getRefreshToken().getJwtToken());
                console.log('id token + ' + result.getIdToken().getJwtToken());
                callback( null, result.getIdToken().getJwtToken() );
            },
            onFailure: function(err) {
                 console.log('logon failure: ' + err);
                 callback( err, "error");
            },    
            newPasswordRequired: function(err) {
                 console.log('newPasswordRequired: ' + err);
                 cognitoUser.completeNewPasswordChallenge('tbtbtbtb', {nickname: 'Tom'}, this);
            },
            mfaRequired: function(codeDeliveryDetails) {
                var verificationCode = prompt('Please input verification code' ,'');
                cognitoUser.sendMFACode(verificationCode, this);
            }
        });
    }