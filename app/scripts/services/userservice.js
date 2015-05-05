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
      if(user !== undefined){
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
            picture: imageSrc
          });
      } else {
          // choosing default image
          imageSrc = "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg";
          ref.child('profileInfo').child(authData.uid).update({
            picture: imageSrc
          });
      }
    };

    var setUserProvision = function() {
      var provisionedData = ref.child('privacySettings').child(authData.uid);
      provisionedData.update({
        provisionSettings: 1
      });
    };

    function MoreInfoController($scope, $mdDialog, $state, fileReader, userService, $firebaseAuth, $firebaseObject) {
      var firebaseURL = 'https://shining-torch-23.firebaseio.com/';
      var ref = new Firebase(firebaseURL);
      var authObj = $firebaseAuth(ref);
      var authData = authObj.$getAuth();
    
      $scope.firstName = '';
      $scope.lastName = '';
      //get user profile Data
      var profileDataRef = new Firebase("https://shining-torch-23.firebaseio.com/profileInfo/"+ authData.uid);
      var profileData = $firebaseObject(profileDataRef);
      profileData.$loaded()
        .then(function(data) {
          console.log(data);
        //data.val.
      
      })
    .catch(function(error) {
      console.error("Error:", error);
    });

      $scope.provider = authData.provider;
      $scope.user = {school: ''};
      $scope.save = function(user) {
        $mdDialog.hide();
        setUserProvision();
        user.movies = $scope.movies;
        user.music = $scope.musics;
        saveMoreSettings(user, $scope.imageSrc);
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.movie;
      $scope.movies = [];
      $scope.music;
      $scope.musics = [];

      $scope.addMovie = function(name) {
        $scope.movies.push(name);
        $scope.movie = '';
      };

      $scope.removeMovie = function(index) {
        $scope.movies.splice(index,1);
      }

      $scope.addMusic = function(name) {
        $scope.musics.push(name);
        $scope.music = null;
      };

      $scope.removeMusic = function(index) {
        $scope.musics.splice(index,1);
      }

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

      $scope.getFile = function (file) {
        // check if file size is 5MB+
        $scope.invalidFile = false;
        $scope.invalidText = "";
        if (file.size > 5000000) {
          $scope.invalidFile = true;
          $scope.invalidText = "File size is too big!!!";
          $scope.$apply();
        } else {
        fileReader.readAsDataUrl(file, $scope)
                      .then(function(result) {
                          $scope.imageSrc = result;
                      });
        }
      };
    }

    var showAboutForm = function() {
        $mdDialog.show({
          controller: MoreInfoController,
          //templateUrl: 'views/about.tmpl.html'
          templateUrl: 'views/provision.tmpl.html'
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
        console.log("provisionSettings: " + provisionSettings);
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
