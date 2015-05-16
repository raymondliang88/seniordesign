'use strict';

angular.module('projectsApp')
.controller('ChatController',  function($scope, $stateParams, $firebaseAuth, $firebaseArray, $firebaseObject , firebaseService, profileService, $mdDialog) {

  var ref = new Firebase(firebaseService.getFirebBaseURL());
  var authObj = $firebaseAuth(ref);
  var authData = authObj.$getAuth();
  console.log('Chat Logged in as:', authData.uid);


  //Chat
  // var chatRef = new Firebase('https://shining-torch-23.firebaseio.com/chats/'+ authData.uid);
  // $scope.chatList = $firebaseArray(chatRef);

















});