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
    tx.executeSql("CREATE TABLE IF NOT EXISTS shoppingbuddy (description TEXT, price REAL)");
  }, function (success) { }, function (error) {
    alert(JSON.stringify(error));
  }
);


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
        tx.executeSql("INSERT INTO shoppingbuddy(description, price) VALUES(" + item.description + "," + item.price + ")");
      }, function (success) {
        alert("added item to shopping list");
      }, function (error) {
        alert("failed to add item to shopping list");
      }
    );
  });
});
