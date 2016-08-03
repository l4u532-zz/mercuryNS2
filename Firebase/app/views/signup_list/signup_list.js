var dialogsModule = require("ui/dialogs");
var observableModule = require("data/observable");
var viewModule = require("ui/core/view");
var SignupListViewModel = require("../../shared/view-models/signup-list-view-model");
var frameModule = require("ui/frame");
var page;

var signupList = new SignupListViewModel([]);
var signupData = new observableModule.Observable({
    signupList: signupList
});

// remove later
var config = require("../../shared/config");
var firebase = require("nativescript-plugin-firebase");

exports.loaded = function(args) {
    page = args.object;

    page.bindingContext = signupData;

    signupList.empty();
    signupData.set("isLoading", true);
    signupList.load().then(function() {
        signupData.set("isLoading", false);
    });

    signupList.empty();
    signupData.set("isLoading", true);
    signupList.load().then(function() {
        signupData.set("isLoading", false);
    });
};

// Navigate to previous page
exports.backToTopic = function backToTopic(){
    topmost.goBack();
}

// Tapping a listview item
function listViewItemTap(args) {
    var itemIndex = args.index; // get index of tapped item
    var currentID = signupData.signupList.getItem(itemIndex).id; // get trainingID of tapped item

    exports.unsubscribe(currentID);

}
exports.listViewItemTap = listViewItemTap;

exports.unsubscribe = function (currentID) {

    firebase.remove(
        "/signups",
        {UID: config.uid, trainingID: currentID}
    );

    dialogsModule.alert({
        message: "Unsubscribed from the training!",
        okButtonText: "OK"
    });

};

// Go back to previous page
exports.onNavBtnTap = function () {
    topmost.goBack();
}