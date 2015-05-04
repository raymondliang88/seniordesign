'use strict';

/**
 * @ngdoc function
 * @name projectsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the projectsApp
**/
angular.module('projectsApp')
.controller('UsersController',  function($scope, $http, $firebaseAuth, $firebaseArray, $firebaseObject , firebaseService, profileService, $mdDialog) {
  var ref = new Firebase(firebaseService.getFirebBaseURL());
  var authObj = $firebaseAuth(ref);
  var authData = authObj.$getAuth();
  console.log('Logged in as:', authData.uid);

  var ref = new Firebase('https://shining-torch-23.firebaseio.com/friends/'+ authData.uid + '/friendList');
  $scope.messages = $firebaseArray(ref);

  var list = $firebaseArray(ref);
  $scope.friendProfile = [];
  //gets list of all current users friends
  var friendsRef = new Firebase('https://shining-torch-23.firebaseio.com/friends/'+ authData.uid +'/friendList');
  $scope.messages = $firebaseArray(friendsRef);

  //for each person in the friends array, loop through the array to get user profile
  var list = $firebaseArray(friendsRef);
  var friendProfileArr = [];
  list.$loaded(
  function(x) {
    //loops through and gets profile data, adds to friendprofile array
    //friend profile array contains array of userprofileData objects
    x.forEach(function(entry) {
      getUserProfileInfo(entry.$id);
    });
    // $scope.friendProfiles = friendProfile;
    }, function(error) {
  });

  //gets user profile info
  var getUserProfileInfo = function(userid) {
    console.log('Userid' + userid);
    var ref = new Firebase('https://shining-torch-23.firebaseio.com/profileInfo/'+ userid);
    var profileData = $firebaseObject(ref);
    profileData.$loaded(
      function(data) {
        friendProfileArr.push(data);
      },
      function(error) {
        console.error('Error:', error);
      }
    );
    $scope.friendProfiles = friendProfileArr;
  }

  var friendRequestRef = new Firebase('https://shining-torch-23.firebaseio.com/pending/'+ authData.uid + '/senderList');
  var pendingFriendList = $firebaseArray(friendRequestRef);
  var pendingFriendProfile = [];

  pendingFriendList.$loaded(
  function(x) {
    x.forEach(function(entry) {
      var pendingRef = new Firebase('https://shining-torch-23.firebaseio.com/profileInfo/'+ entry.$id);
      var friendRequests = $firebaseObject(pendingRef);
      friendRequests.$loaded(
        function(data) {
          pendingFriendProfile.push(data);
        },
        function(error) {
          console.error('Error:', error);
        }
      );
    });
    $scope.friendRequests = pendingFriendProfile;
    }, function(error) {
    console.error('Error:', error);
  });

  $scope.addFriend = function(useruid) {
    var userID = useruid;
    console.log('adding ' + userID + ' as friend');

    /*
     *$scope.messages.$add({
     *  uid: userID
     *});
     */

    // add to pending list of requested friend only if the sender's uid isn't there
    var pendingRef = new Firebase('https://shining-torch-23.firebaseio.com/pending/'+ userID);
    var pendingObj = $firebaseObject(pendingRef);
    var senderID = authData.uid;

    pendingObj.$loaded()
      .then(function(data) {
        console.log(data === pendingObj); //true

        var senderList = {};
        if (data.senderList !== undefined) {
          senderList = data.senderList;
        }

        // TODO retrieve sender's full name
        //var name = getUserFullName(senderID);
        //console.log(name);

        // TODO check if sender and receiver are friends
        // update pendingTotal
        if (senderList[senderID] == undefined) {
          pendingRef.child('pendingTotal').transaction(function(current_value) {
            return (current_value || 0) + 1;
          });

          // add to senderList
          senderList[senderID] = 'User\'s full name';

          // update Firebase endpoint
          pendingRef.update({
            senderList: senderList
          });
        }

      })
      .catch(function(error) {
        console.error('Error:', error);
      });
  };

  $scope.removeFriend = function(useruid) {
    var senderID = authData.uid;
    console.log('confirming ' + deletedID + ' as friend');

  };

  /**
   * Confirms or rejects the friend request and removes the senderID from the receiverID's senderList
   * @param {string} useruid The user's uid that is pending confirmation.
   * @param {number} confirmValue Confirmation is 1 and rejection is 0.
   */
  $scope.confirmFriendRequest = function(useruid, confirmValue) {
    var senderID = useruid;
    console.log('confirming ' + senderID + ' as friend');

    var receiverID = authData.uid;
    var pendingRef = new Firebase('https://shining-torch-23.firebaseio.com/pending/'+ receiverID);
    var pendingObj = $firebaseObject(pendingRef);

    pendingObj.$loaded()
      .then(function(data) {
        var senderList = {};
        if (data.senderList !== undefined) {
          senderList = data.senderList;
        }

        // update pendingTotal
        pendingRef.child('pendingTotal').transaction(function(current_value) {
          return (current_value || 0) - 1;
        });

        // remove sender from receiver's pending sender list
        delete senderList[senderID];

        // update Firebase endpoint
        pendingRef.update({
          senderList: senderList
        });

        if (confirmValue == '1') {
          // add sender to receiever's friends list and vice versa
          addToFriendList(receiverID, senderID);
          addToFriendList(senderID, receiverID);
        }

      })
      .catch(function(error) {
        console.error('Error:', error);
      });
  };

  /**
   * Removes friendID from userID Friend List
   * @param {string} friendID The uid of the removed friend.
   * @param {string} userID The uid of the user performing the friend removal.
   */
  var removeFromFriendList = function(userID, friendID) {
    var ref = new Firebase('https://shining-torch-23.firebaseio.com/friends/' + userID);
    var obj = $firebaseObject(ref);
    obj.$loaded()
      .then(function(data) {
        console.log(data === obj); //true
        var friendList = {};
        if (data.friendList !== undefined) {
          friendList = data.friendList;
        }
        // update friendTotal
        if (friendList[friendID] !== undefined) {
          ref.child('friendTotal').transaction(function(current_value) {
            return (current_value || 0) - 1;
          });
        }
        // remove from friendList
        delete friendList[friendID];
        console.log('new friends list', friendList);
        // update Firebase endpoint
        ref.update({
          friendList: friendList
        });
      })
      .catch(function(error) {
        console.error('Error:', error);
      });
  };

  /**
   * Adds receiverID to senderID Friend List
   * @param {string} receiverID The uid of the added friend.
   * @param {string} senderID The uid of the user performing the friend adding.
   */
  var addToFriendList = function(receiverID, senderID) {
    var ref = new Firebase('https://shining-torch-23.firebaseio.com/friends/' + receiverID);
    var obj = $firebaseObject(ref);
    obj.$loaded()
      .then(function(data) {
        console.log(data === obj); //true

        var friendList = {};
        if (data.friendList !== undefined) {
          friendList = data.friendList;
        }

        // update pendingTotal
        if (friendList[senderID] == undefined) {
          ref.child('friendTotal').transaction(function(current_value) {
            return (current_value || 0) + 1;
          });
        }

        // add to friendList
        friendList[senderID] = 'User\'s full name';

        // update Firebase endpoint
        ref.update({
          friendList: friendList
        });

      })
      .catch(function(error) {
        console.error('Error:', error);
      });
  };

  var getUserFullName = function(userid) {
    var ref = new Firebase('https://shining-torch-23.firebaseio.com/profileInfo/'+ userid);
    var profileData = $firebaseObject(ref);
    profileData.$loaded(
      function(data) {
        return data.firstName + ' ' + data.lastName;
      },
      function(error) {
        console.error('Error:', error);
      }
    );
  };

  var getPendingUserProfileInfo = function(userid){
    var userID = userid;
    var ref = new Firebase('https://shining-torch-23.firebaseio.com/profileInfo/'+ userID);
    var profileData = $firebaseObject(ref);
    profileData.$loaded(
      function(data) {
        console.log(data.name); // true
        pendingFriendProfile.push(data);
      },
      function(error) {
        console.error('Error:', error);
      }
    );
    $scope.friendRequests = pendingFriendProfile;
  };

  var getUserProfileInfo = function(userid){
    var userID = userid;
    //console.log('entered');
    var ref = new Firebase('https://shining-torch-23.firebaseio.com/profileInfo/'+ userID);
    var profileData = $firebaseObject(ref);
    profileData.$loaded().then(function(data) {
        $scope.friendProfile.push(data);
      },
      function(error) {
        console.error('Error:', error);
      }
    );
    $scope.friendProfiles = $scope.friendProfile;
  };

  $scope.removeFriendConfirm = function(friend, ev){
    console.log('remove friend id: ', friend.$id);
    var confirm = $mdDialog.confirm()
      //.parent(angular.element(document.body))
      .title('Would you like to delete '+ friend.firstName + '?')
      .content('')
      .ariaLabel('Friend Remove Confirm')
      .ok('Yes, I hate ' + friend.firstName)
      .cancel('No!')
      .targetEvent(ev);
      $mdDialog.show(confirm).then(function(){
        //Accept friend remove
        removeFromFriendList(authData.uid, friend.$id);
        removeFromFriendList(friend.$id, authData.uid);

      }, function(){
        //Cancel friend remove
      });
  };

  var profileRef = new Firebase('https://shining-torch-23.firebaseio.com/profileInfo/');
  $scope.allProfiles = $firebaseArray(profileRef);

  $scope.currentPage = 1;
  $scope.pageSize = 5;

  $scope.pageChangeHandler = function(num) {
      console.log('meals page changed to ' + num);
  };

   $scope.pageChangeHandler = function(num) {
    console.log('going to page ' + num);
  };
})

angular.module('projectsApp')
.controller('OtherController', function($scope, $http) {
  $scope.pageChangeHandler = function(num) {
    console.log('going to page ' + num);
  };
});
