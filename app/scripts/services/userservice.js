'use strict';

/**
 * @ngdoc service
 * @name projectsApp.userService
 * @description
 * # userService
 * Service in the projectsApp.
 */
// AngularJS will instantiate a singleton by calling "new" on this function
angular.module('projectsApp')
  .factory('userService', function (firebaseService) {
    var user;
    return {
      setCurrentUser: function(val) {
        user = val;
      },
      getCurrentUser: function() {
        return user;
      },
      updateKey: function(key, value){
        user.key = value;
        return user;
      }
    }
  })
  .factory('provisionSettings', function ($firebaseAuth, $mdDialog, userService, Facebook) {
  	var firebaseURL = 'https://shining-torch-23.firebaseio.com/';
    var ref = new Firebase(firebaseURL);
    var authObj = $firebaseAuth(ref);
    var authData = authObj.$getAuth();
    //userService.setCurrentUser(authData);

    var saveMoreSettings = function(user, imageSrc) {
      console.log('saving more info...');
      console.log(user);  
      if(user !== undefined){
        console.log(user);  
        // update the user with additional info that was submitted  
        if(user.birthday !== undefined){
          ref.child('profileInfo').child(authData.uid).update({
            birthday: user.birthday
          });
        }

        if(user.school !== undefined){
          ref.child('profileInfo').child(authData.uid).update({
            school: user.school
          });
        }

        if(user.movies !== undefined){
          ref.child('profileInfo').child(authData.uid).update({
            movies: user.movies
          });
        }

        if(user.music !== undefined){
          ref.child('profileInfo').child(authData.uid).update({
            music: user.music
          });
        }
      }

      if(imageSrc !== undefined){
          ref.child('profileInfo').child(authData.uid).update({
            profilePic: imageSrc
          });
      }
    };

    function readImage(input) {
        if ( input.files && input.files[0] ) {
            var FR= new FileReader();
            FR.onload = function(e) {
                 $('#img').attr( 'src', e.target.result );
                 $('#base').text( e.target.result );
            };
            FR.readAsDataURL( input.files[0] );
        }
    }

    var setUserProvision = function() {
      var provisionedData = ref.child('privacySettings').child(authData.uid);
      provisionedData.update({
        provisionSettings: 1
      });
    };

    function MoreInfoController($scope, $mdDialog, $state, fileReader, userService) {
      var firebaseURL = 'https://shining-torch-23.firebaseio.com/';
      var ref = new Firebase(firebaseURL);
      var authObj = $firebaseAuth(ref);
      var authData = authObj.$getAuth();
    
      $scope.provider = authData.provider;
      $scope.user = {school: ''};
      $scope.save = function(user) {
        $mdDialog.hide();
        setUserProvision();
        saveMoreSettings(user, $scope.imageSrc);
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.import = function(provider) {
        //$mdDialog.hide()
        switch(provider){
          case 'google':
            googleImport();
            break;
          case 'twitter':
            break;
          case 'facebook':
              facebookImport();
            break;
          default:
            console("Invalid Provider!");
            break;
        }
      };

    var clientId = '824361687622-oigige156t3n418c8p14or24pqdqrdkq.apps.googleusercontent.com';
    var scopes = 'https://www.googleapis.com/auth/plus.me';
    var googleImport = function(){
      console.log('...requesting deeper google auth...');
      var apiKey = 'AIzaSyAAY3m6JlU7DVn5GdNMcilJ0jP7qW7p7PI';
      gapi.client.setApiKey(apiKey);
      gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
    };

   var facebookImport = function() {
        ref.authWithOAuthPopup('facebook', function(error, authData) {
          if (error) {
            console.log('Login Failed!', error);
          } else {

            console.log("Authenticated successfully with payload:", authData);


           Facebook.api('/me', function(response) {
              $scope.user = response;
              console.log("FirstName: " + response.first_name + 
                " LastName: " + response.last_name + 
                " Gender: " + response.gender + 
                " Birthday: " + response.birthday + 
                " SchoolName: " + response.education[1].school.name + 
                " Concentration: " + response.education[1].concentration[0].name + 
                " Year: " + response.education[1].year.name + 
                " FavoriteTeam: " + response.favorite_teams[0].name);


              if(response.birthday !== undefined){
                console.log(response.birthday);
                $scope.$apply(function() {
                  $scope.user.birthday = new Date(response.birthday);
                });
              }

              if(response.education[1].school.name !== undefined){
                console.log(response.education[1].school.name);
                $scope.$apply(function() {
                  $scope.user.school = response.education[1].school.name;
                });
              }
               

            });
          }
        }, {
            scope: "user_likes,email,user_birthday,public_profile,user_education_history,user_about_me" // permission requests
          });
      };

      var handleAuthResult = function(authResult) {
        if (authResult && !authResult.error) {
          googleInfo();
        } else {
          gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
        }
      };

      // Load the API and make an API call.  Display the results on the screen.
      function googleInfo() {
        gapi.client.load('plus', 'v1').then(function() {
          var request = gapi.client.plus.people.get({
            'userId': 'me'
          });
          request.execute(function(resp) {
            console.log('About Me: ' + resp.aboutMe); //todo: add to text when added to about html
            if(resp.organizations !== undefined){
              for (var i = resp.organizations.length - 1; i >= 0; i--) {
                if(resp.organizations[i].type == 'school'){
                  console.log('School: ' + resp.organizations[i].name);
                  $scope.$apply(function() {
                    $scope.user.school = resp.organizations[i].name;
                  });
                  break;
                }
              }
            }
            if(resp.birthday !== undefined){
              console.log(resp.birthday);
              $scope.$apply(function() {
                $scope.user.birthday = resp.birthday;
              });
            }
          }, function(reason) {
            console.log('Error: ' + reason.result.error.message);
          });
        });
      };

      $scope.uploadImage = function(image) {
        readImage(image);
        console.log('uploading image...');
      };

      $scope.getFile = function (file) {
      $scope.progress = 0;
      fileReader.readAsDataUrl(file, $scope)
                    .then(function(result) {
                        $scope.imageSrc = result;
                    });
      };
   
      $scope.$on("fileProgress", function(e, progress) {
          $scope.progress = progress.loaded / progress.total;
      });
    }

    var showAboutForm = function() {
        $mdDialog.show({
          controller: MoreInfoController,
          templateUrl: 'views/about.tmpl.html'
        })
          .then(function(input){
            //Confirmed, pass input
            console.log('confirming...');
          }, function(){
            //Cancelled, do nothing
            console.log('canceling...');
          });
    };

    return {
      getMoreUserInfo: function(provisionSettings) {
        console.log(provisionSettings);
        if (provisionSettings == '0') {
          showAboutForm();
        }
      },
      getUserProvision: function(callback) {
        var provisionedData = ref.child('privacySettings').child(authData.uid).child('provisionSettings').once('value', function (snapshot) {
          var val = snapshot.val();
          callback(val);
          return val;
        });
      },
      setUserProvision: function() {
        var provisionedData = ref.child('privacySettings').child(authData.uid);
        provisionedData.update({
          provisionSettings: 1
        });
      }
    };
  });