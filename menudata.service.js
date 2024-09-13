angular.module('data').service('MenuDataService', ['$http', function($http) {
    var service = this;
  
    service.getAllCategories = function() {
      return $http.get('https://coursera-jhu-default-rtdb.firebaseio.com/categories.json')
        .then(function(response) {
          return response.data;
        });
    };
  
    service.getItemsForCategory = function(categoryShortName) {
      return $http.get('https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/' + categoryShortName + '.json')
        .then(function(response) {
          return response.data;
        });
    };
  }]);
  