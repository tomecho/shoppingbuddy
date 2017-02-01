// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
  // Because we use fixed-through navbar we can enable dynamic navbar
  dynamicNavbar: true
});

var db = window.openDatabase("shoppingbuddy", "1.0", "Shopping Buddy", 1000000);
db.transaction(function (tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS shoppingbuddy (id INTEGER PRIMARY KEY, description TEXT, price REAL)");
  }, function (success) { }, function (error) {
    alert(JSON.stringify(error));
  }
);


myApp.onPageInit('addItem', function (page) {
  // run createContentPage func after link was clicked
  $$('#addItemAction').on('click', function () {
    var item = myApp.formToData("#addItemForm");
    var keys = Object.keys(item);
    if(!keys.includes("description") || !keys.includes("price")) {
      alert("please fill out all fields");
      return;
    }
    db.transaction(
      function (tx) {
        tx.executeSql("INSERT INTO shoppingbuddy(id, description, price) VALUES()");
      }, function (success) {
        alert("added item to shopping list");
      }, function (error) {
        alert("failed to add item to shopping list");
      }
    );
  });
});
