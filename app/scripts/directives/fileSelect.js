'use strict';

angular.module('projectsApp')
.directive('ngFileSelect',function(){

  return {
    link: function($scope,el){

      el.bind('change', function(e){

        $scope.file = (e.srcElement || e.target).files[0];
        $scope.getFile($scope.file);
      });

    }

  };
}).directive('ngFileUpload',function(){

  return {
    link: function($scope,el){

      el.bind('change', function(e){
        var img = e.target.nextElementSibling;
        $scope.file = (e.srcElement || e.target).files[0];
        $scope.getFile($scope.file, img);
      });

    }

  };
})
.directive('ngUpload',function(){

  return {
    link: function($scope,el){

      el.bind('change', function(e){
        $scope.postFile = (e.srcElement || e.target).files[0];
        $scope.getPostFile($scope.postFile);
      });

    }

  };
});
