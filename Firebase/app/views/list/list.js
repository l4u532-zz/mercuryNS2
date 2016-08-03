var dialogsModule = require("ui/dialogs");
var observableModule = require("data/observable");
var GroceryListViewModel = require("../../shared/view-models/grocery-list-view-model");
var frameModule = require("ui/frame");
var page;
var groceryList = new GroceryListViewModel([]);
var pageData = new observableModule.Observable({
    groceryList: groceryList
});
var config = require("../../shared/config");
var firebase = require("nativescript-plugin-firebase");

exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = pageData;

    groceryList.empty();
    pageData.set("isLoading", true);
    groceryList.load().then(function() {
        pageData.set("isLoading", false);
    });
};

// Navigate to previous page
exports.backToTopic = function backToTopic(){
    topmost.goBack();
}

// Tapping a listview item
function listViewItemTap(args) {
    var itemIndex = args.index; // get index of tapped item
    var currentID = pageData.groceryList.getItem(itemIndex).id; // get trainingID of tapped item
    var su_type = pageData.groceryList.getItem(itemIndex).type; // get type of tapped item
    var su_starts = pageData.groceryList.getItem(itemIndex).starts; // get time of tapped item

    exports.subscribe(currentID, su_type, su_starts);

}
exports.listViewItemTap = listViewItemTap;


// Logic if training exists
exports.tapBookingLogic = function (currentID) {
    var onQueryEvent = function(result) {
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
exports.subscribe = function (currentID, su_type, su_starts) {

    firebase.push(
        "/signups",
        {UID: config.uid, trainingID: currentID, su_type: su_type, su_starts: su_starts}
    );

    dialogsModule.alert({
        message: "Subscribed to the training!",
        okButtonText: "OK"
    });

};

exports.navToSignups = function () {
    console.log("Pressed button");
    frameModule.topmost().navigate("views/signup_list/signup_list");
}