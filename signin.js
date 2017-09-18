// compile using webpack: $ webpack ./signin.js ./browser.js bundle.js

//var AWS = require('aws-sdk');

//AWS.config.region = 'us-east-2';

var AWSCognitoIdentity = require('amazon-cognito-identity-js');

var refreshToken;
var cognitoUser;

AWSCognitoIdentity.config = { region: 'us-east-2'} ;
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
 
        cognitoUser = new AWSCognitoIdentity.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                console.log('access token + ' + result.getAccessToken().getJwtToken());
                //console.log('refresh token + ' + result.getRefreshToken());
                //console.log('refresh token + ' + result.getRefreshToken().getJwtToken());
                console.log('id token + ' + result.getIdToken().getJwtToken());
                refreshToken = result.getRefreshToken();
                var cognitoGetUser = userPool.getCurrentUser();
                if (cognitoGetUser != null) {
                cognitoGetUser.getSession(function(err, res) {
                    if (res) {
                    console.log ("User Successfuly Authenticated!");  
                    }
                }); 
                }               
                callback( null, result.getIdToken().getJwtToken() );
            },
            onFailure: function(err) {
                 console.log('logon failure: ' + err);
                 callback( err, "error");
            },    
            newPasswordRequired: function(err) {
                 console.log('newPasswordRequired: ' + err);
                 cognitoUser.completeNewPasswordChallenge(password+"x", {nickname: username}, this);
            },
            mfaRequired: function(codeDeliveryDetails) {
                var verificationCode = prompt('Please input verification code' ,'');
                cognitoUser.sendMFACode(verificationCode, this);
            }
        });
    }


    function omRefreshToken( callback ) {
       cognitoUser.refreshSession( refreshToken, function( err, res ) {
           if ( err ) {
                callback( err );
           }
           else {
               callback(null, res.getIdToken().getJwtToken());
           }

       });
    }


    module.exports = {
        signin: omSignIn,
        refresh: omRefreshToken
    }