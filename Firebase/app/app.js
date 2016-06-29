var application = require("application");

// added this here so we can do some wiring
var firebase = require("nativescript-plugin-firebase");

  firebase.init({
    url: 'https://mercury-f8270.firebaseio.com', // add your own endpoint
    persist: true // Persist data to disk. Default false.
  }).then(
      function (result) {
        console.log("firebase.init done");
      },
      function (error) {
        console.log("firebase.init error: " + error);
      }
  );

application.mainModule = "main-page";
application.cssFile = "./app.css";
application.start();
