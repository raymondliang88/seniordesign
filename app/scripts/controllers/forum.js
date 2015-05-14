'use strict';

/**
 * @ngdoc function
 * @name projectsApp.controller:ForumCtrl
 * @description
 * # ForumCtrl
 * Controller of the projectsApp
 * */
 angular.module('projectsApp')
 .controller('SearchCtrl', function ($scope, firebaseService) {
    
    var authRef = new Firebase(firebaseService.getFirebBaseURL())
    var authObj = $firebaseAuth(ref);
    var authData = authObj.$getAuth();
    var forumRef = new Firebase('https://shining-torch-23.firebaseio.com/forumPosts/');

    $scope.loadLatest{
      //Query for the last 20 posts
      var latest = forumRef.orderByChild("timestamp").limitToLast(20);
      console.log(latest);
    };

    async.parallel([
      function(callback){
        var profilePostRef = new Firebase('https://shining-torch-23.firebaseio.com/posts/'+ profileUID);
        $scope.postData = $firebaseArray(profilePostRef);
        console.log('Post data' + $scope.postData);
      }
    ]);
    3
    $scope.createPost(text, title){
        var time = getTime();
        $scope.postData.$add({
          creatorID: authData.uid,
          postDate: time,
          timeStamp: Firebase.ServerValue.TIMESTAMP, 
          title: title,
          text: text
        });
        document.getElementById("postForm").reset();
        $scope.loadLatest();
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