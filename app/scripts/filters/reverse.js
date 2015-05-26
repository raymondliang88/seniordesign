'use strict';
angular.module('projectsApp')
.filter('reverse', function() {
  return function(items) {
  	if (items !== undefined){
    	return items.slice().reverse();
  	}
  };
});