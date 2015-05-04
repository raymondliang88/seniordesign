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
      //$scope.selections = $scope.profiles;
      $scope.loaded = true;
    };

    $scope.loadProfiles();

    $scope.advancedSearch = function(input){
      if(!$scope.loaded){
        $scope.loadProfiles();
      }
      if(input === undefined){}
      else{
        var s = $scope.profiles;
        if(input.firstName !== undefined && input.firstName != ''){
          for (var i = s.length - 1; i >= 0; i--) {
            if(s[i].val.firstName === undefined){continue;}
            else if(s[i].val.firstName.toLowerCase() != input.firstName.toLowerCase()){
              s.splice(i, 1);
            }
          }
        }
        if(input.lastName !== undefined && input.lastName != ''){
          for (var i = s.length - 1; i >= 0; i--) {
            if(s[i].val.lastName === undefined){continue;}
            else if(s[i].val.lastName.toLowerCase() != input.lastName.toLowerCase()){
              s.splice(i, 1);
            }
          }
        }
        if(input.gender !== undefined){
          for (var i = s.length - 1; i >= 0; i--) {
            if(s[i].val.gender === undefined){continue;}
            else if(s[i].val.gender != input.gender){
              s.splice(i, 1);
            }
          }
        }
        if(input.language !== undefined){
          for (var i = s.length - 1; i >= 0; i--) {
            if(s[i].val.language === undefined){continue;}
            else if(s[i].val.language.toLowerCase() != input.language.toLowerCase()){
              s.splice(i, 1);
            }
          }
        }
        if(input.country !== undefined){
          for (var i = s.length - 1; i >= 0; i--) {
            if(s[i].val.country === undefined){continue;}
            else if(s[i].val.country != input.country){
              s.splice(i, 1);
            }
          }
        }
        if(input.age !== undefined){
          for (var i = s.length - 1; i >= 0; i--) {
            if(s[i].age === undefined){continue;}
            else if(s[i].age != input.age){
              s.splice(i, 1);
            }
          }
        }
      }
      $scope.selections = s;
      console.log('input: ', input);
      console.log('total selections: ', $scope.selections);
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
});