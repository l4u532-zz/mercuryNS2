var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var viewModule = require("ui/core/view");
var vmModule = require("./main-view-model");

function pageLoaded(args) {
  var page = args.object;
  page.bindingContext = vmModule.mainViewModel;
}
exports.pageLoaded = pageLoaded;
