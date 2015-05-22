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
    var topicRef = new Firebase('https;//shining-torch-23.firebaseio.com/forumPosts/'+ postID);
    var commentRef = new Firebase('https://shining-torch-23.firebaseio.com/forumComments/'+ postID);
    var profileRef = new Firebase('https://shining-torch-23.firebaseio.com/profileInfo/'+ authData.uid);
    $scope.topic;
    $scope.commentData;
    $scope.profileData;
    $scope.profilePics = {};
    $scope.profileName = {}

    //fetch forum posts, profile data
    async.parallel([
      function(callback){
        $scope.commentData = $firebaseArray(commentRef);
        $scope.commentData.$loaded()
        .then(function(data){
          //grab poster's image
          for (var i = data.length - 1; i >= 0; i--) {
            var posterRef = new Firebase('https://shining-torch-23.firebaseio.com/profileInfo/'+ data[i].creatorID);
            var posterInfo = $firebaseObject(posterRef);
            posterInfo.$loaded()
            .then(function(profile){
              $scope.profilePics[profile.$id] = profile.picture;
              $scope.profileName[profile.$id] = profile.firstName + ' ' + profile.lastName;
            });
          }
        });
      },
      function(callback){
        $scope.profileData = $firebaseObject(profileRef);
        $scope.profileData.$loaded()
        .then(function(data){
          $scope.profilePics[data.$id] = data.picture;
          $scope.profileName[data.$id] = data.firstName + ' ' + data.lastName;  
        });
      },
      function(callback){
        $scope.topic = $firebaseObject(topicRef);
        $scope.topic.$loaded()
        .then(function(data){
          var topicUser = new Firebase('https://shining-torch-23.firebaseio.com/profileInfo/'+ data.creatorID);
          var topicProfile = $firebaseObject(topicUser);
          topicProfile.$loaded()
          .then(function(profile){
            $scope.profilePics[profile.$id] = profile.picture;
            $scope.profileName[profile.$id] = profile.firstName + ' ' + profile.lastName; 
          });
        });
      }
    ]);

    $scope.createComment = function(text){
      var time = getTime();
      $scope.commentData.$add({
        creatorID: $scope.profileData.$id,
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