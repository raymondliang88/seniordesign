'use strict';

/**
 * @ngdoc service
 * @name projectsApp.myService
 * @description
 * # myService
 * Service in the projectsApp.
 */
// AngularJS will instantiate a singleton by calling "new" on this function
angular.module('projectsApp')
  .service('chatService', function () {
    // holds who the current user is talking to
    var currentChatList = [];

    // add
    var addFriendChat = function(friendUID) {
        //check if friendUID is inside array before push
        if ($.inArray( friendUID, currentChatList) === -1){
          currentChatList.push(friendUID);
          // console.log("pushed");
        }
        else{
          // console.log("already inside array at position");
        }
    };

    var getFriendInfo = function(positionID) {
      // console.log("received" + positionID);
      return currentChatList[positionID];
    };

    var getFriendChat = function(){
        return currentChatList;
    };

    return {
      addFriendChat: addFriendChat,
      getFriendChat: getFriendChat,
      getFriendInfo: getFriendInfo
    };




});
