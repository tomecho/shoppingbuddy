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
      debugger;
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
    db.transaction(
      function (tx) {
        tx.executeSql("INSERT INTO shoppingbuddy(description, price) VALUES(?, ?)", [item.description, item.price],
          function (success, results) {
            alert(JSON.stringify(results));
          },
          function (err) {
            alert (JSON.stringify(err));
          }
        );
      }, function (error) {
        alert("failed to add item to shopping list");
      }
    );
  });
});
