angular.module('MenuApp').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
  
    $stateProvider
      .state('home', {
        url: '/',
        template: '<h1>Welcome to our Restaurant</h1><a ui-sref="categories">See Categories</a>'
      })
      .state('categories', {
        url: '/categories',
        template: '<categories categories="$resolve.categories"></categories>',
        resolve: {
          categories: ['MenuDataService', function(MenuDataService) {
            return MenuDataService.getAllCategories();
          }]
        }
      })
      .state('items', {
        url: '/items/{categoryShortName}',
        template: '<items items="$resolve.items"></items>',
        resolve: {
          items: ['$stateParams', 'MenuDataService', function($stateParams, MenuDataService) {
            return MenuDataService.getItemsForCategory($stateParams.categoryShortName);
          }]
        }
      });
  }]);
  