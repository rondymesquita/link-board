var phoenix = angular.module('PhoenixJS', ['ngRoute','btford.markdown','angularUtils.directives.dirPagination'])
.run(function(){
    console.log("PhoenixJS Loaded");
}).config(function(paginationTemplateProvider, config){
    paginationTemplateProvider.setPath(config.pagTemplate);
});


phoenix.constant('config',{
    'theme': 'clean', //theme folder name
    'intenseDebateAcct': '4fb72a3cc0a3dd8ee583e406d41ddafe', //intenseDebate id
    'pagTemplate': 'app/themes/rising/partials/pagination.tpl.html', //template for pagination
    'pagItemsPerPage': 999 //how many itens per page
    // 'indexPage': 'custom_index.html' /*if you want a custom index page, declare the page name here, otherwise, remove or comment the line*/
});

phoenix.constant('constants',{
    siteName: 'Link Board',
    siteDescription: 'Links, tools, blog archives, tutorials of useful things to development and design',
    siteFooter: '2015 - Created by Rondy Mesquita - Powered by PhoenixJS and theme Clean',
    category: 'Category: ',
    categories: 'Categories',
    archives: 'Archives',
    searchPlaceholder: 'Type your search and enter' ,
    search: 'Search',
    searchEmptyResultTitle: 'Ops... Nothing found!',
    searchResultTitle: 'Archives found: '
});

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


phoenix.controller('IndexController', ['$scope', '$rootScope','$routeParams', '$location', 'config','constants', 'CategoryService','PostService', 'Service', indexController]);

function indexController ($scope, $rootScope, $routeParams, $location, config, constants, categoryService, postService, service) {

    $scope.location = $location;
    $scope.constants = constants;
    $scope.theme = config.theme;
    $scope.pagItemsPerPage = config.pagItemsPerPage;

    categoryService.list().then(function(categories){
        $scope.categories = categories;
    });

    service.get('content/menus/menu.json').then(function(data){
        $scope.menu = data;
    });

    $scope.isActive = function(item) {
        // console.log("#" + $location.path());
        // console.log(item.url);
      if (item.url == "#" + $location.path()) {
        return true;
      }
      return false;
    };

    $scope.searchPosts = function(search){
        if(search && search.trim()){
            $location.path("/search/" + search);
        }
    };

    /* istanbul ignore next: custom for theme */
    $scope.pageChangeHandler = function(num) {
      window.scrollTo(0, 0);
    };

    /* istanbul ignore next: custom for theme */
    service.get('content/social.json').then(function(data){
        $scope.social = data;
    });

}


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

phoenix.controller('PostByCategoryController', ['$scope', '$rootScope', '$http', '$routeParams','PostService', postByCategoryController]);

function postByCategoryController($scope, $rootScope, $http, $routeParams, postService) {
    
    $scope.routeParams = $routeParams;

    postService.listByCategory($scope.routeParams.category).then(function(posts){
        $scope.posts = posts;
        $scope.category = $scope.routeParams.category;
    });

}


phoenix.controller('PostBySearchController', ['$scope', '$rootScope', '$http', '$routeParams','$location','PostService', postBySearchController]);

function postBySearchController($scope, $rootScope, $http, $routeParams, $location, postService) {

    $scope.post = [];
    $scope.routeParams = $routeParams;

    postService.listBySearch($scope.routeParams.search).then(function(posts){
            $scope.posts = posts;
            $scope.search = $scope.routeParams.search;
            $scope.searchString = $scope.routeParams.search;
    });

}


phoenix.controller('PostListController', ['$scope', '$rootScope', 'PostService', postListController]);

function postListController($scope, $rootScope, postService) {

    $scope.posts = [];
    $rootScope.posts = [];

    postService.list().then(function(posts){
        $scope.posts = posts;
        $rootScope.posts = posts;
    });

}


phoenix.controller('PostViewController', ['$scope', '$rootScope', '$http', '$routeParams','config','PostService','Service', postViewController]);

function postViewController($scope, $rootScope, $http, $routeParams, config, postService, service) {

    $scope.post = {};
    $scope.routeParams = $routeParams;

    postService.getById($scope.routeParams.id).then(function(post){
        $scope.post = post;
        $rootScope.post = post;
        service.get('content/posts/' + $scope.routeParams.id + '.' + post.type).then(function(data, status){
          $scope.post.content = data;
        });

        $scope.intenseDebateAcct = config.intenseDebateAcct;
        $scope.intenseDebateId = "/post/"+$scope.post.id+"/"+$scope.post.url;
        $scope.intenseDebateUrl = "/post/"+$scope.post.id+"/"+$scope.post.url;

    });

}

phoenix.directive('phxComments',['config', comments]);

