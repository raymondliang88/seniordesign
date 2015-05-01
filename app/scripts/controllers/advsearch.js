'use strict';

/**
 * @ngdoc function
 * @name projectsApp.controller:AdvSearchCtrl
 * @description
 * # AdvSearchCtrl
 * Controller of the projectsApp
 * */
 angular.module('projectsApp')
 .controller('AdvSearchCtrl', function ($scope, $timeout, firebaseService,$firebaseAuth) {

    $scope.advResults = [];
    var ref = new Firebase(firebaseService.getFirebBaseURL());
    var authObj = $firebaseAuth(ref);
    var authData = authObj.$getAuth();
    /**
     * [queryProfiles description]
     * @return {Array} [Returns an array of profiles ranked by their match with
     *                  user input.]
     */
    $scope.queryProfiles = function(){

    };

    $scope.advancedSearch = function(userInput){
      if(userInput === undefined){
        console.log('Received input was undefined.');
      }
      else{
        if(userInput.firstName !== undefined){
          console.log(userInput.firstName);
        }
        if(userInput.lastName !== undefined){

        }
        if(userInput.gender !== undefined){

        }
        if(userInput.language !== undefined){

        }
        if(userInput.country !== undefined){

        }
        if(userInput.age !== undefined){
          
        }

      }
    };

    

  });