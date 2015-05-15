'use strict';

angular.module('projectsApp')
  .controller('PhotosCtrl',
    function ($scope, $stateParams, firebaseService, userService, $firebaseAuth, $state, $firebaseArray, $firebaseObject, $mdDialog) {
      var ref = new Firebase(firebaseService.getFirebBaseURL());
      var authObj = $firebaseAuth(ref);
      var authData = authObj.$getAuth();

      //get all parameters passed into this controller
      var param = $stateParams;
      console.log(param);
      // this profile's uid
      var profileUID = param.user;
      console.log('profile uid ' + profileUID);

      var photosRef = new Firebase('https://shining-torch-23.firebaseio.com/photos/'+ profileUID);
      $scope.photosData = $firebaseArray(photosRef);
      console.log('Photos data' + $scope.photosData);

      //timestamp
      var getTime = function() {
        var date = new Date();
        return [date.getMonth()+1,
                date.getDate(),
                date.getFullYear()].join('/')+' '+
                [date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()].join(':');
      };

      //add a photo/image
      $scope.addImage = function(imageTag, imageSrc) {
        var time = getTime();
        $scope.photosData.$add({
          postDate: time,
          timeStamp: Firebase.ServerValue.TIMESTAMP,
          imageTag: imageTag,
          imageSrc: $scope.postFile
        });
      };

      $scope.getFile = function(file, imgSrc) {

      $scope.file = file;
      var reader = new FileReader();
      reader.onload = function (e) {
          var imgID = imgSrc.getAttribute('id');
          console.log('imgID ' + imgID);
          $('#'+imgID).attr('src', e.target.result);
          $scope.imageSrc = e.target.result;
          
        };
        reader.readAsDataURL(file);
      };

      $scope.getPostFile = function(file) {
        var reader = new FileReader();
        
        reader.onload = function (e) {
          $('#post-imagepreview').attr('src', e.target.result);
          //Set post file
          $scope.postFile = e.target.result;
          $scope.imageSrc = e.target.result;
        };
        reader.readAsDataURL(file);
      };

      $scope.removeUpload = function() {
        $scope.postFile = 0;
        $scope.imgSrc = 0;
        $('#post-imagepreview').attr('src', 0);
      }
});
