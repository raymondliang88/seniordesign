'use strict';

/**
 * @ngdoc function
 * @name projectsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the projectsApp
**/
angular.module('projectsApp')
.controller('FriendProfileCtrl',  function($scope, $http, $firebaseAuth, $firebaseArray, $firebaseObject, $stateParams , firebaseService, profileService) {
		var ref = new Firebase(firebaseService.getFirebBaseURL());
    var authObj = $firebaseAuth(ref);
    var authData = authObj.$getAuth();
    var param = $stateParams;
		console.log(param.user);
		$scope.username = param.user;
    
    $scope.commonFriends = 0;

    //Find number of friends in common
    var profileFriends = new Firebase("https://shining-torch-23.firebaseio.com/friends/"+ param.user);
    var profileObj = $firebaseObject(profileFriends);
    profileObj.$loaded()
    .then(function(data) {
      console.log(data === profileObj); //true
      var profileList = {};
      if (data.friendList !== undefined) {
          profileList = data.friendList;
      }
      var userFriends = new Firebase("https://shining-torch-23.firebaseio.com/friends/"+ authData.uid);
      var userObj = $firebaseObject(userFriends);
      userObj.$loaded()
      .then(function(data) {
        var userList = {};
        if(data.friendList !== undefined){
          userList = data.friendList;
        }
        for(var i in userList){
          if(profileList[i] !== undefined){
            $scope.commonFriends = $scope.commonFriends + 1;
          }
        }
      });
    })
    .catch(function(error) {
      console.error("Error:", error);
    });

		//query firebase for info
  	var friendFirebaseRef = new Firebase("https://shining-torch-23.firebaseio.com/profileInfo/"+ param.user);
  	$scope.friendProfile = $firebaseObject(friendFirebaseRef);
});
