phoenix.config(routesConfig);

function routesConfig($routeProvider, $locationProvider, config) {

    $routeProvider

    .when('/', {
        templateUrl : function(urlattr){
            if(config.indexPage !== '' && config.indexPage !== undefined){
                return 'content/pages/static_pages/'  + config.indexPage;
            }else{
                return 'app/themes/' + config.theme + '/posts/list.html';
            }
        },
        controller  : 'PostListController'
    })

    .when('/post/:id/:title', {
        templateUrl : function(urlattr){
            return 'app/themes/' + config.theme + '/posts/view.html';
        },
        controller  : 'PostViewController'
    })

    .when('/category/:category', {
        templateUrl : function(urlattr){
            return 'app/themes/' + config.theme + '/posts/byCategory.html';
        },
        controller  : 'PostByCategoryController'
    })

    .when('/search/:search', {
        templateUrl : function(urlattr){
            return 'app/themes/' + config.theme + '/posts/bySearch.html';
        },
        controller  : 'PostBySearchController',
    })

    .when('/page/:id/:title', {
        templateUrl : function(urlattr){
            return 'app/themes/' + config.theme + '/pages/view.html';
        },
        controller  : 'PageViewController',
    })

    .otherwise({
        templateUrl : 'app/themes/' + config.theme + '/pages/404.html',
    });


}
