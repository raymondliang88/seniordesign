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
  var profiles;    

  async.parallel([
      function(callback){
        profiles = $firebaseObject(profileRef);
      }
    ]);

  $scope.search = function(input){
    if(input !== undefined){
      if(input.language !== undefined){

      }
      if(input.language !== undefined){
        
      }
    }
  };

});