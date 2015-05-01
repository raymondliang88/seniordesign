'use strict';

/**
 * @ngdoc overview
 * @name projectsApp
 * @description
 * # projectsApp
 *
 * Main module of the application.
 */
angular
  .module('projectsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
    'firebase',
    'ui.router',
    'angularUtils.directives.dirPagination',
    'facebook',
    'angular-datepicker'
  ])
  .run(["$rootScope", "$location", function($rootScope, $location, alertService) {
    $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
      // We can catch the error thrown when the $requireAuth promise is rejected
      // and redirect the user back to the home page
      if (error === "AUTH_REQUIRED") {
        var title= 'Auth Required';
        var msg = 'You are not logged in. You shall not pass';
        alertService.show(title,msg,"");
        console.log("auth required");

        $location.path("/");
      }
    });
  }])
  .config(function ($urlRouterProvider, $stateProvider,  $mdThemingProvider, FacebookProvider) {
    $mdThemingProvider.theme('default');//.light();//.dark();
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .state('home',{
        url: '/home',
        abstract: true,
        views: {
          'header': {
            templateUrl: '/views/toolbar_partial.html',
            controller: 'ToolBarCtrl',
            resolve: {
            // controller will not be loaded until $requireAuth resolves
              "currentAuth": ["$firebaseAuth", function ($firebaseAuth) {
                var ref = new Firebase('https://shining-torch-23.firebaseio.com/');
                var authObj = $firebaseAuth(ref);
                //console.log(authObj.$requireAuth());
                return authObj.$requireAuth();
              }]
            }
          }
        }
      })
      .state('home.dashboard', {
        url: '/dashboard',
        views: {
          'container@': {
            templateUrl: '/views/dashboard.html',
            //should use separate controller
            controller: 'ToolBarCtrl',
            resolve: {
            // controller will not be loaded until $requireAuth resolves
              "currentAuth": ["$firebaseAuth", function ($firebaseAuth) {
                var ref = new Firebase('https://shining-torch-23.firebaseio.com/');
                var authObj = $firebaseAuth(ref);
                return authObj.$requireAuth();
              }]
            }
          }
        },
        onEnter: function(provisionSettings) {
          provisionSettings.getUserProvision(provisionSettings.getMoreUserInfo);
        }
      })
      .state('home.profile', {
        url: '/profile',
        views: {
          'container@': {
            templateUrl: '/views/profile.html',
            controller: 'ProfileCtrl',
            resolve: {
            // controller will not be loaded until $requireAuth resolves
              "currentAuth": ["$firebaseAuth", function ($firebaseAuth) {
                var ref = new Firebase('https://shining-torch-23.firebaseio.com/');
                var authObj = $firebaseAuth(ref);
                return authObj.$requireAuth();
              }]
            }
          }
        }
      })
      .state('home.profile.user', {
        url: '/:user',
        views: {
          'container@': {
            templateUrl: '/views/friendProfile.html',
            controller: 'FriendProfileCtrl',
            resolve: {
            // controller will not be loaded until $requireAuth resolves
              "currentAuth": ["$firebaseAuth", function ($firebaseAuth) {
                var ref = new Firebase('https://shining-torch-23.firebaseio.com/');
                var authObj = $firebaseAuth(ref);
                return authObj.$requireAuth();
              }]
            }
          }
        }
      })
      .state('home.friends', {
        url: '/friends',
        views: {
          'container@': {
            templateUrl: '/views/friends.html',
            controller: 'ToolBarCtrl',
            resolve: {
            // controller will not be loaded until $requireAuth resolves
              "currentAuth": ["$firebaseAuth", function ($firebaseAuth) {
                var ref = new Firebase('https://shining-torch-23.firebaseio.com/');
                var authObj = $firebaseAuth(ref);
                return authObj.$requireAuth();
              }]
            }
          }
        }
      })
      .state('home.settings', {
        url: '/settings',
        views: {
          'container@': {
            templateUrl: 'views/settings.html',
            controller: 'SettingsCtrl',
            resolve: {
            // controller will not be loaded until $requireAuth resolves
              "currentAuth": ["$firebaseAuth", function ($firebaseAuth) {
                      var ref = new Firebase('https://shining-torch-23.firebaseio.com/');
                      var authObj = $firebaseAuth(ref);
                      return authObj.$requireAuth();
                  }
              ]
            }
          }
        }
      })
      .state('home.photos', {
        url: '/photos',
        views: {
          'container@': {
            templateUrl: '/views/photos.html',
            controller: 'ToolBarCtrl',
            resolve: {
            // controller will not be loaded until $requireAuth resolves
              "currentAuth": ["$firebaseAuth", function ($firebaseAuth) {
                var ref = new Firebase('https://shining-torch-23.firebaseio.com/');
                var authObj = $firebaseAuth(ref);
                return authObj.$requireAuth();
              }]
            }
          }
        }
      })
      .state('home.search', {
        url: '/search',
        onEnter: function(){
        },
        views: {
          'container@': {
            templateUrl: '/views/search.html',
            controller: 'SearchCtrl',
            resolve: {
            // controller will not be loaded until $requireAuth resolves
              "currentAuth": ["$firebaseAuth", function ($firebaseAuth) {
                var ref = new Firebase('https://shining-torch-23.firebaseio.com/');
                var authObj = $firebaseAuth(ref);
                return authObj.$requireAuth();
              }]
            }
          }
        }
      })
      .state('home.messages', {
        url: '/messages',
        views: {
          'container@': {
            templateUrl: '/views/messages.html',
            controller: 'ToolBarCtrl',
            resolve: {
            // controller will not be loaded until $requireAuth resolves
              "currentAuth": ["$firebaseAuth", function ($firebaseAuth) {
                var ref = new Firebase('https://shining-torch-23.firebaseio.com/');
                var authObj = $firebaseAuth(ref);
                return authObj.$requireAuth();
              }]
            }
          }
        }
      })
      FacebookProvider.init('1571917669752119');
  });
// themes colors:
// Limit your selection of colors by choosing three color hues from the primary palette
// and one accent color from the secondary palette.
// The accent color may or may not need fallback options.
// Rules :
// 1. Only use the accent color for body text to accent a web link. Do not use the
//    accent color for body text color.
// 2. Don’t use the accent color for app bars or larger areas of color.
//    Avoid using the same color for the floating action button and the background.
// $mdIconProvider
//   .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
//   .defaultIconSet('img/icons/sets/core-icons.svg', 24);
//.primaryPalette('indigo')
//.accentPalette('pink');
//.warnPalette ('');
