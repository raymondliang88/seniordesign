'use strict';

/**
 * @ngdoc function
 * @name projectsApp.controller:ForumCtrl
 * @description
 * # ForumCtrl
 * Controller of the projectsApp
 * */
 angular.module('projectsApp')
 .controller('ForumCtrl', function ($scope, firebaseService, $firebaseAuth, $firebaseArray, $firebaseObject) {
    
    var authRef = new Firebase(firebaseService.getFirebBaseURL())
    var authObj = $firebaseAuth(authRef);
    var authData = authObj.$getAuth();
    var forumRef = new Firebase('https://shining-torch-23.firebaseio.com/forumPosts/');
    var profileRef = new Firebase('https://shining-torch-23.firebaseio.com/profileInfo/'+ authData.uid);
    $scope.forumData;
    $scope.profileData;
    $scope.profilePics = {};
    $scope.profileName = {}

    //fetch forum posts, profile data
    async.parallel([
      function(callback){
        $scope.forumData = $firebaseArray(forumRef);
        $scope.forumData.$loaded()
        .then(function(data){
          //grab poster's image
          for (var i = data.length - 1; i >= 0; i--) {
            var posterRef = new Firebase('https://shining-torch-23.firebaseio.com/profileInfo/'+ data[i].creatorID);
            var posterInfo = $firebaseObject(posterRef);
            posterInfo.$loaded()
            .then(function(profile){
              //create hash table of poster pics to reference
              var uid = posterInfo.$id;
              $scope.profilePics[uid] = posterInfo.picture;
              $scope.profileName[uid] = posterInfo.firstName + " " + posterInfo.lastName;
              console.log($scope.profileName);
            });
          };
        });
      },
      function(callback){
        $scope.profileData = $firebaseObject(profileRef);
      }
    ]);

    $scope.createThread = function(text, title){
        var time = getTime();
        $scope.forumData.$add({
          creatorID: authData.uid,
          postDate: time,
          timeStamp: Firebase.ServerValue.TIMESTAMP, 
          title: title,
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