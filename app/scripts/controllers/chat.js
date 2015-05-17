'use strict';

angular.module('projectsApp')
.controller('ChatController',  function($scope, $stateParams, $firebaseAuth, $firebaseArray, $log, $firebaseObject , firebaseService, profileService, $mdDialog, chatService) {

  var ref = new Firebase(firebaseService.getFirebBaseURL());
  var authObj = $firebaseAuth(ref);
  var authData = authObj.$getAuth();
  console.log('Chat Logged in as:', authData.uid);

  $scope.myUID = authData.uid;

  $scope.products = chatService.getFriendChat();
  //Chat
  // var chatRef = new Firebase('https://shining-torch-23.firebaseio.com/chats/'+ authData.uid);
  // $scope.chatList = $firebaseArray(chatRef);
  $scope.selectedIndex = 1;
  //when user clicks a new tab, load info about current chat
  $scope.$watch('selectedIndex', function(current){
    // console.log(chatService.getFriendInfo(current));
    var fbInfo = chatService.getFriendInfo(current);
    // $scope.chatMessages = [];
    //fbInfo.$id = person you want to talk to
    var chatHashArr = [];

    var fbInfoIDNumber = fbInfo.$id.split(":")[1];
    var authDataIDNumber = authData.uid.split(":")[1];
    console.log(fbInfoIDNumber);
    console.log(authDataIDNumber);

    var chatHash = 'test';
    if (parseInt(fbInfoIDNumber) < parseInt(authDataIDNumber) ){
      chatHash = fbInfo.$id.concat( authData.uid);
    }
    else{
      chatHash = authData.uid.concat( fbInfo.$id);
    }


    // chatHashArr.push();
    // chatHashArr.push(authData.uid);
    // chatHashArr.sort();
    // console.log(chatHashArr);

    // var chatHash = chatHashArr[0].concat(chatHashArr[1]);
    console.log(chatHash);
    var chatRef = new Firebase('https://shining-torch-23.firebaseio.com/chat/'+ chatHash);
    $scope.chatList = $firebaseArray(chatRef);


  });

  $scope.sendMessage = function(message) {
    $scope.chatList.$add({
          senderID: authData.uid,
          timeStamp: Firebase.ServerValue.TIMESTAMP,
          message: message
        });
  }

  $scope.style1 = 'myMessages';














});