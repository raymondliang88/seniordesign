'use strict';

angular.module('projectsApp')
.controller('ChatController',  function($scope, $stateParams, $firebaseAuth, $firebaseArray, $log, $firebaseObject , firebaseService, profileService, $mdDialog, chatService) {

  var ref = new Firebase(firebaseService.getFirebBaseURL());
  var authObj = $firebaseAuth(ref);
  var authData = authObj.$getAuth();
  console.log('Chat Logged in as:', authData.uid);

  $scope.products = chatService.getFriendChat();
  //Chat
  // var chatRef = new Firebase('https://shining-torch-23.firebaseio.com/chats/'+ authData.uid);
  // $scope.chatList = $firebaseArray(chatRef);
  $scope.selectedIndex = 1;
  $scope.$watch('selectedIndex', function(current){
    console.log("current" + current);
  });



  $scope.chats = function (friendUID) {
    //get chat messages at chat/ yourUID / friendUID


    //get chat messages at chat / friendUID / yourUID


    //combine both arrays and sort into one based on timestamp


    //return the final array


    return ["hello", friendUID];

  };













});