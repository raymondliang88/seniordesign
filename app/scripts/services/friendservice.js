'use strict';
//this factory returns information about a user's friends
angular.module('projectsApp')
  .factory('profileService', function ($firebaseArray) {
    var ref = new Firebase('https://shining-torch-23.firebaseio.com/profileInfo');
    return {
      getUserProfileInfo: function(userUID) {
        var userFriendRef = ref.child(userUID);
        console.log(userFriendRef);
        return $firebaseArray(userFriendRef);//userFriendRef);
      }
    };
  });
