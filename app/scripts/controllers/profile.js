'use strict';

angular.module('projectsApp')
  .controller('ProfileCtrl',
    function ($scope, $stateParams, firebaseService, userService, $firebaseAuth, $state, $firebaseArray, $firebaseObject) {
      var ref = new Firebase(firebaseService.getFirebBaseURL());
      var authObj = $firebaseAuth(ref);
      var authData = authObj.$getAuth();
      console.log("Logged in as:" +  authData.uid);

      //get all parameters passed into this controller
      var param = $stateParams;
      // this profile's uid
      var profileUID = param.user;

      //get user profile Data
      var profileDataRef = new Firebase("https://shining-torch-23.firebaseio.com/profileInfo/"+ profileUID);
      $scope.profileData = $firebaseObject(profileDataRef);

      //postData returns a list of post
      var profilePostRef = new Firebase("https://shining-torch-23.firebaseio.com/posts/"+ profileUID);
      $scope.postData = $firebaseArray(profilePostRef);
      console.log("Post data" + $scope.postData);

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
      }

          $scope.commonFriends = [];


    //Find number of friends in common
    var profileFriends = new Firebase("https://shining-torch-23.firebaseio.com/friends/"+ param.user);
    var profileObj = $firebaseObject(profileFriends);
    profileObj.$loaded()
    .then(function(data) {
      var profileList = {};
      if (data.friendList !== undefined) {
          profileList = data.friendList;
      }
      var userFriends = new Firebase("https://shining-torch-23.firebaseio.com/friends/"+ authData.uid);
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
            var profileInfo = new Firebase("https://shining-torch-23.firebaseio.com/profileInfo/"+ id);
            var info = $firebaseObject(profileInfo);
            info.$loaded()
            .then(function(data) {
              $scope.commonFriends.push(data.firstName + ' ' + data.lastName);
            });
          }
        }
      });
    })
    .catch(function(error) {
      console.error("Error:", error);
    });


      //add a new post
      $scope.addTextPost = function(message) {
        var time = getTime();
        $scope.postData.$add({
          senderID: authData.uid,
          messageType: "text",
          postDate: time,
          timeStamp: Firebase.ServerValue.TIMESTAMP,
          message: message
        });
      };

      //remove post
      $scope.removePost = function(postID){
      ref.child('posts').once('value', function (snapshot) {
        var pathFire = ref.child(snapshot.key());
        // profileID loop
        snapshot.forEach(function(profileFire){

          if(profileFire.key() === $scope.userCurrentID){ 
            pathFire = pathFire.child(profileFire.key());
            // postID loop
            profileFire.forEach(function(postFire){
              if((postID !== undefined) && (postFire.key() !== "ignore") && postFire.key() === postID){
                pathFire = pathFire.child(postFire.key());
                console.log('...Removing...: ' + pathFire);
                pathFire.remove();
                $state.reload();
              }  
            })
          }
        })
      });
    };
      /*$scope.removePost = function(postID) {
        var time = getTime();
        console.log("removing item" + postID);
        var item = $scope.postData[1];
        $scope.postData.$remove(item).then(function (ref) {
          console.log(ref.key);
        });
      };*/
      $scope.removeComment = function(postID, commentID){
      console.log('...removing comment...');
      ref.child('posts').once('value', function (snapshot) {
        var pathFire = ref.child(snapshot.key());
        // profileID loop
        snapshot.forEach(function(profileFire){
          if(profileFire.key() === $scope.userCurrentID){ 
            pathFire = pathFire.child(profileFire.key());
            // postID loop
            profileFire.forEach(function(postFire){
              if((postID !== undefined) && (postFire.key() !== "ignore") && postFire.key() === postID){
                pathFire = pathFire.child(postFire.key());
                // commentID loop
                postFire.forEach(function(commentFire){
                  if((commentID !== undefined) && (commentFire.key() !== "ignore") && commentFire.key() === commentID){
                    console.log('postID: ' + postID + ' commentID: ' + commentID);
                    pathFire = pathFire.child(commentFire.key());
                    console.log('path: ' + pathFire);
                    pathFire.remove();
                    $state.reload();
                  }
                })
              }  
            })
          }
        })
      });
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

    }


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

    }

      //add an image post
      $scope.addImagePost = function(message, imageSrc) {
        var time = getTime();
        $scope.postData.$add({
          senderID: authData.uid,
          messageType: "image",
          postDate: time,
          timeStamp: Firebase.ServerValue.TIMESTAMP,
          message: message,
          imageSrc: $scope.postFile
        });
      };


      //Add a comment to a post, pass in postID
      $scope.addComment = function(postID, message) {
        var time = getTime();
        console.log('gonna post a comment');
        var profilePostRef = new Firebase("https://shining-torch-23.firebaseio.com/posts/"+ profileUID + "/" +  postID + "/comments/");
        $scope.postComment = $firebaseArray(profilePostRef);
        $scope.postComment.$add({
          senderID: authData.uid,
          messageType: "text",
          postDate: time,
          timeStamp: Firebase.ServerValue.TIMESTAMP,
          message: message
        });
      }

      //true if current profile belongs to the user
      $scope.profileOwner = (authData.uid === profileUID);

      // $scope.profileOwner = function() {
      //   console.log("Authdata" + authData.uid);
      //   console.log("Profile uid" + profileUID);

      //   return authData.uid === profileUID;
      // };
      $scope.getFile = function(file, imgSrc) {   
          
      $scope.file = file;   
      var reader = new FileReader();    
      reader.onload = function (e) {    
        var imgID = imgSrc.getAttribute('id');    
        $('#'+imgID).attr('src', e.target.result);    
        $scope.imageSrc = e.target.result;    
        console.log($scope.imageSrc);   
      }   
      reader.readAsDataURL(file);   
    }   

    $scope.getPostFile = function(file) {   
      console.log('getting file');
      var reader = new FileReader();    
      console.log(file);    
      reader.onload = function (e) {    
        $('#post-imagepreview').attr('src', e.target.result);   
        //Set post file   
        $scope.postFile = e.target.result;    
        $scope.imageSrc = e.target.result;    
      }   
      reader.readAsDataURL(file);  
    }   

    $scope.removeUpload = function() {    
      $scope.postFile = 0;    
      $scope.imgSrc = 0;    
      $('#post-imagepreview').attr('src', 0);   
    }
});
