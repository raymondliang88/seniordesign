angular.module('projectsApp')
  .controller('ProfileCtrl', 
    function ($scope, firebaseService, userService, $firebaseAuth, $state) {
    var ref = new Firebase(firebaseService.getFirebBaseURL());
    var auth = $firebaseAuth(ref);

    $scope.authData = auth.$getAuth();
    $scope.userCurrentID = $scope.authData.uid;
    $scope.userCurrentFirstName;
    $scope.userCurrentLastName;
    $scope.postText;


    //$scope.profileID;
    $scope.posts = [];

    $scope.loadPosts = function(){  

      ref.child('posts').once('value', function (snapshot) {
        console.log('...fetching posts...');
        // profileID loop
        snapshot.forEach(function(profileFire) {
          if(profileFire.exists()){
            if(profileFire.key() === $scope.userCurrentID){
              if(profileFire.exists()){
                // postID loop
                profileFire.forEach(function(postFire){
                  if(postFire.key() !== "ignore"){
                    var post = {sender: postFire.val().senderName, senderID: postFire.val().senderID, text: postFire.val().text, postID: postFire.key(), timestamp: postFire.val().timestamp, comments: []};
                    // commentID loop
                    postFire.forEach(function(commentFire){
                    if(commentFire.val().senderName !== undefined && commentFire.val().text !== undefined){
                        var comment = {sender: commentFire.val().senderName, text: commentFire.val().text, timestamp: commentFire.val().timestamp};
                        post.comments.push(comment);
                      }
                    }) 
                    $scope.posts.push(post);
                  }
                })
              }
            }
          }
        })
      });
      // store profile information
      ref.child('profileInfo').once('value', function (snapshot){
        //console.log("PROFILEID: " + snapshot.key());
        snapshot.forEach(function(profileInfoFire){
          if(profileInfoFire.key() === $scope.userCurrentID){
            $scope.userCurrentFirstName = profileInfoFire.val().firstName;
            $scope.userCurrentLastName = profileInfoFire.val().lastName;
          }
        })
      });

    };

//    $scope.sendPost = function(postText, profileID){
    $scope.sendPost = function(postText){
      console.log("PostText: " + postText);
      ref.child('posts').once('value', function (snapshot) {
        var pathFire = ref.child(snapshot.key());
        // profileID loop
        snapshot.forEach(function(profileFire){
          if(profileFire.key() === $scope.userCurrentID){ // profileID GOES HERE!!
            pathFire = pathFire.child(profileFire.key());
            var d = new Date();
            var time = [d.getMonth()+1,
                       d.getDate(),
                       d.getFullYear()].join('/')+' '+
                      [d.getHours(),
                       d.getMinutes(),
                       d.getSeconds()].join(':');
            // push a post
            var fullName = $scope.userCurrentFirstName + " " + $scope.userCurrentLastName;
            console.log('Pushing a new post to Firebase...');
            pathFire.push({ 'senderID': $scope.userCurrentID, /* CHANGE */
                            'senderName': fullName,
                            'text': postText,
                            'timestamp': time});
            $state.reload();
          }
        })
      });
    };

   // $scope.sendComment = function(commentText, postID, profileID){
    $scope.sendComment = function(commentText, postID){
      console.log('SendComment Called!');
      console.log("THE POSTID: " + postID);
      ref.child('posts').once('value', function (snapshot) {
        var pathFire = ref.child(snapshot.key());
        // profileID loop
        snapshot.forEach(function(profileFire){
          if(profileFire.key() === $scope.userCurrentID){ // ** PROFILEID GOES HERE!!!!
            pathFire = pathFire.child(profileFire.key());
            // postID loop
            profileFire.forEach(function(postFire){
              if((postID !== undefined) && (postFire.key() !== "ignore") && postFire.key() === postID){
                console.log("PostID: " + postID);
                pathFire = pathFire.child(postFire.key());
                console.log("Pushing a new comment to firebase...");
                var d = new Date();
                var time = [d.getMonth()+1,
                           d.getDate(),
                           d.getFullYear()].join('/')+' '+
                          [d.getHours(),
                           d.getMinutes(),
                           d.getSeconds()].join(':');
                // push a comment
                var fullName = $scope.userCurrentFirstName + " " + $scope.userCurrentLastName;
                pathFire.push({ 'senderID': $scope.userCurrentID,
                                'senderName': fullName,
                                'text': commentText,
                                'timestamp': time});

                $state.reload();
              }  
            })
          }
        })
      });
    };
});
