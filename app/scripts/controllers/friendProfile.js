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
		var param = $stateParams;
		console.log(param.user);
		$scope.username = param.user;


		//query firebase for info
  	var friendFirebaseRef = new Firebase("https://shining-torch-23.firebaseio.com/profileInfo/"+ param.user);
  	$scope.friendProfile = $firebaseObject(friendFirebaseRef);



});
