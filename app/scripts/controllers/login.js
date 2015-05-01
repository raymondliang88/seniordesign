'use strict';

/**
 * @ngdoc function
 * @name projectsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the projectsApp


Use controllers to:

1. Set up the initial state of the $scope object.
2. Add behavior to the $scope object.

Do not use controllers to:
1. Manipulate DOM — Controllers should contain only business logic. Putting any presentation logic into Controllers significantly affects its testability. Angular has databinding for most cases and directives to encapsulate manual DOM manipulation.
2. Format input — Use angular form controls instead.
3. Filter output — Use angular filters instead.
4. Share code or state across controllers — Use angular services instead.
5. Manage the life-cycle of other components (for example, to create service instances).

**/
angular.module('projectsApp')
  .controller('LoginCtrl', function ($scope, $location, $state, $firebaseAuth, firebaseService, $mdDialog, alertService, userService, Facebook) {
    var ref = new Firebase(firebaseService.getFirebBaseURL());
    var auth = $firebaseAuth(ref);

    var createFireAcc = function(userData, user) {
      ref.child('profileInfo').child(userData.uid).set({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          loggedIn: false
      });

      ref.child('privacySettings').child(userData.uid).set({
          provisionSettings: 0,
          messagePrivacy: 'everyone',
          postPrivacy: 'everyone',
      });
      
      ref.child('friends').child(userData.uid).set({
          friendTotal: 0
      });

      ref.child('pending').child(userData.uid).set({
          pendingTotal: 0
      });
    };

    var goToDashboard = function(userData){
      ref.child('profileInfo').child(userData.uid).update({
        loggedIn: true
      });
      $state.go('home.dashboard');
    };
    
    //registers users on firebase
    $scope.createUser = function(user, form) {
      //Valid form fields
      if(form.$valid)
      {
        console.log('register user on firebase');
        auth.$createUser({
          email: user.email,
          password: user.password
        }).then(function (userData) {
          //stores other registration information at user endpoint
          var title= 'Welcome';
          var msg = 'The new user account has been successfully created.';
          alertService.show(title,msg,'');
          // set up firebase endpoints to match account creation
          createFireAcc(userData, user);
          //logged in state
          goToDashboard(userData);
        }).catch(function (error) {
          if(error.code == 'EMAIL_TAKEN')
          {
            var title= 'Error Creating Account';
            var msg = 'The new user account cannot be created because the email is already in use.';
            alertService.show(title,msg,'');
          }
        });
      }
    };

    $scope.login = function(user, form, ev) {
        if(!form.$valid) {
            return;
        }
        auth.$authWithPassword({
            email: user.email,
            password: user.password
        }).then(function (authData) {
          console.log('Logged in as:' + authData.uid);
          //todo: logged in state
          $state.go('home.dashboard');
        }).catch(function (error) {
          var msg = 'Invalid E-mail or password. Please try again';
          alertService.show(msg,ev);
        });
    };

    $scope.registerFB = function() {
      ref.authWithOAuthPopup('facebook', function(error, authData) {
        if (error) {
          console.log('Login Failed!', error);
        } 
        else {
          console.log("Authenticated successfully with payload:", authData);
          userService.setCurrentUser(authData);
          ref.child('profileInfo').child(authData.uid).once('value', function (snapshot){

            if(snapshot.val() === null){
              // creating firebase endpoint
              ref.child('profileInfo').child(authData.uid).set({
                  email: authData.facebook.cachedUserProfile.email,
                  firstName: authData.facebook.cachedUserProfile.first_name,
                  lastName: authData.facebook.cachedUserProfile.last_name,
                  picture: authData.facebook.cachedUserProfile.picture.data.url
              });
              ref.child('privacySettings').child(authData.uid).set({
                  provisionSettings: 0,
                  messagePrivacy: 'everyone',
                  postPrivacy: 'everyone'
              });
              ref.child('friends').child(authData.uid).set({
                  friendTotal: 0
              });
              ref.child('pending').child(authData.uid).set({
                  pendingTotal: 0
              });
              goToDashboard(authData);
            }
            else{
              goToDashboard(authData);
            }
          });
        }
    }, {
          scope: "user_likes, email, user_birthday, public_profile, user_education_history, user_about_me" // permission requests
    });
  };

    $scope.registerGoogle = function() {
      ref.authWithOAuthPopup('google', function(error, authData) {
        if (error) {
          console.log('Login Failed!', error);
        } 
        else {
          console.log('Authenticated successfully with payload:', authData);
          
          ref.child('profileInfo').child(authData.uid).once('value', function (snapshot){

            if(snapshot.val() === null){
              console.log('making new user profile');
              //If account doesn't exist set new data
              ref.child('profileInfo').child(authData.uid).set({
                  email: authData.google.email,
                  firstName: authData.google.cachedUserProfile.given_name,
                  lastName: authData.google.cachedUserProfile.family_name,
                  picture: authData.google.cachedUserProfile.picture
              });
              ref.child('privacySettings').child(authData.uid).set({
                  provisionSettings: 0,
                  messagePrivacy: 'everyone',
                  postPrivacy: 'everyone',
              });
              ref.child('friends').child(authData.uid).set({
                  friendTotal: 0
              });
              ref.child('pending').child(authData.uid).set({
                  pendingTotal: 0
              });
              console.log('...moving to dashboard...');
              goToDashboard(authData);
            }
            else{
              console.log('...moving to dashboard...');
              goToDashboard(authData);
            }
          });
      }
      },{
        scope: "email, profile" // permission requests
      });
    };
      

    $scope.registerTwitter = function() {
      ref.authWithOAuthPopup("twitter", function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } 
        else {
          console.log("Authenticated successfully with payload:", authData);
          ref.child('profileInfo').child(authData.uid).once('value', function (snapshot){
            if(snapshot.val() === null){
                  var name = authData.twitter.cachedUserProfile.name; name = name.split(" ");
                  var firstName = name[0];
                  var lastName = name[name.length-1];
                  var aboutMe = authData.twitter.cachedUserProfile.description;
                  var twitterEmail = authData.twitter.cachedUserProfile.screen_name + "@ucrpal.com";
                  var profileImage = authData.twitter.cachedUserProfile.profile_image_url;

                  ref.child('profileInfo').child(authData.uid).set({
                      email:  twitterEmail,
                      firstName: firstName,
                      lastName: lastName,
                      picture: profileImage
                  });
                  ref.child('privacySettings').child(authData.uid).set({
                      provisionSettings: 0,
                      messagePrivacy: 'everyone',
                      postPrivacy: 'everyone'
                  });
                  ref.child('friends').child(authData.uid).set({
                      friendTotal: 0
                  });
                  ref.child('pending').child(authData.uid).set({
                      pendingTotal: 0
                  });
                  goToDashboard(authData);
            } 
            else{
                  goToDashboard(authData);
            }
          });
        }
    });
  };
});
