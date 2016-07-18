var config = require("../../shared/config");
var firebase = require("nativescript-plugin-firebase");
var observableArrayModule = require("data/observable-array");

function indexOf(item) {
    var match = -1;
    this.forEach(function(loopItem, index) {
        if (loopItem.id === item.key) {
            match = index;
        }
    });
    return match;
}

function SignupListViewModel(items) {

    var viewModel = new observableArrayModule.ObservableArray(items);
    viewModel.indexOf = indexOf;

    viewModel.load = function () {

        var onChildEvent = function(result) {
        var matches = [];

            // variables available in the signupList array
            if (result.type === "ChildAdded") {
                if(result.value.UID === config.uid){
                  viewModel.push({
                      // add new variables here
                      su_id: result.key,
                      su_trainingID: result.value.trainingID,
                  });
                }
            }

            else if (result.type === "ChildRemoved") {

                matches.push(result);

                matches.forEach(function(match) {
                    var index = viewModel.indexOf(match);
                    viewModel.splice(index, 1);
                });

            }

        };
        return firebase.addChildEventListener(onChildEvent, "/signups").then(
            function () {
              console.log("firebase.addChildEventListener added");
            },
            function (error) {
              console.log("firebase.addChildEventListener error: " + error);
            }
        )
      };

    viewModel.empty = function() {
        while (viewModel.length) {
            viewModel.pop();
        }
    };

    return viewModel;
}

module.exports = SignupListViewModel;
