/*
√√√ create simple trainingsDB
(√) Create button
(√) Link button
(√) Add view model logic
(√) Press button!

!!! display db data
> find NativeScript example
OR
> find JavaScript + Firebase example
> mingle with current listview code .JS + .XML


!!! update data
*/
var dialogsModule = require("ui/dialogs");
var observableModule = require("data/observable");
var observableArrayModule = require("data/observable-array");
var viewModule = require("ui/core/view");
var GroceryListViewModel = require("../../shared/view-models/grocery-list-view-model");
var socialShare = require("nativescript-social-share");
var swipeDelete = require("../../shared/utils/ios-swipe-delete");
var frameModule = require("ui/frame");
var page;
var config = require("../../shared/config");
var firebase = require("nativescript-plugin-firebase");

var groceryList = new GroceryListViewModel([]);
var pageData = new observableModule.Observable({
    groceryList: groceryList,
    grocery: ""
});

// should be replaced by exports.loaded?!
// function onPageLoaded(args) {
//     console.log("Page Loaded");
// }
// exports.onPageLoaded = onPageLoaded;

exports.loaded = function(args) {
    page = args.object;

    if (page.ios) {
        var listView = viewModule.getViewById(page, "groceryList");
        swipeDelete.enable(listView, function(index) {
            groceryList.delete(index);
        });
        var navigationBar = frameModule.topmost().ios.controller.navigationBar;
        navigationBar.barTintColor = UIColor.colorWithRedGreenBlueAlpha(0.011, 0.278, 0.576, 1);
        navigationBar.titleTextAttributes = new NSDictionary([UIColor.whiteColor()], [NSForegroundColorAttributeName]);
        navigationBar.barStyle = 1;
        navigationBar.tintColor = UIColor.whiteColor();

        frameModule.topmost().ios.navBarVisibility = "never";

    }

    page.bindingContext = pageData;

    groceryList.empty();
    pageData.set("isLoading", true);
    groceryList.load().then(function() {
        pageData.set("isLoading", false);
    });
};

// to store an array of JSON objects
// JS.Date.toJSON = YYYY-MM-DDTHH:mm:ss.sssZ
exports.pushDB = function (result) {
    firebase.setValue(
        "/Groceries",
        [
            {id: "0", type: "Gymnastics", starts: "2016-12-24T09:00:00", partic_max: "8", partic_current: "3"},
            {id: "1", type: "Team Workout", starts: "2016-12-24T11:00:00", partic_max: "8", partic_current: "3"},
            {id: "2", type: "Mobility", starts: "2016-12-25T09:00:00", partic_max: "8", partic_current: "3"},
            {id: "3", type: "Strength", starts: "2016-12-25T11:00:00", partic_max: "8", partic_current: "3"},
            {id: "4", type: "Gymnastics", starts: "2016-12-26T09:00:00", partic_max: "8", partic_current: "3"}
        ]
    );
    if (!result.error) {
        console.log("Event type: " + result.type);
        console.log("Key: " + result.key);
        console.log("Value: " + JSON.stringify(result.value));
    }
};


  // retrieve data
exports.queryDB = function() {
      var onQueryEvent = function(result) {
        // note that the query returns 1 match at a time
        // in the order specified in the query
        if (!result.error) {
            console.log("Event type: " + result.type);
            console.log("Key: " + result.key);
            console.log("Value: " + JSON.stringify(result.value));
        }
    };

    firebase.query(
        onQueryEvent,
        "/companies",
        {
            // set this to true if you want to check if the value exists or just want the event to fire once
            // default false, so it listens continuously
            singleEvent: true,
            // order by timestamp
            orderBy: {
                type: firebase.QueryOrderByType.CHILD,
                value: "country" // mandatory when type is "child"
            },
            // but only companies named "Telerik"
            // (this range relates to the orderBy clause)
            range: {
                type: firebase.QueryRangeType.EQUAL_TO,
                value: "Bulgaria"
            },
            // only the first 2 matches
            // (note that there"s only 1 in this case anyway)
            limit: {
                type: firebase.QueryLimitType.LAST,
                value: 2
            }
        }
    );
}

// update data
exports.updateDB = function () {
        firebase.update(
        "/companies",
        {foo:"baz"}
     );
}

exports.navigateAway = function() {
    var topmost = frameModule.topmost();
    topmost.navigate("views/list/list");
};