'use strict';

/**
 * @ngdoc function
 * @name projectsApp.controller:ForumCtrl
 * @description
 * # ForumCtrl
 * Controller of the projectsApp
 * */
 angular.module('projectsApp')
 .controller('ForumCtrl', function ($scope, firebaseService, $firebaseAuth, $firebaseArray) {
    
    var authRef = new Firebase(firebaseService.getFirebBaseURL())
    var authObj = $firebaseAuth(authRef);
    var authData = authObj.$getAuth();
    var forumRef = new Firebase('https://shining-torch-23.firebaseio.com/forumPosts/');
    $scope.forumData;

    //fetch forum posts
    async.parallel([
      function(callback){
        $scope.forumData = $firebaseArray(forumRef);
        $scope.forumData.$loaded()
        .then(function(data){
          console.log(data);
        });
      }
    ]);

    $scope.createThread = function(text, title){
        $scope.forumData = $firebaseArray(forumRef);
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