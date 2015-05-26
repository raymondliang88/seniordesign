'use strict';

/**
 * @ngdoc function
 * @name projectsApp.controller:CultureCtrl
 * @description
 * # CultureCtrl
 * Controller of the projectsApp
 * */
 angular.module('projectsApp')
 .controller('CultureCtrl', function ($scope, firebaseService, $firebaseAuth, $firebaseArray, $firebaseObject) {

  var authRef = new Firebase(firebaseService.getFirebBaseURL())
  var authObj = $firebaseAuth(authRef);
  var authData = authObj.$getAuth
  var profileRef = new Firebase('https://shining-torch-23.firebaseio.com/profileInfo');
  $scope.selections;
  $scope.profileInfo = []; 

  async.parallel([
      function(callback){
        var profiles = $firebaseArray(profileRef);
        profiles.$loaded()
        .then(function(data){
          $scope.profileInfo = data;
        });
      }
    ]);

  $scope.search = function(input){
    if(input !== undefined){
      var s = $scope.profileInfo.slice();
      if(input.language !== undefined){
        for (var i = s.length - 1; i >= 0; i--) {
          if(s[i].language === undefined){
            s.splice(i,1);
          }
          else if(s[i].language.toLowerCase() != input.language.toLowerCase()){
            s.splice(i, 1);
          }
        }
      }  
      if(input.country !== undefined){
        for (var i = s.length - 1; i >= 0; i--) {
          if(s[i].country === undefined){
            s.splice(i,1);
          }
          else if(s[i].country.toLowerCase() != input.country.toLowerCase()){
            s.splice(i, 1);
          }
        }
      }
      $scope.selections = s;
    }
  };

});