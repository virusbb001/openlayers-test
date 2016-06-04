(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.form_settings = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  function getOptions(ol) {
    var options = {
      "add_single_ballon": {
        inputs: ["latitude", "longitude"],
        execute: function execute(datas) {
          var latitude = datas.latitude;
          var longitude = datas.longitude;
        }
      }
    };

    return options;
  }

  exports.default = getOptions;
});