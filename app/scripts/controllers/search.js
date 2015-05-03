'use strict';

/**
 * @ngdoc function
 * @name projectsApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the projectsApp
 * */
 angular.module('projectsApp')
 .controller('SearchCtrl', function ($scope, $timeout, firebaseService) {

    $scope.selectedProfile = {};
    $scope.loaded = false;
    $scope.profiles = [];
    $scope.selections = [];

    var ref = new Firebase(firebaseService.getFirebBaseURL());
    $scope.loadProfiles = function(){
      ref.child('profileInfo').once('value', function (snapshot) {
        console.log('...fetch users...');
        snapshot.forEach(function(child) {
          var key = child.key();
          var val = child.val();
          var profile = {};
          profile.key = key;
          profile.val = val;
          $scope.profiles.push(profile);
        })
      });
    };

    $scope.advancedSearch = function(input){
      if(!$scope.loaded){
        $scope.loadProfiles();
        $scope.loaded = true;
      }
      else{
        selections = profiles;
        for (var i = selections.length - 1; i >= 0; i--) {
          selections[i]
        };

        if(input.firstName != undefined){

        }
        if(input.lastName != undefined){

        }
        if(input.gender != undefined){

        }
        if(input.language != undefined){

        }
        if(input.country != undefined){

        }
        if(input.age != undefined){

        }
      }
    };

  }).directive('keyboardPoster', function($parse, $timeout){
  var DELAY_TIME_BEFORE_POSTING = 0;
  return function(scope, elem, attrs) {
    var element = angular.element(elem)[0];
    var currentTimeout = null;
   
    element.oninput = function() {
      var model = $parse(attrs.postFunction);
      var poster = model(scope);
      
      if(currentTimeout) {
        $timeout.cancel(currentTimeout)
      }
      currentTimeout = $timeout(function(){
           poster(angular.element(element).val());
      }, DELAY_TIME_BEFORE_POSTING)
    }
  }
})