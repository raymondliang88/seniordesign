'use strict';

angular.module('projectsApp')
  .controller('ProfileCtrl',
    function ($scope, $stateParams, firebaseService, userService, $firebaseAuth, $state, $firebaseArray, $firebaseObject, $mdDialog) {
      var ref = new Firebase(firebaseService.getFirebBaseURL());
      var authObj = $firebaseAuth(ref);
      var authData = authObj.$getAuth();

      var myselfDataRef = new Firebase('https://shining-torch-23.firebaseio.com/profileInfo/'+ authData.uid);
      $scope.myselfData = $firebaseObject(myselfDataRef);
      //get all parameters passed into this controller
      var param = $stateParams;
      // this profile's uid
      var profileUID = param.user;

      //get user profile Data
      var profileDataRef = new Firebase('https://shining-torch-23.firebaseio.com/profileInfo/'+ profileUID);

      $scope.profileData = $firebaseObject(profileDataRef);
      //console.log($scope.profileData);

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

      var photosRef = new Firebase('https://shining-torch-23.firebaseio.com/photos/'+ profileUID + '/photos');
      var photosTotalRef = new Firebase('https://shining-torch-23.firebaseio.com/photos/'+ profileUID + '/photosTotal');

      $scope.photos = $firebaseArray(photosRef);
      var photosData = $firebaseObject(photosTotalRef);
      photosData.$loaded()
        .then(function(data) {
          $scope.photosTotal = data.$value;
        });
     
      $scope.commonFriends = [];


      //Check if I already friend with this profile
      $scope.isMyFriend = false;
      var friendDataRef = new Firebase('https://shining-torch-23.firebaseio.com/friends/'+authData.uid+'/friendList/'+param.user);
      var friendObject = $firebaseObject(friendDataRef);
      friendObject.$loaded().then(function(data) {
        $scope.isMyFriend = data.$value === null ? false: true;
      });

      // Check if PROFILE is pirvate
      $scope.isProfilePrivate = false;
      var proPrivacyRef = new Firebase('https://shining-torch-23.firebaseio.com/privacySettings/'+ param.user + '/profilePrivacy/');
      var proPrivacyObj = $firebaseObject(proPrivacyRef);
      proPrivacyObj.$loaded().then(function(data){
        if(param.user === authData.uid || (data.privacy === 'public' && ((data.viewers === 'friends' && $scope.isMyFriend) || data.viewers === 'everyone'))){
          // public
          $scope.isProfilePrivate = false;
        }
        else{
          // private
          $scope.isProfilePrivate = true;
          proPrivacyRef = new Firebase('https://shining-torch-23.firebaseio.com/privacySettings/'+ param.user + '/profilePrivacy/custom/' + authData.uid + '/setting');
          proPrivacyObj = $firebaseObject(proPrivacyRef);
          proPrivacyObj.$loaded().then(function(data){
            if(data.$value === 'public'  || param.user === authData.uid){
              // public because custom setting
              $scope.isProfilePrivate = false;
            }
          });
        }
      });

      // Check if PICTURES are private
      $scope.isPicCustom = false;
      $scope.isPicturePrivate = false;
      var picPrivacyRef = new Firebase('https://shining-torch-23.firebaseio.com/privacySettings/'+ param.user + '/picturePrivacy/');
      var picPrivacyObj = $firebaseObject(picPrivacyRef);
      picPrivacyObj.$loaded().then(function(data){
        if(param.user === authData.uid || (data.privacy === 'public' && ((data.viewers === 'friends' && $scope.isMyFriend) || data.viewers === 'everyone'))){
          // public
          $scope.isPicturePrivate = false;
        }
        else{
          // private
          $scope.isPicturePrivate = true;
          picPrivacyRef = new Firebase('https://shining-torch-23.firebaseio.com/privacySettings/'+ param.user + '/picturePrivacy/custom/' + authData.uid + '/setting');
          picPrivacyObj = $firebaseObject(picPrivacyRef);
          picPrivacyObj.$loaded().then(function(data){
            if(data.$value === 'public'){
              // public because custom setting
              $scope.isPicturePrivate = false;
            }
          });

        }

      });

      async.parallel([
          function(callback){
              //postData returns a list of post
              var profilePostRef = new Firebase('https://shining-torch-23.firebaseio.com/posts/'+ profileUID);
              $scope.postData = $firebaseArray(profilePostRef); // REMOVE POSTS WHEN PRIVATE
              console.log('Post data' + $scope.postData);

          },
          function(callback){


            //Find number of friends in common
              var profileFriends = new Firebase('https://shining-torch-23.firebaseio.com/friends/'+ param.user);
              var profileObj = $firebaseObject(profileFriends);
              profileObj.$loaded()
              .then(function(data) {
                var profileList = {};
                if (data.friendList !== undefined) {
                    profileList = data.friendList;
                }
                var userFriends = new Firebase('https://shining-torch-23.firebaseio.com/friends/'+ authData.uid);
                var userObj = $firebaseObject(userFriends);
                userObj.$loaded()
                .then(function(data) {
                  var userList = {};
                  if(data.friendList !== undefined){
                    userList = data.friendList;
                  }

                  for(var id in userList){
                    if(profileList[id] !== undefined){
                      //ID Found
                      //$scope.commonFriends.push(id);
                      //console.log(id);
                      var profileInfo = new Firebase('https://shining-torch-23.firebaseio.com/profileInfo/'+ id);
                      var info = $firebaseObject(profileInfo);
                      info.$loaded()
                      .then(function(data) {
                        //$scope.commonFriends.push(data.firstName + ' ' + data.lastName);
                        var info = {friendID: data.$id, firstName: data.firstName, lastName: data.lastName, picture: data.picture};
                        $scope.commonFriends.push(info);
                      });
                    }
                  }
                });
              })
              .catch(function(error) {
                console.error('Error:', error);
              });

          }
      ]);


      $scope.isPrivate = function(isPrivateParam){
        if(isPrivateParam === true ){
          console.log('Returning true. isPrivateParam: ' + isPrivateParam);
          return true;
        }
        else{
          console.log('Returning false isPrivateParam: ' + isPrivateParam);
          return false;
        }
      };

      //add a new post
      $scope.addTextPost = function(message) {
        var time = getTime();
        $scope.postData.$add({
          senderID: authData.uid,
          messageType: 'text',
          postDate: time,
          timeStamp: Firebase.ServerValue.TIMESTAMP,
          senderPicture: $scope.myselfData.picture,
          message: message
        });
        document.getElementById('postForm').reset();
      };

      $scope.removePost = function(postID) {
        var postDataRef = new Firebase('https://shining-torch-23.firebaseio.com/posts/'+ profileUID + '/' + postID);
        postDataRef.remove();
      };


      $scope.removeComment = function(postID, commentID) {
        var postDataRef = new Firebase('https://shining-torch-23.firebaseio.com/posts/'+ profileUID + '/' + postID + '/comments/' + commentID);
        postDataRef.remove();
      };

    $scope.showConfirmDeleteComment = function(ev, postID, commentID){

      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .title('Delete Comment')
        .content('Are you sure?')
        .ariaLabel('Lucky day')
        .ok('Confirm Delete')
        .cancel('No')
        .targetEvent(ev);
        $mdDialog.show(confirm).then(function() {
          $scope.removeComment(postID, commentID);

      }, function() {

      });

    };


    $scope.showConfirmDeletePost = function(ev, postID){

      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .title('Delete Post')
        .content('Are you sure?')
        .ariaLabel('Lucky day')
        .ok('Confirm Delete')
        .cancel('No')
        .targetEvent(ev);
        $mdDialog.show(confirm).then(function() {
          $scope.removePost(postID);

      }, function() {
      });
    };

      //add an image post
      $scope.addImagePost = function(message, imageSrc) {
        var time = getTime();
        $scope.postData.$add({
          senderID: authData.uid,
          messageType: 'image',
          postDate: time,
          timeStamp: Firebase.ServerValue.TIMESTAMP,
          senderPicture: $scope.myselfData.picture,
          message: message,
          imageSrc: $scope.postFile
        });
      };


      //Add a comment to a post, pass in postID
      $scope.addComment = function(postID, message) {
        var time = getTime();
        console.log('gonna post a comment');
        var profilePostRef = new Firebase('https://shining-torch-23.firebaseio.com/posts/'+ profileUID + '/' +  postID + '/comments/');
        $scope.postComment = $firebaseArray(profilePostRef);
        $scope.postComment.$add({
          senderID: authData.uid,
          messageType: 'text',
          postDate: time,
          timeStamp: Firebase.ServerValue.TIMESTAMP,
          senderPicture: $scope.myselfData.picture,
          message: message
        }).then(function(ref) {
          //attaching ref if to end point
          var id = ref.key();
          ref.update({commentID: id});
        });
        document.getElementById('commentForm').reset();
      };


      //true if current profile belongs to the user
      $scope.profileOwner = (authData.uid === profileUID);

      $scope.getFile = function(file, imgSrc) {

      $scope.file = file;
      var reader = new FileReader();
      reader.onload = function (e) {
        var imgID = imgSrc.getAttribute('id');
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
    };

    $scope.showAddFriend = function(owner, isFriend) {
      if(owner || isFriend) {
        return true;
      } else {
        return false;
      }
    };
});
