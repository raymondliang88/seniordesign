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
    'facebook'
  ])
  .run(["$rootScope", "$location", function($rootScope, $location) {
    $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
      // We can catch the error thrown when the $requireAuth promise is rejected
      // and redirect the user back to the home page
      if (error === "AUTH_REQUIRED") {
        window.alert('You forgot to log in!');
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
        templateUrl: '/views/home.html',
        // views: {
        controller: 'HomeCtrl',
        resolve: {
        // controller will not be loaded until $requireAuth resolves
          "currentAuth": ["$firebaseAuth", function ($firebaseAuth) {
            var ref = new Firebase('https://shining-torch-23.firebaseio.com/');
            var authObj = $firebaseAuth(ref);
            return authObj.$requireAuth();
          }]
        }
      })
      .state('dashboard', {
        url: 'dashboard',
        parent: 'home',
        templateUrl: '/views/test.html',
      })
      .state('settings', {
        url: '/settings',
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