function comments(config){
    return {
        restrict: 'E',
        templateUrl: 'app/themes/'+config.theme+'/comments/comments.html'
    };
}

phoenix.directive('phxFooter',['config',footerDirective]);

function footerDirective(config){
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: 'app/themes/'+config.theme+'/footer/footer.html',
        compile: function(element, attrs){
            return function(scope, element, attrs){
                if (!attrs.body) {
                    attrs.body = 'footer-default.html';
                }
                scope.body = "app/themes/"+config.theme+"/footer/"+ attrs.body;
            };
        }
    };
}

phoenix.directive('phxHeader',['config', headerDirective]);

function headerDirective(config){
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: 'app/themes/'+config.theme+'/header/header.html',
        compile: function(element, attrs){
            return function(scope, element, attrs){
                if (!attrs.body) {
                    attrs.body = 'header-default.html';
                }
                scope.body = "app/themes/"+config.theme+"/header/"+ attrs.body;
            };
        }
    };
}

phoenix.directive('phxMenu',['config','$sce', menuDirective]);

function menuDirective(config,$sce){
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: 'app/themes/'+config.theme+'/menu/menu.html',
        compile: function(element, attrs){
            return function(scope, element, attrs){
                if (!attrs.body) {
                    attrs.body = 'menu-default.html';
                }
                scope.body = "app/themes/"+config.theme+"/menu/"+ attrs.body;
            };
        }
    };
}

phoenix.directive('phxSidebar',['config', sidebarDirective]);

function sidebarDirective(config){
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: 'app/themes/'+config.theme+'/sidebar/sidebar.html',
        compile: function(element, attrs){
            return function(scope, element, attrs){
                if (!attrs.body) {
                    attrs.body = 'sidebar-default.html';
                }
                scope.body = "app/themes/"+config.theme+"/sidebar/"+ attrs.body;
            };
        }
    };
}


/*
 * Filter to list posts by category
 */
phoenix.filter('byCategory', byCategoryFilter);

function byCategoryFilter(config) {
      var phoenixFunctions = new PhoenixFunctions();
      return function(data, category){
          var posts = [];
          posts = phoenixFunctions.getPostsByCategory(data, category);
          return posts;
      };
}

function PhoenixFunctions(){
    //var self = this;
}
PhoenixFunctions.prototype = {
    /*
     * Remove acentuation
     */
    sanitize: function(s){
        var r = s.toString().toLowerCase();
        non_asciis = [
            {value: 'a',regExp: '[àáâãäå]'},
            {value: 'ae',regExp: 'æ'},
            {value: 'c',regExp: 'ç'},
            {value: 'e',regExp: '[èéêë]'},
            {value: 'i',regExp: '[ìíîï]'},
            {value: 'n',regExp: 'ñ'},
            {value: 'o',regExp: '[òóôõö]'},
            {value: 'oe',regExp: 'œ'},
            {value: 'u',regExp: '[ùúûűü]'},
            {value: 'y',regExp: '[ýÿ]'},
            {value: '-',regExp: '[^A-Za-z0-9]+'}, //all special chars
            {value: '',regExp: '^[^A-Za-z0-9]+'}, //special chars at start
            {value: '',regExp: '[^A-Za-z0-9]+$'} //special chars at end
        ];
        non_asciis.forEach(function(char){
            r = r.replace(new RegExp(char.regExp, 'g'), char.value);
        });

        return r.toLowerCase();
    },

    /*
     * Generate a friendly url to post based on title
     */
    generateFriendlyUrlToPost: function(publication){
        if(!publication.slug){
            publication.slug = this.sanitize(publication.title);
        }
        if(!publication.url){
            publication.url = "#/post/" + publication.id + "/" + publication.slug;
        }
        return publication;
    },

    /*
     * Generate a friendly url to post based on title
     */
    generateFriendlyUrlToPage: function(publication){
        if(!publication.slug){
            publication.slug = this.sanitize(publication.title);
        }
        if(!publication.url){
            publication.url = "#/page/" + publication.id + "/" + publication.slug;
        }
        return publication;
    },

    /*
     * Get posts by given json posts and category
     */
    getPostsByCategory: function(posts, category){
        var result = [],
            self = this;

        posts.forEach(function(post){

            post = self.generateFriendlyUrlToPost(post);

            for(var i = 0; i < post.categories.length; i++){
                if(category === post.categories[i]){
                    result.push(post);
                }
            }

        });

      return result;
  },

  /*
   * Get posts by given json posts and id
   */
  getPostById: function(posts, id){
    //   var self = this;
    //   posts.forEach(function(post){
    //       post = self.generateFriendlyUrlToPost(post);
    //   });
    //   return posts[id-1];
    return this.generateFriendlyUrlToPost(posts[id-1]);
  },

  /*
   * Get posts by given json posts and search
   */
  getPostsBySearch: function(posts, search){

      search = this.sanitize(search);
      var result = [],
          self = this;

      posts.forEach(function(post){
          var insertThisPost = false;

          var value;
          for(var attr in post){
              value = self.sanitize(post[attr]);

              if(value.indexOf(search) != -1){
                  insertThisPost = true;
                  post = self.generateFriendlyUrlToPost(post);
              }
          }

          if(insertThisPost)
              result.push(post);

      });

      return result;
  },

  /*
   * Get posts
   */
  getPosts: function(posts, search){
      var result = [],
          self = this;

      posts.forEach(function(post){
          post = self.generateFriendlyUrlToPost(post);
          result.push(post);
      });
      return result;
  },

  /*
   * Get categories list from posts
   */
  getCategories: function(posts){
      var categories = [];
      var tempCategories = [];
        posts.forEach(function(post){
            for(var i = 0; i < post.categories.length; i++){

                var category = {
                    title: post.categories[i],
                    url: "#/category/" + post.categories[i]
                };

                if(tempCategories.indexOf(post.categories[i]) === -1){
                    tempCategories = tempCategories.concat(post.categories[i]);
                    categories.push(category);
                }
            }
        });

        return categories;
  },

  /*
   * Get page by given slug
   */
  getPageBySlug: function(pages, title){
      var p = {},
          self = this;
      pages.forEach(function(page){
          post = self.generateFriendlyUrl(page);

          if(title === page.slug){
              p = page;
              return false;
          }

      });
      return p;
  },

  /*
   * Get page by given id
   */
  getPageById: function(pages, id){
     return this.generateFriendlyUrlToPage(pages[id-1]);
  }

};

