(function () {
  'use strict';
  
  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .constant('ApiBasePath', "https://coursera-jhu-default-rtdb.firebaseio.com")
  .directive('foundItems', FoundItems);
  
  
  function FoundItems() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        found: '<',
        onRemove: '&'
      },
      controller: NarrowItDownController,
      controllerAs: 'menu',
      bindToController: true
    };
  
    return ddo;
  }
  
  
  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var menu = this;
  
    menu.searchTerm = "";
    menu.foundItems = [];
    menu.message = "";
  
    menu.getMatchedMenuItems = function () {
      menu.message = "";
      if (menu.searchTerm.trim() === "") {
        console.log("ehr");
        menu.message = 'Nothing found';
      } else {
        console.log("promise");
        var promise = MenuSearchService.getMatchedMenuItems(menu.searchTerm);
  
        promise.then(function (foundItems) {
          menu.foundItems = foundItems;
          if (menu.foundItems.length === 0) {
              menu.message = 'Nothing found';
          }
        })
        .catch(function (error) {
          console.log(error);
        })
      }
    };
  
    menu.removeItem = function (itemIndex) {
      MenuSearchService.removeItem(itemIndex);
      menu.foundItems = MenuSearchService.getFoundItems();
    };
  
  
  }
  
  
  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath) {
    var service = this;
  
    var foundItems = [];
  
    service.getMatchedMenuItems = function (searchTerm) {
      console.log("SearchTerm: " + searchTerm);
      var response = $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      }).then(function (response) {
        var obj = response.data;
        foundItems = [];
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            var val = obj[key];
            //console.log(val.menu_items);
            var menuItems = val.menu_items;
            //console.log(menuItems);
            for (var item in menuItems) {
              if (menuItems.hasOwnProperty(item)) {
                //console.log(menuItems[item]);
                var desc = menuItems[item].description;
                var name = menuItems[item].name;
                var shortName = menuItems[item].short_name;
                var fItems = {
                  "name": name,
                  "description": desc,
                  "shortName": shortName
                }
                if (desc.toLowerCase().includes(searchTerm.toLowerCase())) {
                  foundItems.push(fItems);
                }
                // if (name.toLowerCase().includes(searchTerm.toLowerCase())) {
                //   foundItems.push(fItems);
                // }
              }
            }
          }
        }
        return foundItems;
      });
  
      return response;
    };
  
    service.removeItem = function (itemIndex) {
      foundItems.splice(itemIndex, 1);
      console.log(foundItems);
    };
  
    service.getFoundItems = function () {
      return foundItems;
    };
  
  }
  
  })();