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
          $log.debug('close RIGHT is done');
        });
    };
  });

angular.module('projectsApp')
 .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          // $log.debug('close RIGHT is done');
        });
    };
  });

angular.module('projectsApp')
  .controller('ToolBarCtrl', function ($scope, $firebaseAuth, $location, $timeout, $mdSidenav, $log, $state, searchService ,  $firebaseObject) {
    var ref = new Firebase('https://shining-torch-23.firebaseio.com/');
    var authObj = $firebaseAuth(ref);
    var authData = authObj.$getAuth();

    $scope.userid = authData.uid;

    // notification: check # of pending friends
    // var pending = ref.child('pending').child(authData.uid).child('pendingTotal').once('value', function(snapshot) {
    //   var val = snapshot.val();
    //   $scope.pendingTotal = val;
    //   return val;
    // });

    var friendRequestRef = new Firebase('https://shining-torch-23.firebaseio.com/pending/'+ authData.uid +  '/pendingTotal');
    $scope.friendRequestObj = $firebaseObject(friendRequestRef);

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
            // $log.debug('toggle ' + navID + ' is done');
          });
      };
    }

    $scope.checkPending = function() {
      // pop up to show friend requests you can accept
    };

    $scope.goToSearch = function(queryString) {
      searchService.setSearchQuery(queryString);
      $state.go('home.search');
    };

    //pass uid to go to
    $scope.goToProfile = function(userid) {
      $state.go('home.profile.user' , {user: userid});
    };

    $scope.goToFriends = function() {
      $state.go('home.settings');
    };

    $scope.goToPhotos = function(userid) {
      console.log('Sending to photos uid ' + userid);
      $state.go('home.photos.user' , {user: userid});
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

    $scope.goToFriendRequest = function() {
      $state.go('home.friendRequests');
    };

    $scope.goToDashboard = function() {
      $state.go('home.dashboard');
    };

    $scope.goToForum = function() {
      $state.go('home.forum');
    };

    $scope.goToThread = function(threadid) {
      $state.go('home.forum.thread', {thread: threadid});
    };

    $scope.goToCulture = function() {
      $state.go('home.culture');
    };

    $scope.logout = function(){
      console.log('Logging Out!');
      ref.child('profileInfo').child(authData.uid).update({
        loggedIn: false
      });
      localStorage.clear();
      ref.unauth();
      $state.go('login');
    };

});
