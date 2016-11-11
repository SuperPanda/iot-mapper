angular.module('ng-iot.services', [])
.factory('UserService', function($q, $http) {
  var service = {
    _user: null,
    setCurrentUser: function(u) {
      if (u && !u.error) {
        AWSService.setToken(u.id_token);
        return service.currentUser();
      } else {
        var d = $q.defer();
        d.reject(u.error);
        return d.promise;
      }
    },
    currentUser: function() {
      var d = $q.defer();
      d.resolve(service._user);
      return d.promise;
    }
  };
  return service;
}).provider('AWSService', function() {
  var self = this;
  self.arn = null;
 
  self.setArn = function(arn) {
    if (arn) self.arn = arn;
  }
 
  self.$get = function($q) {
    return {}
  }
  
   self.$get = function($q) {
    var credentialsDefer = $q.defer(),
        credentialsPromise = credentialsDefer.promise;
 
    return {
      credentials: function() {
        return credentialsPromise;
      },
      setToken: function(token, providerId) {
        var config = {
          RoleArn: self.arn,
          WebIdentityToken: token,
          RoleSessionName: 'web-id'
        }
        if (providerId) {
          config['ProviderId'] = providerId;
        }
        self.config = config;
        AWS.config.credentials =
          new AWS.WebIdentityCredentials(config);
        credentialsDefer
          .resolve(AWS.config.credentials);
      }
    }
  }
  
});