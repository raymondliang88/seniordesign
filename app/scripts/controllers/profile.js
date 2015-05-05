'use strict';

angular.module('projectsApp')
  .controller('ProfileCtrl',
    function ($scope, $stateParams, firebaseService, userService, $firebaseAuth, $state, $firebaseArray, $firebaseObject) {
      var ref = new Firebase(firebaseService.getFirebBaseURL());
      var authObj = $firebaseAuth(ref);
      var authData = authObj.$getAuth();
      console.log("Logged in as:" +  authData.uid);

      //get all parameters passed into this controller
      var param = $stateParams;
      // this profile's uid
      var profileUID = param.user;

      //get user profile Data
      var profileDataRef = new Firebase("https://shining-torch-23.firebaseio.com/profileInfo/"+ profileUID);
      $scope.profileData = $firebaseObject(profileDataRef);

      //postData returns a list of post
      var profilePostRef = new Firebase("https://shining-torch-23.firebaseio.com/posts/"+ profileUID);
      $scope.postData = $firebaseArray(profilePostRef);
      console.log("Post data" + $scope.postData);

      //timestamp
      var getTime = function() {
        var date = new Date();
        return [date.getMonth()+1,
                date.getDate(),
                date.getFullYear()].join('/')+' '+
                [date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()].join(':');
      }

      //add a new post
      $scope.addTextPost = function(message) {
        var time = getTime();
        $scope.postData.$add({
          senderID: authData.uid,
          messageType: "text",
          postDate: time,
          timeStamp: Firebase.ServerValue.TIMESTAMP,
          message: message
        });
      };

      //remove post
      $scope.removePost = function(postID) {
        var time = getTime();
        console.log("removing item" + postID);
        var item = $scope.postData[1];
        $scope.postData.$remove(item).then(function (ref) {
          console.log(ref.key);
        });
      };

      //add an image post
      $scope.addImagePost = function(message) {
        var time = getTime();
        $scope.postData.$add({
          senderID: authData.uid,
          messageType: "image",
          postDate: time,
          timeStamp: Firebase.ServerValue.TIMESTAMP,
          message: message
        });
      };


      //Add a comment to a post, pass in postID
      $scope.addComment = function(postID, message) {
        var time = getTime();
        console.log('gonna post a comment');
        var profilePostRef = new Firebase("https://shining-torch-23.firebaseio.com/posts/"+ profileUID + "/" +  postID + "/comments/");
        $scope.postComment = $firebaseArray(profilePostRef);
        $scope.postComment.$add({
          senderID: authData.uid,
          messageType: "text",
          postDate: time,
          timeStamp: Firebase.ServerValue.TIMESTAMP,
          message: message
        });
      }

      //true if current profile belongs to the user
      $scope.profileOwner = (authData.uid === profileUID);

      // $scope.profileOwner = function() {
      //   console.log("Authdata" + authData.uid);
      //   console.log("Profile uid" + profileUID);

      //   return authData.uid === profileUID;
      // };
});
