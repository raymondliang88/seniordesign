'use strict';

angular.module('projectsApp')
.controller('DashboardController',  function($scope, $http, $firebaseAuth, $firebaseArray, $firebaseObject , firebaseService, profileService, $mdDialog) {

  var ref = new Firebase(firebaseService.getFirebBaseURL());
  var authObj = $firebaseAuth(ref);
  var authData = authObj.$getAuth();
  console.log('Dashboard Logged in as:', authData.uid);

  $scope.friendProfile = [];
  //gets list of all current users friends
  var friendsRef = new Firebase('https://shining-torch-23.firebaseio.com/friends/'+ authData.uid +'/friendList');

  //for each person in the friends array, loop through the array to get user profile
  var list = $firebaseArray(friendsRef);
  var friendProfileArr = [];
  list.$loaded(
  function(x) {
    //loops through and gets profile data, adds to friendprofile array
    //friend profile array contains array of userprofileData objects
    x.forEach(function(entry) {
      // console.log(entry.$value);
      console.log(entry);
      getUserProfileInfo(entry.$id);
    });
    // $scope.friendProfiles = friendProfile;
    }, function(error) {
        console.error('Error:', error);
  });

  //gets user profile info
  var getUserProfileInfo = function(userid) {
    var userProfileRef = new Firebase('https://shining-torch-23.firebaseio.com/profileInfo/'+ userid);
    var profileData = $firebaseObject(userProfileRef);
    profileData.$loaded(
      function(data) {
        friendProfileArr.push(data);
      },
      function(error) {
        console.error('Error:', error);
      }
    );
    $scope.friendProfiles = friendProfileArr;
  };

  $scope.clicked = function() {
    console.log("clicked");
  }

  //Chat
  // var chatRef = new Firebase('https://shining-torch-23.firebaseio.com/chats/'+ authData.uid);
  // $scope.chatList = $firebaseArray(chatRef);

















});