'use strict';

/**
 * @ngdoc function
 * @name projectsApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the projectsApp
 * */
 angular.module('projectsApp')
 .controller('SearchCtrl', function ($scope, $timeout, firebaseService,  $stateParams) {

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
      });
    });
    //$scope.selections = $scope.profiles;
    $scope.loaded = true;
    };

    $scope.searchProfiles = function(name){
      if(!$scope.loaded){
        $scope.loadProfiles();
        $scope.loaded = true;
      }
    };

    $scope.advancedSearch = function(input){
      if(!$scope.loaded){
        $scope.loadProfiles();
      }
      if(input === undefined){}
      else{
        var s = $scope.profiles.slice();
        console.log('reset list');
        if(input.firstName !== undefined && input.firstName != ''){
          for (var i = s.length - 1; i >= 0; i--) {
            if(s[i].val.firstName === undefined){s.splice(i,1);}
            else if(s[i].val.firstName.toLowerCase() != input.firstName.toLowerCase()){
              s.splice(i, 1);
            }
          }
        }
        if(input.lastName !== undefined && input.lastName != ''){
          for (var i = s.length - 1; i >= 0; i--) {
            if(s[i].val.lastName === undefined){s.splice(i,1);}
            else if(s[i].val.lastName.toLowerCase() != input.lastName.toLowerCase()){
              s.splice(i, 1);
            }
          }
        }
        if(input.gender !== undefined && input.gender != ''){
          for (var i = s.length - 1; i >= 0; i--) {
            if(s[i].val.gender === undefined){s.splice(i,1);}
            else if(s[i].val.gender != input.gender){
              s.splice(i, 1);
            }
          }
        }
        if(input.language !== undefined && input.language != ''){
          for (var i = s.length - 1; i >= 0; i--) {
            if(s[i].val.language === undefined){s.splice(i,1);}
            else if(s[i].val.language.toLowerCase() != input.language.toLowerCase()){
              s.splice(i, 1);
            }
          }
        }
        if(input.country !== undefined && input.country != ''){
          for (var i = s.length - 1; i >= 0; i--) {
            if(s[i].val.country === undefined || s[i].val.country == ''){s.splice(i,1);}
            else if(s[i].val.country.toLowerCase() != input.country.toLowerCase()){
              s.splice(i, 1);
            }
          }
        }
        if(input.age !== undefined && input.age != ''){
          for (var i = s.length - 1; i >= 0; i--) {
            if(s[i].age === undefined){s.splice(i,1);}
            else if(s[i].age != input.age){
              s.splice(i, 1);
            }
          }
        }
      }
      $scope.selections = s;
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