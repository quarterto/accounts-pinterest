Pinterest = {};

var querystring = Npm.require('querystring');


OAuth.registerService('pinterest', 2, null, function(query) {
	var response = getTokenResponse(query);
	var accessToken = response.accessToken; 
	console.log(accessToken);
	var whitelisted = ['id', 'first_name', 'last_name'];
	var identity = getIdentity(accessToken, whitelisted);
	var serviceData = {
		accessToken: accessToken,
		expiresAt: (+new Date) + (1000 * 1000000000000000)
	};
	
	
	var fields = _.pick(identity, whitelisted);
	_.extend(serviceData, fields);
	//console.log(identity.data.id);
	return {
		serviceData: serviceData,
		options: {profile: {name: identity.data.id}}
		//options: {profile: {name: identity.name}}
	};
});


// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
var getTokenResponse = function (query) {
	var config = ServiceConfiguration.configurations.findOne({service: 'pinterest'});
	if (!config)
		throw new ServiceConfiguration.ConfigError();
	
	var responseContent;
	try {
		// Request an access token
		responseContent = HTTP.post(
			"https://api.pinterest.com/v1/oauth/token?", {
				headers: {"User-Agent": "Meteor/1.0"},
				params: {
					grant_type: 'authorization_code', 
					client_id: config.clientId,  
					redirect_uri: OAuth._redirectUri('pinterest', config), 
					client_secret: config.secret,                           
					code: query.code,
				}});
	} catch (err) {
		throw _.extend(new Error("Failed to complete OAuth handshake with Facebook1. " + err.message),
									 {response: err.response});
	}
	
	// If 'responseContent' parses as JSON, it is an error.
	// XXX which facebook error causes this behvaior?
	
	// Success!  Extract the facebook access token and expiration
	// time from the response     
	//console.log(responseContent);
	var fbAccessToken = responseContent.data.access_token;   
	console.log(fbAccessToken);
	
	if (!fbAccessToken) {
		throw new Error("Failed to complete OAuth handshake with facebook " +
										"-- can't find access token in HTTP response. " + responseContent);
	}
	console.log(responseContent.data);
	return {
		accessToken: fbAccessToken,
	};
};

var getIdentity = function (accessToken, fields) {
	try {
		return HTTP.get("https://api.pinterest.com/v1/me", {
			params: {
				access_token: accessToken,  
				
			}
		}).data;
	} catch (err) {
		throw _.extend(new Error("Failed to fetch identity from Facebook. " + err.message),
									 {response: err.response});
	}
};

Pinterest.retrieveCredential = function(credentialToken, credentialSecret) {
	return OAuth.retrieveCredential(credentialToken, credentialSecret);
};   
