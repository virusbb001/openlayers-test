(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports !== "undefined") {
    factory();
  } else {
    var mod = {
      exports: {}
    };
    factory();
    global.index = mod.exports;
  }
})(this, function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var map = new ol.Map({
      target: "map",
      layers: [new ol.layer.Tile({
        source: new ol.source.MapQuest({ layer: "sat" })
      })],
      view: new ol.View({
        center: ol.proj.fromLonLat([37.41, 8.82]),
        zoom: 4
      })
    });
  });
});