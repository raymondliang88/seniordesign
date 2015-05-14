'use strict';

angular.module('projectsApp')
.controller('FriendRequestController',  function($scope, $http, $firebaseAuth, $firebaseArray, $firebaseObject , firebaseService, profileService, $mdDialog) {

	var ref = new Firebase(firebaseService.getFirebBaseURL())
	var authObj = $firebaseAuth(ref);
	var authData = authObj.$getAuth();

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
	        // console.log("loaded" + data);
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

  $scope.confirmFriendRequest = function(useruid, firstName, lastName, confirmValue) {
		  var senderID = useruid;
		  var receiverID = authData.uid;
		  console.log('confirming ' + senderID + ' as friend');
		  var senderName = firstName + ' ' + lastName;

		  var receiverName;
		  var ref = new Firebase('https://shining-torch-23.firebaseio.com/profileInfo/'+ receiverID);
		  var profileData = $firebaseObject(ref);
		  profileData.$loaded(
		    function(data) {
		      receiverName = data.firstName + ' ' + data.lastName;
		    },
		    function(error) {
		      console.error('Error:', error);
		    }
		  );

		  var pendingRef = new Firebase('https://shining-torch-23.firebaseio.com/pending/'+ receiverID);
		  var pendingObj = $firebaseObject(pendingRef);
		  pendingObj.$loaded()
		    .then(function(data) {
		      var senderList = {};
		      if (data.senderList !== undefined) {
		        senderList = data.senderList;
		      }

		      // update pendingTotal
		      pendingRef.child('pendingTotal').transaction(function(currentValue) {
		        return (currentValue || 0) - 1;
		      });

		      // remove sender from receiver's pending sender list
		      delete senderList[senderID];

		      // update Firebase endpoint
		      pendingRef.update({
		        senderList: senderList
		      });

		      if (confirmValue === 1) {
		        // add sender to receiever's friends list and vice versa
		        addToFriendList(receiverID, senderID, senderName);
		        addToFriendList(senderID, receiverID, receiverName);
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
          ref.child('friendTotal').transaction(function(currentValue) {
            return (currentValue || 0) - 1;
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
  var addToFriendList = function(receiverID, senderID, name) {
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
        if (friendList[senderID] === undefined) {
          ref.child('friendTotal').transaction(function(currentValue) {
            return (currentValue || 0) + 1;
          });
        }

        // add to friendList
        friendList[senderID] = name;

        // update Firebase endpoint
        ref.update({
          friendList: friendList
        });

      })
      .catch(function(error) {
        console.error('Error:', error);
      });
  };

});