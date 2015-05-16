'use strict';

/**
 * @ngdoc function
 * @name projectsApp.controller:ThreadCtrl
 * @description
 * # ThreadCtrl
 * Controller of the projectsApp
 * */
 angular.module('projectsApp')
 .controller('ThreadCtrl', function ($scope, firebaseService, $firebaseAuth, $firebaseArray, $firebaseObject, $state, $stateParams) {
    
    var authRef = new Firebase(firebaseService.getFirebBaseURL())
    var authObj = $firebaseAuth(authRef);
    var authData = authObj.$getAuth();
    var postID = $stateParams.thread;
    var commentRef = new Firebase('https://shining-torch-23.firebaseio.com/forumComments/'+ postID);
    var profileRef = new Firebase('https://shining-torch-23.firebaseio.com/profileInfo/'+ authData.uid);
    $scope.commentData;
    $scope.profileData;
    $scope.profilePics = {};
    $scope.profileName = {};

    //fetch forum posts, profile data
    async.parallel([
      function(callback){
        $scope.commentData = $firebaseArray(commentRef);
        $scope.commentData.$loaded()
        .then(function(data){
          console.log('comment data', data);
          //grab poster's image
          for (var i = data.length - 1; i >= 0; i--) {
            var posterRef = new Firebase('https://shining-torch-23.firebaseio.com/profileInfo/'+ data[i].creatorID);
            var posterInfo = $firebaseObject(posterRef);
            posterInfo.$loaded()
            .then(function(profile){
              //create hash table of poster pics to reference
              var uid = posterInfo.$id;
              $scope.profilePics[uid] = posterInfo.picture;
              $scope.profileName[uid] = posterInfo.firstName + ' ' + posterInfo.lastName;
            });
          };
        });
      },
      function(callback){
        $scope.profileData = $firebaseObject(profileRef);
      }
    ]);

    $scope.createComment = function(text){
      var time = getTime();
      console.log('making comment...');
      $scope.commentData.$add({
        creatorID: authData.uid,
        postDate: time,
        timeStamp: Firebase.ServerValue.TIMESTAMP, 
        text: text
      });
      document.getElementById("postForm").reset();
    };

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
 });