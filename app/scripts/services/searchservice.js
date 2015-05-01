'use strict';

angular.module('projectsApp')
  .factory('searchService', function (firebaseService) {
    var query;
    return {
      setSearchQuery: function(inputQuery) {
        query = inputQuery;
      },
      getSearchQuery: function() {
        console.log(query);
        return query;
      }
    };
  });