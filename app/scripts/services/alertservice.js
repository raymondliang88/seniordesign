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
  .service('alertService', function ($mdDialog, firebaseService, userService, $state) {
    return {
      show: function(title,msg) {
      $mdDialog.show(
        $mdDialog.alert()
          .title(title)
          .content(msg)
          .ariaLabel('Alert Dialog')
          .ok('close')
      );
      },
      removeAccount: function($scope, email, password, uid) {
        var ref = new Firebase(firebaseService.getFirebBaseURL());

        var confirm = $mdDialog.confirm()
        .title('Delete Account')
        .content('WARNING!! Are you sure you want to delete your account?')
        .ariaLabel('test ')
        .ok('Yes, I agree.')
        .cancel('Cancel')

        $mdDialog.show(confirm).then(function() {
          //pressed yes
          userService.deleteCurrentUser(email, password, uid);

          //logout
          console.log('Logging Out!')
          ref.child('profileInfo').child(uid).update({
            loggedIn: false
          });
          localStorage.clear();
          ref.unauth();
          $state.go('login');

        }, function() {
          //cancelled

        });
      }
    };
});
