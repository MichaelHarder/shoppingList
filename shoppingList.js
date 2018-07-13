angular.module('shoppingListApp', [])
.controller('ShoppingListController', function($scope, $http) {
  var url = 'http://localhost:3000/api/items/';

  // $scope.items = [
  //   {text:'Milk', category:'Dairy', checked:false},
  //   {text:'Bananas', category:'Produce', checked:false}];
  $http.get(url).
  then(function(response) {
    $scope.items = response.data;
  })
  .catch(function(response) {
    console.log("Error getting items");
  });

  $scope.addItem = function() {
    var newItem = { text:$scope.itemText, category:$scope.itemCategory, checked:false };
    $http.post(url, newItem).
    then(function(response) {
      newItem._id = response.data;
      $scope.items.push(newItem);
      $scope.itemText = '';
      $scope.itemCategory = '';
    })
    .catch(function(response) {
      console.log("Error adding item");
    });
  };

  $scope.removeItem = function(item) {
    $http.delete(url + item._id).
    then(function(response) {
      var index = $scope.items.indexOf(item);
      $scope.items.splice(index, 1);
    })
    .catch(function(response) {
      console.log("Error deleting item");
    });
  };

  $scope.getRemaining = function() {
    var count = 0;
    angular.forEach($scope.items, function(item) {
      count += item.checked ? 0 : 1;
    });
    return count;
  };

  $scope.removeChecked = function() {
    angular.forEach($scope.items, function(item) {
      if (item.checked) {
        $scope.removeItem(item);
      }
    });
  };

  $scope.uncheckAll = function() {
    angular.forEach($scope.items, function(item) {
      if (item.checked) item.checked = false;
    });
  };

  $scope.toggleChecked = function(item) {
    $http.put(url + item._id, JSON.stringify({checked: (item.checked ? true : false)})).
    then(function(response) {
      console.log(response.data);
    });
  };
});
