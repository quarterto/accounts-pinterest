Pinterest = {};                                                                                    // 1
                                                                                                  // 2
var querystring = Npm.require('querystring');                                                     // 3
                                                                                                  // 4
                                                                                                  // 5
OAuth.registerService('pinterest', 2, null, function(query) {                                      // 6                                             // 7
  var response = getTokenResponse(query);                                                         // 8
  var accessToken = response.accessToken; 
  console.log(accessToken);                                                        // 9         // 12
  var whitelisted = ['id', 'first_name', 'last_name'];                                     // 14                                                                             // 15
  var identity = getIdentity(accessToken, whitelisted);                                           // 16                                                  // 17
  var serviceData = {                                                                             // 18
    accessToken: accessToken,                                                                     // 19
    expiresAt: (+new Date) + (1000 * 1000000000000000)                                          // 20
  };                                                                                              // 21
                                                                                                  // 22
                                                                                                  // 23
  var fields = _.pick(identity, whitelisted);                                                     // 24
  _.extend(serviceData, fields);                                                                  // 25
    //console.log(identity.data.id);                                                                            // 26
  return {                                                                                        // 27
    serviceData: serviceData,                                                                     // 28
    options: {profile: {name: identity.data.id}}
    //options: {profile: {name: identity.name}}                                                     // 29
  };                                                                                              // 30
});                                                                                               // 31
                                                                                                  // 32
// checks whether a string parses as JSON                                                         // 33
var isJSON = function (str) {                                                                     // 34
  try {                                                                                           // 35
    JSON.parse(str);                                                                              // 36
    return true;                                                                                  // 37
  } catch (e) {                                                                                   // 38
    return false;                                                                                 // 39
  }                                                                                               // 40
};                                                                                                // 41
                                                                                                  // 42
// returns an object containing:                                                                  // 43
// - accessToken                                                                                  // 44
// - expiresIn: lifetime of token in seconds                                                      // 45
var getTokenResponse = function (query) {                                                         // 46
  var config = ServiceConfiguration.configurations.findOne({service: 'pinterest'});                // 47
  if (!config)                                                                                    // 48
    throw new ServiceConfiguration.ConfigError();                                                 // 49
                                                                                                  // 50
  var responseContent;                                                                            // 51
  try {                                                                                           // 52
    // Request an access token                                                                    // 53
        responseContent = HTTP.post(
      "https://api.pinterest.com/v1/oauth/token?", {
        headers: {"User-Agent": "Meteor/1.0"},
        params: {
          grant_type: 'authorization_code', 
          client_id: config.clientId,  
          redirect_uri: OAuth._redirectUri('pinterest', config), 
          client_secret: config.secret,                           
          code: query.code,
        }});                                                                                // 62
  } catch (err) {                                                                                 // 63
    throw _.extend(new Error("Failed to complete OAuth handshake with Facebook1. " + err.message),
                   {response: err.response});                                                     // 65
  }                                                                                               // 66
                                                                                                  // 67
  // If 'responseContent' parses as JSON, it is an error.                                         // 68
  // XXX which facebook error causes this behvaior?                                               // 69                                                                                               // 72
                                                                                                  // 73
  // Success!  Extract the facebook access token and expiration                                   // 74
  // time from the response     
  //console.log(responseContent);                                                                  // 75                           // 76
  var fbAccessToken = responseContent.data.access_token;   
  console.log(fbAccessToken);                                                      // 78
                                                                                                  // 79
  if (!fbAccessToken) {                                                                           // 80
    throw new Error("Failed to complete OAuth handshake with facebook " +                         // 81
                    "-- can't find access token in HTTP response. " + responseContent);           // 82
  }                                                                                               // 83
  return {                                                                                        // 84
    accessToken: fbAccessToken,                                                                   // 85                                                                        // 86
  };                                                                                              // 87
};                                                                                                // 88
                                                                                                  // 89
var getIdentity = function (accessToken, fields) {                                                // 90
  try {                                                                                           // 91
    return HTTP.get("https://api.pinterest.com/v1/me", {                                       // 92
      params: {                                                                                   // 93
        access_token: accessToken,  
                                                                      // 94                                                                           // 95
      }                                                                                           // 96
    }).data;                                                                                     // 97
  } catch (err) {                                                                                 // 98
    throw _.extend(new Error("Failed to fetch identity from Facebook. " + err.message),           // 99
                   {response: err.response});                                                     // 100
  }                                                                                               // 101
};                                                                                                // 102
                                                                                                  // 103
Pinterest.retrieveCredential = function(credentialToken, credentialSecret) {                       // 104
  return OAuth.retrieveCredential(credentialToken, credentialSecret);                             // 105
};   