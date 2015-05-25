'use strict';

angular.module('projectsApp')
.controller('DashboardController',  function($scope, $http, $firebaseAuth, $firebaseArray, $firebaseObject , firebaseService, profileService, chatService) {
  var ref = new Firebase(firebaseService.getFirebBaseURL());
  var authObj = $firebaseAuth(ref);
  var authData = authObj.$getAuth();
  console.log('Dashboard Logged in as:', authData.uid);

  $scope.friendProfile = [];
  var friendsRef = new Firebase('https://shining-torch-23.firebaseio.com/profileInfo');
  $scope.friendProfiles  = $firebaseArray(friendsRef);

  $scope.clicked = function(friendUID) {
    //chatService used to add friendUID to recent chat page
    chatService.addFriendChat(friendUID);
  };
});
