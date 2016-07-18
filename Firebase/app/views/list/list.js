var dialogsModule = require("ui/dialogs");
var observableModule = require("data/observable");
var observableArrayModule = require("data/observable-array");
var viewModule = require("ui/core/view");
var GroceryListViewModel = require("../../shared/view-models/grocery-list-view-model");
var SignupListViewModel = require("../../shared/view-models/signup-list-view-model");
var socialShare = require("nativescript-social-share");
var swipeDelete = require("../../shared/utils/ios-swipe-delete");
var frameModule = require("ui/frame");
var page;
var itemIndex;

var groceryList = new GroceryListViewModel([]);
var pageData = new observableModule.Observable({
    groceryList: groceryList
});

var signupList = new SignupListViewModel([]);
var signupData = new observableModule.Observable({
    signupList: signupList
});

// remove later
var config = require("../../shared/config");
var firebase = require("nativescript-plugin-firebase");

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

    signupList.empty();
    signupData.set("isLoading", true);
    signupList.load().then(function() {
        signupData.set("isLoading", false);
    });
};

exports.add = function() {
    // Check for empty submissions
    if (pageData.get("grocery").trim() !== "") {
        // Dismiss the keyboard
        viewModule.getViewById(page, "grocery").dismissSoftInput();
        groceryList.add(pageData.get("grocery"))
            .catch(function() {
                dialogsModule.alert({
                    message: "An error occurred while adding an item to your list.",
                    okButtonText: "OK"
                });
            });
        // Empty the input field
        pageData.set("grocery", "");
    } else {
        dialogsModule.alert({
            message: "Enter a grocery item",
            okButtonText: "OK"
        });
    }
};

exports.share = function() {
    var list = [];
    var finalList = "";
    for (var i = 0, size = groceryList.length; i < size ; i++) {
        list.push(groceryList.getItem(i).name);
    }
    var listString = list.join(", ").trim();
    socialShare.shareText(listString);
};

exports.delete = function(args) {
    var item = args.view.bindingContext;
    var index = groceryList.indexOf(item);
    groceryList.delete(index);
};

// Navigate to previous page
exports.backToTopic = function backToTopic(){
    topmost.goBack();
}

// Tapping a listview item
function listViewItemTap(args) {
    var itemIndex = args.index;
    var currentID = pageData.groceryList.getItem(itemIndex).id;

    exports.tapBookingLogic(currentID);

}
exports.listViewItemTap = listViewItemTap;


// Query if training exists
exports.tapBookingLogic = function (currentID) {
    var onQueryEvent = function(result) {
        // note that the query returns 1 match at a time
        // in the order specified in the query
        if (!result.error) {
            //console.log("Event type: " + result.type);
            //console.log("Key: " + result.key);
            //console.log("Value: " + JSON.stringify(result.value));
        }

        var data = JSON.parse(JSON.stringify(result.value));

        for (var prop in data) {
            if (data[prop].trainingID === currentID && data[prop].UID === config.uid) {
                console.log("Already signed up.");
            } else {
                exports.subscribe(currentID);
                console.log("Successfully subscribed to the training.");
            }
        }

    };

    firebase.query(
        onQueryEvent,
        "/signups",
        {
            // set this to true if you want to check if the value exists or just want the event to fire once
            // default false, so it listens continuously
            singleEvent: true,
            // order by company.country
            orderBy: {
                type: firebase.QueryOrderByType.CHILD,
                value: 'UID' // mandatory when type is 'child'
            },
            // but only companies named 'Telerik'
            // (this range relates to the orderBy clause)
            range: {
                type: firebase.QueryRangeType.EQUAL_TO,
                value: config.uid
            },
        }
    );
};

// Subscribing to a training
exports.subscribe = function (currentID) {

    firebase.push(
        "/signups",
        {UID: config.uid, trainingID: currentID}
    );

};


// Store data - an array of JSON objects
// JS.Date.toJSON = YYYY-MM-DDTHH:mm:ss.sssZ
exports.pushDB_1 = function (result) {
    firebase.setValue(
        "/Groceries",
        [
            {UID: config.uid, id: "0", type: "Gymnastics", starts: "2016-12-24T09:00:00", partic_max: "8", partic_current: "3"},
            {UID: config.uid, id: "1", type: "Team Workout", starts: "2016-12-24T11:00:00", partic_max: "8", partic_current: "3"},
            {UID: config.uid, id: "2", type: "Mobility", starts: "2016-12-25T09:00:00", partic_max: "8", partic_current: "3"},
            {UID: config.uid, id: "3", type: "Strength", starts: "2016-12-25T11:00:00", partic_max: "8", partic_current: "3"},
            {UID: config.uid, id: "4", type: "Gymnastics", starts: "2016-12-26T09:00:00", partic_max: "8", partic_current: "3"}
        ]
    );
    if (!result.error) {
        console.log("Event type: " + result.type);
        console.log("Key: " + result.key);
        console.log("Value: " + JSON.stringify(result.value));
    }
};

// to store an array of JSON objects
// JS.Date.toJSON = YYYY-MM-DDTHH:mm:ss.sssZ
exports.pushDB_2 = function (result) {
    firebase.setValue(
        "/signups",
        [
            {UID: config.uid, id: "0", trainingID: "0"},
            {UID: config.uid, id: "1", trainingID: "1"},
            {UID: config.uid, id: "2", trainingID: "2"},
            {UID: config.uid, id: "3", trainingID: "3"},
            {UID: config.uid, id: "4", trainingID: "4"}
        ]
    );
    if (!result.error) {
        console.log("Event type: " + result.type);
        console.log("Key: " + result.key);
        console.log("Value: " + JSON.stringify(result.value));
    }
};

exports.tap_tabView2 = function () {
    page.bindingContext = signupData;
}

exports.consoleLog = function() {
    page.bindingContext = signupData;
    console.log("Test");
    console.log("SignupList:" + signupList);
    console.log("GroceryList:" + groceryList);
    console.log("pageData:" + pageData);
    console.log("signupData:" + signupData);
}