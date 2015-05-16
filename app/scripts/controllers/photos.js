'use strict';

angular.module('projectsApp')
  .controller('PhotosCtrl',
    function ($scope, $stateParams, firebaseService, userService, $firebaseAuth, $state, $firebaseArray, $firebaseObject, $mdDialog) {
      var ref = new Firebase(firebaseService.getFirebBaseURL());
      var authObj = $firebaseAuth(ref);
      var authData = authObj.$getAuth();

      //get all parameters passed into this controller
      var param = $stateParams;
      // this profile's uid
      var photosUID = param.user;

      //true if current photos page belongs to the user
      $scope.photosOwner = (authData.uid === photosUID);

      var photosRef = new Firebase('https://shining-torch-23.firebaseio.com/photos/'+ photosUID + '/photos');
      var photosTotalRef = new Firebase('https://shining-torch-23.firebaseio.com/photos/'+ photosUID + '/photosTotal');
      $scope.photosData = $firebaseArray(photosRef);

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

      //add an image 
      //total photos must not be more than 25 and 10MB each
      $scope.addImage = function(imageTag, imageSrc) {
        var time = getTime();
        photosTotalRef.transaction(function(currentValue) {
          return (currentValue || 0) + 1;
        });

        $scope.photosData.$add({
          postDate: time,
          timeStamp: Firebase.ServerValue.TIMESTAMP,
          imageTag: imageTag,
          imageSrc: $scope.imageFile
        });
      };

      $scope.removeImage = function(imageID) {
        var imageDataRef = new Firebase('https://shining-torch-23.firebaseio.com/photos/'+ photosUID + '/photos/' + imageID);
        imageDataRef.remove();
        photosTotalRef.transaction(function(currentValue) {
          return currentValue - 1;
        });
      };

      $scope.expandImage = function(ev, imageSrc){
        $mdDialog.show({
          templateUrl: 'views/expand_img.tmpl.html',
          targetEvent: ev,
          controller: ExpandImageCtrl
        });
        function ExpandImageCtrl($scope, $mdDialog) {
          $scope.cancel = function() {
            $mdDialog.cancel();
          };
          $scope.imageSrc = imageSrc;
        };
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
        console.log('file array size...' + file);
        reader.onload = function (e) {
          $('#post-imagepreview').attr('src', e.target.result);
          //Set image file
          $scope.imageFile = e.target.result;
          $scope.imageSrc = e.target.result;
        };
        reader.readAsDataURL(file);
      };

      $scope.removeUpload = function() {
        $scope.imageFile = 0;
        $scope.imgSrc = 0;
        $('#post-imagepreview').attr('src', 0);
      }
});
