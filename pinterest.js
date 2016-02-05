Accounts.oauth.registerService('pinterest');                                                            // 1  // 9
                                                                                                       // 2  // 10
if (Meteor.isClient) {                                                                                 // 3  // 11
  Meteor.loginWithPinterest = function(options, callback) {                                             // 4  // 12                                                            // 5  // 13
    if (! callback && typeof options === "function") {                                                 // 6  // 14
      callback = options;                                                                              // 7  // 15
      options = null;                                                                                  // 8  // 16
    }                                                                                                  // 9  // 17
                                                                                                       // 10
    var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);       // 19
    Pinterest.requestCredential(options, credentialRequestCompleteCallback);                            // 12
  };                                                                                                   // 13
} else {                                                                                               // 14
  Accounts.addAutopublishFields({                                                                      // 15                                                                    // 19
    forLoggedInUser: ['services.pinterest'],                                                            // 20
    forOtherUsers: [                                                                                   // 21                                              // 22
      'services.pinterest.id'
    ]                                                                                                  // 24
  });                                                                                                  // 25
} 