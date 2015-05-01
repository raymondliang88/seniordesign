'use strict';

/**
 * @ngdoc function
 * @name projectsApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the projectsApp
 * */

angular.module('projectsApp')
 .controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
  })

angular.module('projectsApp')
 .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
  })

angular.module('projectsApp')
  .controller('ToolBarCtrl', function ($scope, $firebaseAuth, $location, $timeout, $mdSidenav, $log, $state, searchService ) {
    var ref = new Firebase('https://shining-torch-23.firebaseio.com/');
    var authObj = $firebaseAuth(ref);
    var authData = authObj.$getAuth();


    $scope.toggleRight = buildToggler('right');
    $scope.toggleLeft = buildToggler('left');
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildToggler(navID) {
      return function() {
        return $mdSidenav(navID).toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }
    }

    $scope.goToSearch = function(queryString) {
      searchService.setSearchQuery(queryString);
      $state.go('home.search');
    };

    $scope.goToProfile = function() {
      $state.go('home.profile');
    };

    $scope.goToFriends = function() {
      $state.go('home.settings');
    };

    $scope.goToPhotos = function() {
      $state.go('home.photos');
    };

    $scope.goToMessages = function() {
      $state.go('home.messages');
    };

    $scope.goToFriends = function() {
      $state.go('home.friends');
    };

    $scope.goToSettings = function() {
      $state.go('home.settings');
    };

    $scope.goToDashboard = function() {
      $state.go('home.dashboard');
    };

    $scope.logout = function(){
      console.log("Logging Out!")
      ref.child('profileInfo').child(authData.uid).update({
        loggedIn: false
      });
      ref.unauth();
      $state.go('login');
    };

});