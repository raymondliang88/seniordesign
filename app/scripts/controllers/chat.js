'use strict';

angular.module('projectsApp')
.controller('ChatController',  function($scope, $state, $stateParams, $firebaseAuth, $firebaseArray, $log, $firebaseObject , firebaseService, profileService, $mdDialog, chatService) {

  var ref = new Firebase(firebaseService.getFirebBaseURL());
  var authObj = $firebaseAuth(ref);
  var authData = authObj.$getAuth();
  console.log('Chat Logged in as:', authData.uid);

  $scope.myUID = authData.uid;

  $scope.products = chatService.getFriendChat();
  $scope.selectedIndex = 1;

  //when user clicks a new tab, load info about current chat
  $scope.$watch('selectedIndex', function(current){
    var fbInfo = chatService.getFriendInfo(current);
    var chatHashArr = [];
    var fbInfoIDNumber = fbInfo.$id.split(':')[1];
    var authDataIDNumber = authData.uid.split(':')[1];
    var chatHash = '';

    if (parseInt(fbInfoIDNumber) < parseInt(authDataIDNumber) ){
      chatHash = fbInfo.$id.concat( authData.uid);
    }
    else{
      chatHash = authData.uid.concat( fbInfo.$id);
    }

    var chatRef = new Firebase('https://shining-torch-23.firebaseio.com/chat/'+ chatHash);
    $scope.chatList = $firebaseArray(chatRef);
  });

  var myselfDataRef = new Firebase('https://shining-torch-23.firebaseio.com/profileInfo/'+ authData.uid);
  $scope.myselfData = $firebaseObject(myselfDataRef);

  $scope.sendMessage = function(message) {
    $scope.chatList.$add({
          senderID: authData.uid,
          timeStamp: Firebase.ServerValue.TIMESTAMP,
          message: message,
          senderFirstName: $scope.myselfData.firstName,
          senderLastName: $scope.myselfData.lastName
    });
  };

  $scope.goToProfile = function(userid) {
    $state.go('home.profile.user' , {user: userid});
  };

});