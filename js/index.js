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
    global.dom_settings = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  function vue_setting(map, vectorLayer, options) {
    var latlngInputs;
    var draw;
    var click_actions = [{
      label: "None",
      func: function func() {}
    }, {
      label: "Set Now Place",
      func: function func(e) {
        var lonlat = ol.proj.toLonLat(e.coordinate);
        latlngInputs.$data.position.longitude = lonlat[0];
        latlngInputs.$data.position.latitude = lonlat[1];
      }
    }, {
      label: "Draw Line",
      type: "when_selected",
      func: function func() {
        draw = new ol.interaction.Draw({
          source: vectorLayer.getSource(),
          type: "LineString"
        });
        map.addInteraction(draw);
      }
    }];

    var selectedHandler = function selectedHandler() {
      map.removeInteraction(draw);
      if (this.selected_action.type === "when_selected") {
        this.selected_action.func();
      }
    };

    latlngInputs = new Vue({
      el: "#forms",
      data: {
        position: {
          latitude: 0,
          longitude: 0
        },
        selected_action: click_actions[0],
        click_actions: click_actions,
        status: ""
      },
      methods: {
        setFromNowPlace: function setFromNowPlace(event) {
          var _this = this;

          event.target.disabled = true;
          event.target.textContent = "Loading...";
          navigator.geolocation.getCurrentPosition(function (position) {
            _this.$data.position.latitude = position.coords.latitude;
            _this.$data.position.longitude = position.coords.longitude;
            event.target.textContent = "Set now Position";
            event.target.disabled = false;
          }, function (error) {
            _this.$data.status = "ERROR-" + error.code + ": " + error.message;
            event.target.textContent = "Set now Position";
            event.target.disabled = false;
          });
        },
        checkGeolocation: function checkGeolocation() {
          return !("geolocation" in navigator);
        },
        goTo: function goTo() {
          var pos = this.$data.position;
          map.getView().setCenter(ol.proj.fromLonLat([pos.longitude, pos.latitude]));
        },
        addFavoritePlace: function addFavoritePlace() {
          var list = JSON.parse(localStorage.getItem("oltest.favoliteplace")) || [];
          list.push([this.$data.position.longitude, this.$data.position.latitude]);
          localStorage.setItem("oltest.favoliteplace", JSON.stringify(list));
          console.log(list);
        },
        setParamWhenActChanged: selectedHandler
      }
    });

    map.on("click", function (e) {
      if (typeof latlngInputs.$data.selected_action.type === "undefined") {
        latlngInputs.$data.selected_action.func(e);
      }
    });

    window.latlngInputs = latlngInputs;
  }

  exports.default = vue_setting;
});
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
  /**
   * パラメータ入力フォームと実行の設定を返す関数
   * @param ol OpenLayer3 のオブジェクト
   * @param map 表示用のMapオブジェクト
   */
  function getOptions(ol, map) {
    var options = {
      LatLongController: {
        setNowPosition: {
          func: function func(event) {
            event.target.disabled = true;
            event.target.textContent = "Loading...";
            console.log(this);
            navigator.geolocation.getCurrentPosition(function (position) {
              this.$data.position.latitude = position.coords.latitude;
              this.$data.position.longitude = position.coords.longitude;
              event.target.textContent = "Set Now Position";
              event.target.disabled = false;
            });
          },
          isEnable: function isEnable() {
            return !("geolocation" in navigator);
          }
        },
        goTo: function goTo() {
          var pos = this.$data.position;
          map.getView().setCenter(ol.proj.fromLonLat([pos.longitude, pos.latitude]));
        }
      }
    };

    return options;
  }

  exports.default = getOptions;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["form_settings", "dom_settings"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("form_settings"), require("dom_settings"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.form_settings, global.dom_settings);
    global.index = mod.exports;
  }
})(this, function (_form_settings, _dom_settings) {
  "use strict";

  var _form_settings2 = _interopRequireDefault(_form_settings);

  var _dom_settings2 = _interopRequireDefault(_dom_settings);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /*  eslint no-console: "off" */


  document.addEventListener("DOMContentLoaded", function () {
    /*
    var meganeMuseum= new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([136.1988424,35.9427557]))
    });
    meganeMuseum.setStyle(new ol.style.Style({
      image: new ol.style.Circle({
        radius: 7,
        snapToPixel: false,
        fill: new ol.style.Fill({color: "black"}),
        stroke: new ol.style.Stroke({
          color: "white", width: 2
        })
      })
    }));
     var vectorSource = new ol.source.Vector({
      features: [meganeMuseum]
    });
    */

    var vectorLayor = new ol.layer.Vector({
      source: new ol.source.Vector()
    });
    var view = new ol.View({
      center: ol.proj.fromLonLat([139.7528, 35.685175]),
      zoom: 14
    });

    var map = new ol.Map({
      target: "map",
      layers: [new ol.layer.Tile({ source: new ol.source.OSM() }), vectorLayor],
      view: view
    });

    var options = (0, _form_settings2.default)(ol, map);
    (0, _dom_settings2.default)(map, vectorLayor, options);

    // 最初の時のみ現在地を中央にするようにする
    navigator.geolocation.getCurrentPosition(function (position) {
      view.setCenter(ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude]));
    }, function (error) {
      console.log(error);
    });

    setFileEvents();

    window.map = map;
    window.vectorLayor = vectorLayor;
  });

  function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }

  function handleFileSelect(e) {
    e.stopPropagation();
    e.preventDefault();

    var files = e.dataTransfer.files;
    console.log(files);
    addPointsFromFiles(files);
  }

  function setFileEvents() {
    document.addEventListener("dragover", handleDragOver, false);
    document.addEventListener("drop", handleFileSelect, false);
  }

  function addPointsFromFiles(files) {
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if (file.type != "application/json") {
        return false;
      }
      var reader = new FileReader();
      reader.onload = function (e) {
        var results = JSON.parse(e.target.result);
        results.positions.forEach(function (pos) {
          var feature = featureFactory(pos);
          window.vectorLayor.getSource().addFeature(feature);
        });
      };
      reader.readAsText(file);
    }
  }

  function featureFactory(pos_data) {
    var earthRadius = 6378137; // [m]
    var wgs84Sphere = new ol.Sphere(earthRadius);
    if ("radius" in pos_data) {
      var circle = ol.geom.Polygon.circular(wgs84Sphere, [pos_data.longitude, pos_data.latitude], pos_data.radius, 64).transform("EPSG:4326", "EPSG:3857");
      return new ol.Feature(circle);
    }
    return new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([pos_data.longitude, pos_data.latitude]))
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvbV9zZXR0aW5ncy5qcyIsImZvcm1fc2V0dGluZ3MuanMiLCJpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxXQUFTLFdBQVQsQ0FBcUIsR0FBckIsRUFBeUIsV0FBekIsRUFBcUMsT0FBckMsRUFBNkM7QUFDM0MsUUFBSSxZQUFKO0FBQ0EsUUFBSSxJQUFKO0FBQ0EsUUFBSSxnQkFBZ0IsQ0FBQztBQUNuQixhQUFPLE1BRFk7QUFFbkIsWUFBTSxnQkFBVSxDQUNmO0FBSGtCLEtBQUQsRUFJbEI7QUFDQSxhQUFPLGVBRFA7QUFFQSxZQUFNLGNBQVMsQ0FBVCxFQUFXO0FBQ2YsWUFBSSxTQUFPLEdBQUcsSUFBSCxDQUFRLFFBQVIsQ0FBaUIsRUFBRSxVQUFuQixDQUFYO0FBQ0EscUJBQWEsS0FBYixDQUFtQixRQUFuQixDQUE0QixTQUE1QixHQUFzQyxPQUFPLENBQVAsQ0FBdEM7QUFDQSxxQkFBYSxLQUFiLENBQW1CLFFBQW5CLENBQTRCLFFBQTVCLEdBQXFDLE9BQU8sQ0FBUCxDQUFyQztBQUNEO0FBTkQsS0FKa0IsRUFXbEI7QUFDQSxhQUFPLFdBRFA7QUFFQSxZQUFNLGVBRk47QUFHQSxZQUFNLGdCQUFVO0FBQ2QsZUFBTyxJQUFJLEdBQUcsV0FBSCxDQUFlLElBQW5CLENBQXdCO0FBQzdCLGtCQUFRLFlBQVksU0FBWixFQURxQjtBQUU3QixnQkFBTTtBQUZ1QixTQUF4QixDQUFQO0FBSUEsWUFBSSxjQUFKLENBQW1CLElBQW5CO0FBQ0Q7QUFURCxLQVhrQixDQUFwQjs7QUF1QkEsUUFBSSxrQkFBa0IsU0FBbEIsZUFBa0IsR0FBVTtBQUM5QixVQUFJLGlCQUFKLENBQXNCLElBQXRCO0FBQ0EsVUFBRyxLQUFLLGVBQUwsQ0FBcUIsSUFBckIsS0FBOEIsZUFBakMsRUFBaUQ7QUFDL0MsYUFBSyxlQUFMLENBQXFCLElBQXJCO0FBQ0Q7QUFDRixLQUxEOztBQU9BLG1CQUFhLElBQUksR0FBSixDQUFR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QixTQUFTLFFBRlEsQ0FBbkIsQ0FEUTtBQURVLEtBQWYsQ0FBUDtBQVFEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gdnVlX3NldHRpbmcobWFwLHZlY3RvckxheWVyLG9wdGlvbnMpe1xuICB2YXIgbGF0bG5nSW5wdXRzO1xuICB2YXIgZHJhdztcbiAgdmFyIGNsaWNrX2FjdGlvbnMgPSBbe1xuICAgIGxhYmVsOiBcIk5vbmVcIixcbiAgICBmdW5jOiBmdW5jdGlvbigpe1xuICAgIH1cbiAgfSx7XG4gICAgbGFiZWw6IFwiU2V0IE5vdyBQbGFjZVwiLFxuICAgIGZ1bmM6IGZ1bmN0aW9uKGUpe1xuICAgICAgdmFyIGxvbmxhdD1vbC5wcm9qLnRvTG9uTGF0KGUuY29vcmRpbmF0ZSk7XG4gICAgICBsYXRsbmdJbnB1dHMuJGRhdGEucG9zaXRpb24ubG9uZ2l0dWRlPWxvbmxhdFswXTtcbiAgICAgIGxhdGxuZ0lucHV0cy4kZGF0YS5wb3NpdGlvbi5sYXRpdHVkZT1sb25sYXRbMV07XG4gICAgfVxuICB9LHtcbiAgICBsYWJlbDogXCJEcmF3IExpbmVcIixcbiAgICB0eXBlOiBcIndoZW5fc2VsZWN0ZWRcIixcbiAgICBmdW5jOiBmdW5jdGlvbigpe1xuICAgICAgZHJhdyA9IG5ldyBvbC5pbnRlcmFjdGlvbi5EcmF3KHtcbiAgICAgICAgc291cmNlOiB2ZWN0b3JMYXllci5nZXRTb3VyY2UoKSxcbiAgICAgICAgdHlwZTogXCJMaW5lU3RyaW5nXCJcbiAgICAgIH0pO1xuICAgICAgbWFwLmFkZEludGVyYWN0aW9uKGRyYXcpO1xuICAgIH1cbiAgfV07XG5cbiAgdmFyIHNlbGVjdGVkSGFuZGxlciA9IGZ1bmN0aW9uKCl7XG4gICAgbWFwLnJlbW92ZUludGVyYWN0aW9uKGRyYXcpO1xuICAgIGlmKHRoaXMuc2VsZWN0ZWRfYWN0aW9uLnR5cGUgPT09IFwid2hlbl9zZWxlY3RlZFwiKXtcbiAgICAgIHRoaXMuc2VsZWN0ZWRfYWN0aW9uLmZ1bmMoKTtcbiAgICB9XG4gIH1cblxuICBsYXRsbmdJbnB1dHM9bmV3IFZ1ZSh7XG4gICAgZWw6IFwiI2Zvcm1zXCIsXG4gICAgZGF0YToge1xuICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgbGF0aXR1ZGU6IDAsXG4gICAgICAgIGxvbmdpdHVkZTogMFxuICAgICAgfSxcbiAgICAgIHNlbGVjdGVkX2FjdGlvbjogY2xpY2tfYWN0aW9uc1swXSxcbiAgICAgIGNsaWNrX2FjdGlvbnM6IGNsaWNrX2FjdGlvbnMsXG4gICAgICBzdGF0dXM6IFwiXCJcbiAgICB9LFxuICAgIG1ldGhvZHM6IHtcbiAgICAgIHNldEZyb21Ob3dQbGFjZTogZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICBldmVudC50YXJnZXQuZGlzYWJsZWQ9dHJ1ZTtcbiAgICAgICAgZXZlbnQudGFyZ2V0LnRleHRDb250ZW50PVwiTG9hZGluZy4uLlwiO1xuICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKChwb3NpdGlvbik9PntcbiAgICAgICAgICB0aGlzLiRkYXRhLnBvc2l0aW9uLmxhdGl0dWRlPXBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZTtcbiAgICAgICAgICB0aGlzLiRkYXRhLnBvc2l0aW9uLmxvbmdpdHVkZT1wb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlO1xuICAgICAgICAgIGV2ZW50LnRhcmdldC50ZXh0Q29udGVudD1cIlNldCBub3cgUG9zaXRpb25cIjtcbiAgICAgICAgICBldmVudC50YXJnZXQuZGlzYWJsZWQ9ZmFsc2U7XG4gICAgICAgIH0sKGVycm9yKT0+e1xuICAgICAgICAgIHRoaXMuJGRhdGEuc3RhdHVzPVwiRVJST1ItXCIrZXJyb3IuY29kZStcIjogXCIrZXJyb3IubWVzc2FnZTtcbiAgICAgICAgICBldmVudC50YXJnZXQudGV4dENvbnRlbnQ9XCJTZXQgbm93IFBvc2l0aW9uXCI7XG4gICAgICAgICAgZXZlbnQudGFyZ2V0LmRpc2FibGVkPWZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBjaGVja0dlb2xvY2F0aW9uOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gIShcImdlb2xvY2F0aW9uXCIgaW4gbmF2aWdhdG9yKTtcbiAgICAgIH0sXG4gICAgICBnb1RvOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgcG9zPXRoaXMuJGRhdGEucG9zaXRpb247XG4gICAgICAgIG1hcC5nZXRWaWV3KCkuc2V0Q2VudGVyKFxuICAgICAgICAgIG9sLnByb2ouZnJvbUxvbkxhdChbcG9zLmxvbmdpdHVkZSwgcG9zLmxhdGl0dWRlXSlcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgICBhZGRGYXZvcml0ZVBsYWNlOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbGlzdD1KU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwib2x0ZXN0LmZhdm9saXRlcGxhY2VcIikpIHx8IFtdO1xuICAgICAgICBsaXN0LnB1c2goW1xuICAgICAgICAgIHRoaXMuJGRhdGEucG9zaXRpb24ubG9uZ2l0dWRlLFxuICAgICAgICAgIHRoaXMuJGRhdGEucG9zaXRpb24ubGF0aXR1ZGVcbiAgICAgICAgXSk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwib2x0ZXN0LmZhdm9saXRlcGxhY2VcIixKU09OLnN0cmluZ2lmeShsaXN0KSk7XG4gICAgICAgIGNvbnNvbGUubG9nKGxpc3QpO1xuICAgICAgfSxcbiAgICAgIHNldFBhcmFtV2hlbkFjdENoYW5nZWQ6IHNlbGVjdGVkSGFuZGxlclxuICAgIH1cbiAgfSk7XG5cbiAgbWFwLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG4gICAgaWYodHlwZW9mKGxhdGxuZ0lucHV0cy4kZGF0YS5zZWxlY3RlZF9hY3Rpb24udHlwZSkgPT09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgbGF0bG5nSW5wdXRzLiRkYXRhLnNlbGVjdGVkX2FjdGlvbi5mdW5jKGUpO1xuICAgIH1cbiAgfSk7XG5cbiAgd2luZG93LmxhdGxuZ0lucHV0cz1sYXRsbmdJbnB1dHM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHZ1ZV9zZXR0aW5nO1xuIiwiLyoqXG4gKiDjg5Hjg6njg6Hjg7zjgr/lhaXlipvjg5Xjgqnjg7zjg6Djgajlrp/ooYzjga7oqK3lrprjgpLov5TjgZnplqLmlbBcbiAqIEBwYXJhbSBvbCBPcGVuTGF5ZXIzIOOBruOCquODluOCuOOCp+OCr+ODiFxuICogQHBhcmFtIG1hcCDooajnpLrnlKjjga5NYXDjgqrjg5bjgrjjgqfjgq/jg4hcbiAqL1xuZnVuY3Rpb24gZ2V0T3B0aW9ucyhvbCxtYXApe1xuICB2YXIgb3B0aW9ucyA9IHtcbiAgICBMYXRMb25nQ29udHJvbGxlcjoge1xuICAgICAgc2V0Tm93UG9zaXRpb246IHtcbiAgICAgICAgZnVuYzogZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgIGV2ZW50LnRhcmdldC5kaXNhYmxlZD10cnVlO1xuICAgICAgICAgIGV2ZW50LnRhcmdldC50ZXh0Q29udGVudD1cIkxvYWRpbmcuLi5cIjtcbiAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzKTtcbiAgICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uKHBvc2l0aW9uKXtcbiAgICAgICAgICAgIHRoaXMuJGRhdGEucG9zaXRpb24ubGF0aXR1ZGU9cG9zaXRpb24uY29vcmRzLmxhdGl0dWRlO1xuICAgICAgICAgICAgdGhpcy4kZGF0YS5wb3NpdGlvbi5sb25naXR1ZGU9cG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZTtcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC50ZXh0Q29udGVudD1cIlNldCBOb3cgUG9zaXRpb25cIjtcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC5kaXNhYmxlZD1mYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgaXNFbmFibGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuICEoXCJnZW9sb2NhdGlvblwiIGluIG5hdmlnYXRvcik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBnb1RvOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgcG9zPXRoaXMuJGRhdGEucG9zaXRpb247XG4gICAgICAgIG1hcC5nZXRWaWV3KCkuc2V0Q2VudGVyKFxuICAgICAgICAgIG9sLnByb2ouZnJvbUxvbkxhdChbcG9zLmxvbmdpdHVkZSwgcG9zLmxhdGl0dWRlXSlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldE9wdGlvbnM7XG4iLCIvKiAgZXNsaW50IG5vLWNvbnNvbGU6IFwib2ZmXCIgKi9cbmltcG9ydCBnZXRPcHRzIGZyb20gXCJmb3JtX3NldHRpbmdzXCI7XG5pbXBvcnQgcmVuZGVyIGZyb20gXCJkb21fc2V0dGluZ3NcIjtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixmdW5jdGlvbigpe1xuICAvKlxuICB2YXIgbWVnYW5lTXVzZXVtPSBuZXcgb2wuRmVhdHVyZSh7XG4gICAgZ2VvbWV0cnk6IG5ldyBvbC5nZW9tLlBvaW50KG9sLnByb2ouZnJvbUxvbkxhdChbMTM2LjE5ODg0MjQsMzUuOTQyNzU1N10pKVxuICB9KTtcbiAgbWVnYW5lTXVzZXVtLnNldFN0eWxlKG5ldyBvbC5zdHlsZS5TdHlsZSh7XG4gICAgaW1hZ2U6IG5ldyBvbC5zdHlsZS5DaXJjbGUoe1xuICAgICAgcmFkaXVzOiA3LFxuICAgICAgc25hcFRvUGl4ZWw6IGZhbHNlLFxuICAgICAgZmlsbDogbmV3IG9sLnN0eWxlLkZpbGwoe2NvbG9yOiBcImJsYWNrXCJ9KSxcbiAgICAgIHN0cm9rZTogbmV3IG9sLnN0eWxlLlN0cm9rZSh7XG4gICAgICAgIGNvbG9yOiBcIndoaXRlXCIsIHdpZHRoOiAyXG4gICAgICB9KVxuICAgIH0pXG4gIH0pKTtcblxuICB2YXIgdmVjdG9yU291cmNlID0gbmV3IG9sLnNvdXJjZS5WZWN0b3Ioe1xuICAgIGZlYXR1cmVzOiBbbWVnYW5lTXVzZXVtXVxuICB9KTtcbiAqL1xuXG4gIHZhciB2ZWN0b3JMYXlvciA9IG5ldyBvbC5sYXllci5WZWN0b3Ioe1xuICAgIHNvdXJjZTogbmV3IG9sLnNvdXJjZS5WZWN0b3IoKVxuICB9KTtcbiAgdmFyIHZpZXcgPSBuZXcgb2wuVmlldyh7XG4gICAgY2VudGVyOiBvbC5wcm9qLmZyb21Mb25MYXQoWzEzOS43NTI4LDM1LjY4NTE3NV0pLFxuICAgIHpvb206IDE0XG4gIH0pO1xuXG4gIHZhciBtYXA9bmV3IG9sLk1hcCh7XG4gICAgdGFyZ2V0OiBcIm1hcFwiLFxuICAgIGxheWVyczogW1xuICAgICAgbmV3IG9sLmxheWVyLlRpbGUoeyBzb3VyY2U6IG5ldyBvbC5zb3VyY2UuT1NNKCkgfSksXG4gICAgICB2ZWN0b3JMYXlvclxuICAgIF0sXG4gICAgdmlldzogdmlld1xuICB9KTtcblxuICB2YXIgb3B0aW9ucz1nZXRPcHRzKG9sLG1hcCk7XG4gIHJlbmRlcihtYXAsdmVjdG9yTGF5b3Isb3B0aW9ucyk7XG5cbiAgLy8g5pyA5Yid44Gu5pmC44Gu44G/54++5Zyo5Zyw44KS5Lit5aSu44Gr44GZ44KL44KI44GG44Gr44GZ44KLXG4gIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oIChwb3NpdGlvbikgPT4ge1xuICAgIHZpZXcuc2V0Q2VudGVyKFxuICAgICAgb2wucHJvai5mcm9tTG9uTGF0KFtcbiAgICAgICAgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlXSkpO1xuICB9LCBlcnJvciA9PiB7XG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xuICB9KTtcblxuICBzZXRGaWxlRXZlbnRzKCk7XG5cbiAgd2luZG93Lm1hcD1tYXA7XG4gIHdpbmRvdy52ZWN0b3JMYXlvcj12ZWN0b3JMYXlvcjtcbn0pO1xuXG5mdW5jdGlvbiBoYW5kbGVEcmFnT3ZlcihlKXtcbiAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBlLmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0PVwiY29weVwiO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVGaWxlU2VsZWN0KGUpe1xuICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgdmFyIGZpbGVzPWUuZGF0YVRyYW5zZmVyLmZpbGVzO1xuICBjb25zb2xlLmxvZyhmaWxlcyk7XG4gIGFkZFBvaW50c0Zyb21GaWxlcyhmaWxlcyk7XG59XG5cbmZ1bmN0aW9uIHNldEZpbGVFdmVudHMoKXtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsaGFuZGxlRHJhZ092ZXIsZmFsc2UpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLGhhbmRsZUZpbGVTZWxlY3QsZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBhZGRQb2ludHNGcm9tRmlsZXMoZmlsZXMpe1xuICBmb3IodmFyIGk9MDtpPGZpbGVzLmxlbmd0aDtpKyspe1xuICAgIGxldCBmaWxlPWZpbGVzW2ldO1xuICAgIGlmIChmaWxlLnR5cGUgIT0gXCJhcHBsaWNhdGlvbi9qc29uXCIpe1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICByZWFkZXIub25sb2FkPSBmdW5jdGlvbihlKXtcbiAgICAgIHZhciByZXN1bHRzPUpTT04ucGFyc2UoZS50YXJnZXQucmVzdWx0KTtcbiAgICAgIHJlc3VsdHMucG9zaXRpb25zLmZvckVhY2gocG9zID0+IHtcbiAgICAgICAgdmFyIGZlYXR1cmU9ZmVhdHVyZUZhY3RvcnkocG9zKTtcbiAgICAgICAgd2luZG93LnZlY3RvckxheW9yLmdldFNvdXJjZSgpLmFkZEZlYXR1cmUoZmVhdHVyZSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZlYXR1cmVGYWN0b3J5KHBvc19kYXRhKXtcbiAgdmFyIGVhcnRoUmFkaXVzID0gNjM3ODEzNzsgLy8gW21dXG4gIHZhciB3Z3M4NFNwaGVyZSA9IG5ldyBvbC5TcGhlcmUoZWFydGhSYWRpdXMpO1xuICBpZihcInJhZGl1c1wiIGluIHBvc19kYXRhKXtcbiAgICBsZXQgY2lyY2xlID0gb2wuZ2VvbS5Qb2x5Z29uLmNpcmN1bGFyKFxuICAgICAgd2dzODRTcGhlcmUsXG4gICAgICBbXG4gICAgICAgIHBvc19kYXRhLmxvbmdpdHVkZSxcbiAgICAgICAgcG9zX2RhdGEubGF0aXR1ZGVcbiAgICAgIF0sXG4gICAgICBwb3NfZGF0YS5yYWRpdXMsXG4gICAgICA2NFxuICAgICkudHJhbnNmb3JtKFwiRVBTRzo0MzI2XCIsIFwiRVBTRzozODU3XCIpO1xuICAgIHJldHVybiBuZXcgb2wuRmVhdHVyZShjaXJjbGUpO1xuICB9XG4gIHJldHVybiBuZXcgb2wuRmVhdHVyZSh7XG4gICAgZ2VvbWV0cnk6IG5ldyBvbC5nZW9tLlBvaW50KFxuICAgICAgb2wucHJvai5mcm9tTG9uTGF0KFtcbiAgICAgICAgcG9zX2RhdGEubG9uZ2l0dWRlLFxuICAgICAgICBwb3NfZGF0YS5sYXRpdHVkZVxuICAgICAgXSlcbiAgICApXG4gIH0pO1xufVxuIl19
