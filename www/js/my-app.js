// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;
var $scope = {};

// Add view
var mainView = myApp.addView('.view-main', {
  // Because we use fixed-through navbar we can enable dynamic navbar
  dynamicNavbar: true
});

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  var db = window.openDatabase("shoppingbuddy", "1.0", "Shopping Buddy", 1000000);
  $scope.db = db;
  db.transaction(function (tx) {
      tx.executeSql("CREATE TABLE IF NOT EXISTS shoppingbuddy (id INTEGER PRIMARY KEY, description TEXT, price REAL)");
    }, function (error) {
      alert(JSON.stringify(error));
    });
}

myApp.onPageInit('addItem', function (page) {
  $$('#addItemAction').on('click', function () {
    var item = myApp.formToData("#addItemForm");

    //first things first lets verify we have all the required keys
    var keys = Object.keys(item); //lets get all the keys
    if(!keys.includes("description") || !keys.includes("price")) {
      alert("please fill out all fields");
      return;
    }

    //alright now lets add it
    $scope.db.transaction(
      function (tx) {
        tx.executeSql("INSERT INTO shoppingbuddy(description, price) VALUES(?, ?)", [item.description, item.price],
          function (tx, results) {
            alert("Added to shopping list");
          },
          function (err) {
            alert (JSON.stringify(err));
          }
        );
      }, function (error) {
        alert("failed to add item to shopping list");
      });
  });
});

myApp.onPageInit('shoppingList', function (page) {
  $scope.db.transaction(function (tx) {
    tx.executeSql("SELECT * from shoppingbuddy", [], function (tx, results) {
      // for some reason need to convert this, they cant handle a plain result set
      var shoppingList = [];
      for(var i=0; i<results.rows.length; i++) {
        shoppingList.push(results.rows.item(i));
      }

      myApp.virtualList(".virtual-list-items", {
        items: shoppingList,
        template: '<li class="item-content">' +
                    //'<div class="item-media"><img src="{{picture}}"></div>' +
                    '<div class="item-inner">' +
                        '<div class="item-title-row">' +
                          '<div class="item-title">{{name}}</div>' +
                          '<div class="item-after">{{price}}</div>' +
                        '</div>' +
                        '<div class="item-text">{{description}}</div>' +
                    '</div>' +
                 '</li>',
        height: 55
      });
    });
  }, function (err) { debugger; alert(JSON.stringify(err)) });
});