phoenix.service('CategoryService', ['$http', 'config', '$q', categoryService]);

function categoryService($http, config, $q) {

    var postsLocation = 'content/posts/posts.json';
    var phoenixFunctions = new PhoenixFunctions();

    /*
     * List categories from all posts
     */
    this.list = function(){

        var deferred = $q.defer();

        $http({
            method:'GET',
            url:  postsLocation,
            cache: true
        }).success(function (posts){
            var categories = phoenixFunctions.getCategories(posts);
            deferred.resolve(categories);
        });

        return deferred.promise;
    };

}

phoenix.service('PageService', ['$http', 'config', '$q', pageService]);

function pageService($http, config, $q) {

    var pagesLocation = 'content/pages/pages.json';
    var phoenixFunctions = new PhoenixFunctions();

    this.getById= function(id){
        var deferred = $q.defer();

        $http({
            method:'GET',
            url: pagesLocation,
            cache: true
        }).then(function(response){
            var page = phoenixFunctions.getPageById(response.data, id);
            deferred.resolve(page);
        },function(){
            deferred.reject();
        });
        return deferred.promise;
    };

}

phoenix.service('PostService', ['$http', 'config', '$q', postService]);

function postService($http, config, $q) {

    var postsLocation = 'content/posts/posts.json';
    var phoenixFunctions = new PhoenixFunctions();

    this.list = function(){

        var deferred = $q.defer();

        $http({
            method:'GET',
            url: postsLocation,
            cache: true
        }).success(function (data){
            var posts = phoenixFunctions.getPosts(data);
            deferred.resolve(posts);
        });

        return deferred.promise;

    };

    this.listByCategory = function(category){

        var deferred = $q.defer();

        $http({
            method:'GET',
            url: postsLocation,
            cache: true
            }).success(function (data){
                var posts = phoenixFunctions.getPostsByCategory(data, category);
                deferred.resolve(posts);
            });

        return deferred.promise;
    };

    this.getById = function(id){

        var deferred = $q.defer();

        $http({
            method:'GET',
            url: postsLocation,
            cache: true
        }).success(function (data){
            var post = phoenixFunctions.getPostById(data, id);
            deferred.resolve(post);
        });

        return deferred.promise;
    };

    this.listBySearch = function(search){

        var deferred = $q.defer();

        var request = $http({
            method:'GET',
            url: postsLocation,
            cache: true,
        }).success(function(data){
            var posts = phoenixFunctions.getPostsBySearch(data, search);
            deferred.resolve(posts);
        });

        return deferred.promise;
    };
}

phoenix.service('Service', ['$http', '$q', service]);

function service($http, $q) {

    this.get = function(url){

        var deferred = $q.defer();

        $http({
            method:'GET',
            url: url,
            cache: true
        }).then(function (response){
            deferred.resolve(response.data);
        });

        return deferred.promise;
    };
}

// service.$inject = ['$http','$q'];
// phoenix.service('Service',service);
