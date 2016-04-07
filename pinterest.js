Accounts.oauth.registerService('pinterest');

if (Meteor.isClient) {
	Meteor.loginWithPinterest = function(options, callback) {
		if (! callback && typeof options === "function") {
			callback = options;
			options = null;
		}

		var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
		Pinterest.requestCredential(options, credentialRequestCompleteCallback);
	};
} else {
	Accounts.addAutopublishFields({
		forLoggedInUser: ['services.pinterest'],
		forOtherUsers: [
			'services.pinterest.id'
		]
	});
} 
