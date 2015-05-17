'use strict';
angular.module('projectsApp')
.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});