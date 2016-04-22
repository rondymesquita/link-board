
phoenix.controller('PageViewController', ['$scope', '$rootScope', '$http', '$routeParams','PageService','Service', pageViewController]);

function pageViewController($scope, $rootScope, $http, $routeParams, pageService, service) {

    $scope.page = [];
    $scope.routeParams = $routeParams;

    pageService.getById($scope.routeParams.id).then(function(page){
            $scope.page = page;
            $rootScope.page = page;
            service.get('content/pages/' + $scope.routeParams.id + '.' + page.type).then(function(data){
              $scope.page.content = data;
          });
    });
}
