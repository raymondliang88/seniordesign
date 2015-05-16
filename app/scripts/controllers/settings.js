'use strict';

/**
 * @ngdoc function
 * @name projectsApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the projectsApp
 */
angular.module('projectsApp')
  .controller('SettingsCtrl',
    function ($scope, $mdDialog, firebaseService, userService, $firebaseAuth, alertService) {
      var ref = new Firebase(firebaseService.getFirebBaseURL());
      var authObj = $firebaseAuth(ref);
      var authData = authObj.$getAuth();
      
      $scope.userCurrent;
      $scope.user;
      $scope.alert = '';
      $scope.movie;
      $scope.movies = [];
      $scope.music;
      $scope.musics = [];
      $scope.savedStatus = '';
      $scope.imageSrc;

      ref.child('profileInfo').child(authData.uid).once('value', function (snapshot) {
          var val = snapshot.val();
          console.log(val);
          val.uid = authData.uid;
          userService.setCurrentUser(val);
          $scope.userCurrent = userService.getCurrentUser();
          $scope.$apply(function() {
            $scope.userCurrent.firstName = val.firstName;
            $scope.userCurrent.lastName  = val.lastName;
            $scope.userCurrent.email  = val.email;
            $scope.movies = val.movies;
            $scope.musics = val.music;
        });
      });

      $scope.addMovie = function(name) {
        $scope.movies.push(name);
        ref.child('profileInfo').child($scope.userCurrent.uid).update({
            movies: $scope.movies
          });
        $scope.movie = '';
      };

      $scope.removeMovie = function(index) {
        $scope.movies.splice(index,1);
        ref.child('profileInfo').child($scope.userCurrent.uid).update({
            movies: $scope.movies
          });
      };

      $scope.addMusic = function(name) {
        $scope.musics.push(name);
        ref.child('profileInfo').child($scope.userCurrent.uid).update({
            music: $scope.musics
          });
        $scope.music = null;
      };

      $scope.removeMusic = function(index) {
        $scope.musics.splice(index,1);
        ref.child('profileInfo').child($scope.userCurrent.uid).update({
            music: $scope.musics
          });
      };


      if (authData) {
        console.log('Logged in as:' + authData.uid);
      } else {
      console.log('Logged out');
      }


    function DialogController($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.enter = function(input) {
        $mdDialog.hide(input);
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
    }

    $scope.emailConfirm = function(userMail, oldMail) {
      // Appending dialog to document.body to cover sidenav in docs app
      $mdDialog.show({
        controller: DialogController,
        templateUrl: '../views/dialog_passwd.tmp.html',
      })
        .then(function(input){
          //Confirmed, pass input
          $scope.emailChange(input, userMail, oldMail);
        }, function(){
          //Cancelled, do nothing
        });
    };

    $scope.saveSettings = function(user){
      if(user !== undefined ){
        console.log('Attempting to save settings...');
        //Email changes require authorization from old email
        if(user.firstName !== undefined){
          ref.child('profileInfo').child($scope.userCurrent.uid).update({
            firstName: user.firstName
          });
          $scope.userCurrent.firstName = user.firstName;
        }
        if(user.lastName !== undefined){
          ref.child('profileInfo').child($scope.userCurrent.uid).update({
            lastName: user.lastName
          });
          $scope.userCurrent.lastName = user.lastName;
        }
        if(user.email !== undefined){
          $scope.emailConfirm(user.email, $scope.userCurrent.email);
        }
        if(user.birthday !== undefined){
          ref.child('profileInfo').child($scope.userCurrent.uid).update({
            birthday: user.birthday
          });
          $scope.userCurrent.birthday = user.birthday;
        }
        if(user.language !== undefined){
          ref.child('profileInfo').child($scope.userCurrent.uid).update({
            language: user.language
          }); 
          $scope.userCurrent.language = user.language;
        }
        if(user.country !== undefined){
          ref.child('profileInfo').child($scope.userCurrent.uid).update({
            country: user.country
          });
          $scope.userCurrent.country = user.country;
        }
        if(user.gender !== undefined){
          ref.child('profileInfo').child($scope.userCurrent.uid).update({
            gender: user.gender
          });
          $scope.userCurrent.gender = user.gender;
        }
        if(user.work !== undefined){
          ref.child('profileInfo').child($scope.userCurrent.uid).update({
            work: user.work
          });
          $scope.userCurrent.work = user.work;
        }
        if(user.school !== undefined){
          ref.child('profileInfo').child($scope.userCurrent.uid).update({
            school: user.school
          });
          $scope.userCurrent.school = user.school;
        }
        if(user.aboutMe !== undefined){
          ref.child('profileInfo').child($scope.userCurrent.uid).update({
            aboutMe: user.aboutMe
          });
          $scope.userCurrent.aboutMe = user.aboutMe;
        }
        $scope.savedStatus = 'Saved!';
      }
    };

    $scope.postSettings = function (selection) {
      console.log('Setting post privacy: ' + selection);
      ref.child('privacySettings').child($scope.userCurrent.uid).update({
        postPrivacy: selection
      });
      $scope.userCurrent.postPrivacy = selection;
    };

    $scope.messageSettings = function (selection) {
      console.log('Setting message privacy: ' + selection);
      ref.child('privacySettings').child($scope.userCurrent.uid).update({
        messagePrivacy: selection
      });
      $scope.userCurrent.messagePrivacy = selection;
    };

    $scope.getPostFile = function(file) {
      var reader = new FileReader();
      console.log(file);
      reader.onload = function (e) {
        $('#post-imagepreview').attr('src', e.target.result);
        $scope.imageSrc = e.target.result;
        $scope.addImagePost();
      };
      reader.readAsDataURL(file); 
    };

    //add an image post
      $scope.addImagePost = function() {
        ref.child('profileInfo').child($scope.userCurrent.uid).update({
          picture: $scope.imageSrc
        });
        $scope.userCurrent.picture = $scope.imageSrc;
      };

    $scope.emailChange = function(passwd, userMail, oldMail){
        ref.changeEmail({
            oldEmail: oldMail,
            newEmail: userMail,
            password: passwd,
          }, function(error){
            console.log(error ? 'Failed to change email. ' + error : 'Email changed!');
            if(error){
              $scope.alert = 'Failed to change email.';
            }
            else{
              $scope.alert = 'Email changed!';
              ref.child('profileInfo').child($scope.userCurrent.uid).update({
                email: userMail
              });
              $scope.userCurrent.email = userMail;
            }
        });
    };


    $scope.showDeleteAccountConfirmation = function(password) {

      alertService.removeAccount($scope, $scope.userCurrent.email, password, authData.uid);

    }

    $scope.updatePassword = function(passwordOld, passwordNew) {

      var reffire = new Firebase("https://shining-torch-23.firebaseio.com/");
      ref.changePassword({
        email: $scope.userCurrent.email,
        oldPassword: passwordOld,
        newPassword: passwordNew
      }, function(error) {
        if (error) {
          switch (error.code) {
            case "INVALID_PASSWORD":
              console.log("The specified user account password is incorrect.");
              alert("The specified user account password is incorrect.");
              break;
            case "INVALID_USER":
              console.log("The specified user account does not exist.");
              alert("The specified user account does not exist.");
              break;
            default:
              console.log("Error changing password:", error);
              alert("Error changing password");
          }
        } else {
          console.log("User password changed successfully!");
          alert("User password changed successfully!");
        }
      });

    }

});
