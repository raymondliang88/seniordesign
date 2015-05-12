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
  .service('alertService', function ($mdDialog) {
      return {
        show: function(title,msg) {
        $mdDialog.show(
          $mdDialog.alert()
            .title(title)
            .content(msg)
            .ariaLabel('Alert Dialog')
            .ok('close')
        );
        }
      };
  });
