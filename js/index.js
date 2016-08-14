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
          console.log(feature);
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
    if (Array.isArray(pos_data)) {
      var coordinate_array = pos_data.map(function (coordinate) {
        return [coordinate.latitude, coordinate.longitude];
      });

      var line = new ol.geom.MultiLineString(coordinate_array);

      return new ol.Feature(line.transform("EPSG:4326", "EPSG:3857"));
    }
    return new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([pos_data.longitude, pos_data.latitude]))
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvbV9zZXR0aW5ncy5qcyIsImZvcm1fc2V0dGluZ3MuanMiLCJpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxXQUFTLFdBQVQsQ0FBcUIsR0FBckIsRUFBeUIsV0FBekIsRUFBcUMsT0FBckMsRUFBNkM7QUFDM0MsUUFBSSxZQUFKO0FBQ0EsUUFBSSxJQUFKO0FBQ0EsUUFBSSxnQkFBZ0IsQ0FBQztBQUNuQixhQUFPLE1BRFk7QUFFbkIsWUFBTSxnQkFBVSxDQUNmO0FBSGtCLEtBQUQsRUFJbEI7QUFDQSxhQUFPLGVBRFA7QUFFQSxZQUFNLGNBQVMsQ0FBVCxFQUFXO0FBQ2YsWUFBSSxTQUFPLEdBQUcsSUFBSCxDQUFRLFFBQVIsQ0FBaUIsRUFBRSxVQUFuQixDQUFYO0FBQ0EscUJBQWEsS0FBYixDQUFtQixRQUFuQixDQUE0QixTQUE1QixHQUFzQyxPQUFPLENBQVAsQ0FBdEM7QUFDQSxxQkFBYSxLQUFiLENBQW1CLFFBQW5CLENBQTRCLFFBQTVCLEdBQXFDLE9BQU8sQ0FBUCxDQUFyQztBQUNEO0FBTkQsS0FKa0IsRUFXbEI7QUFDQSxhQUFPLFdBRFA7QUFFQSxZQUFNLGVBRk47QUFHQSxZQUFNLGdCQUFVO0FBQ2QsZUFBTyxJQUFJLEdBQUcsV0FBSCxDQUFlLElBQW5CLENBQXdCO0FBQzdCLGtCQUFRLFlBQVksU0FBWixFQURxQjtBQUU3QixnQkFBTTtBQUZ1QixTQUF4QixDQUFQO0FBSUEsWUFBSSxjQUFKLENBQW1CLElBQW5CO0FBQ0Q7QUFURCxLQVhrQixDQUFwQjs7QUF1QkEsUUFBSSxrQkFBa0IsU0FBbEIsZUFBa0IsR0FBVTtBQUM5QixVQUFJLGlCQUFKLENBQXNCLElBQXRCO0FBQ0EsVUFBRyxLQUFLLGVBQUwsQ0FBcUIsSUFBckIsS0FBOEIsZUFBakMsRUFBaUQ7QUFDL0MsYUFBSyxlQUFMLENBQXFCLElBQXJCO0FBQ0Q7QUFDRixLQUxEOztBQU9BLG1CQUFhLElBQUksR0FBSixDQUFR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QVcsUUFBWixFQUFzQixXQUFXLFNBQWpDLENBRG1DO0FBQUEsT0FBZCxDQUF2Qjs7QUFJQSxVQUFJLE9BQU8sSUFBSSxHQUFHLElBQUgsQ0FBUSxlQUFaLENBQTRCLGdCQUE1QixDQUFYOztBQUVBLGFBQU8sSUFBSSxHQUFHLE9BQVAsQ0FBZSxLQUFLLFNBQUwsQ0FBZSxXQUFmLEVBQTRCLFdBQTVCLENBQWYsQ0FBUDtBQUNEO0FBQ0QsV0FBTyxJQUFJLEdBQUcsT0FBUCxDQUFlO0FBQ3BCLGdCQUFVLElBQUksR0FBRyxJQUFILENBQVEsS0FBWixDQUNSLEdBQUcsSUFBSCxDQUFRLFVBQVIsQ0FBbUIsQ0FDakIsU0FBUyxTQURRLEVBRWpCLFNBQVMsUUFGUSxDQUFuQixDQURRO0FBRFUsS0FBZixDQUFQO0FBUUQiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiB2dWVfc2V0dGluZyhtYXAsdmVjdG9yTGF5ZXIsb3B0aW9ucyl7XG4gIHZhciBsYXRsbmdJbnB1dHM7XG4gIHZhciBkcmF3O1xuICB2YXIgY2xpY2tfYWN0aW9ucyA9IFt7XG4gICAgbGFiZWw6IFwiTm9uZVwiLFxuICAgIGZ1bmM6IGZ1bmN0aW9uKCl7XG4gICAgfVxuICB9LHtcbiAgICBsYWJlbDogXCJTZXQgTm93IFBsYWNlXCIsXG4gICAgZnVuYzogZnVuY3Rpb24oZSl7XG4gICAgICB2YXIgbG9ubGF0PW9sLnByb2oudG9Mb25MYXQoZS5jb29yZGluYXRlKTtcbiAgICAgIGxhdGxuZ0lucHV0cy4kZGF0YS5wb3NpdGlvbi5sb25naXR1ZGU9bG9ubGF0WzBdO1xuICAgICAgbGF0bG5nSW5wdXRzLiRkYXRhLnBvc2l0aW9uLmxhdGl0dWRlPWxvbmxhdFsxXTtcbiAgICB9XG4gIH0se1xuICAgIGxhYmVsOiBcIkRyYXcgTGluZVwiLFxuICAgIHR5cGU6IFwid2hlbl9zZWxlY3RlZFwiLFxuICAgIGZ1bmM6IGZ1bmN0aW9uKCl7XG4gICAgICBkcmF3ID0gbmV3IG9sLmludGVyYWN0aW9uLkRyYXcoe1xuICAgICAgICBzb3VyY2U6IHZlY3RvckxheWVyLmdldFNvdXJjZSgpLFxuICAgICAgICB0eXBlOiBcIkxpbmVTdHJpbmdcIlxuICAgICAgfSk7XG4gICAgICBtYXAuYWRkSW50ZXJhY3Rpb24oZHJhdyk7XG4gICAgfVxuICB9XTtcblxuICB2YXIgc2VsZWN0ZWRIYW5kbGVyID0gZnVuY3Rpb24oKXtcbiAgICBtYXAucmVtb3ZlSW50ZXJhY3Rpb24oZHJhdyk7XG4gICAgaWYodGhpcy5zZWxlY3RlZF9hY3Rpb24udHlwZSA9PT0gXCJ3aGVuX3NlbGVjdGVkXCIpe1xuICAgICAgdGhpcy5zZWxlY3RlZF9hY3Rpb24uZnVuYygpO1xuICAgIH1cbiAgfVxuXG4gIGxhdGxuZ0lucHV0cz1uZXcgVnVlKHtcbiAgICBlbDogXCIjZm9ybXNcIixcbiAgICBkYXRhOiB7XG4gICAgICBwb3NpdGlvbjoge1xuICAgICAgICBsYXRpdHVkZTogMCxcbiAgICAgICAgbG9uZ2l0dWRlOiAwXG4gICAgICB9LFxuICAgICAgc2VsZWN0ZWRfYWN0aW9uOiBjbGlja19hY3Rpb25zWzBdLFxuICAgICAgY2xpY2tfYWN0aW9uczogY2xpY2tfYWN0aW9ucyxcbiAgICAgIHN0YXR1czogXCJcIlxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgc2V0RnJvbU5vd1BsYWNlOiBmdW5jdGlvbihldmVudCl7XG4gICAgICAgIGV2ZW50LnRhcmdldC5kaXNhYmxlZD10cnVlO1xuICAgICAgICBldmVudC50YXJnZXQudGV4dENvbnRlbnQ9XCJMb2FkaW5nLi4uXCI7XG4gICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oKHBvc2l0aW9uKT0+e1xuICAgICAgICAgIHRoaXMuJGRhdGEucG9zaXRpb24ubGF0aXR1ZGU9cG9zaXRpb24uY29vcmRzLmxhdGl0dWRlO1xuICAgICAgICAgIHRoaXMuJGRhdGEucG9zaXRpb24ubG9uZ2l0dWRlPXBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGU7XG4gICAgICAgICAgZXZlbnQudGFyZ2V0LnRleHRDb250ZW50PVwiU2V0IG5vdyBQb3NpdGlvblwiO1xuICAgICAgICAgIGV2ZW50LnRhcmdldC5kaXNhYmxlZD1mYWxzZTtcbiAgICAgICAgfSwoZXJyb3IpPT57XG4gICAgICAgICAgdGhpcy4kZGF0YS5zdGF0dXM9XCJFUlJPUi1cIitlcnJvci5jb2RlK1wiOiBcIitlcnJvci5tZXNzYWdlO1xuICAgICAgICAgIGV2ZW50LnRhcmdldC50ZXh0Q29udGVudD1cIlNldCBub3cgUG9zaXRpb25cIjtcbiAgICAgICAgICBldmVudC50YXJnZXQuZGlzYWJsZWQ9ZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGNoZWNrR2VvbG9jYXRpb246IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiAhKFwiZ2VvbG9jYXRpb25cIiBpbiBuYXZpZ2F0b3IpO1xuICAgICAgfSxcbiAgICAgIGdvVG86IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBwb3M9dGhpcy4kZGF0YS5wb3NpdGlvbjtcbiAgICAgICAgbWFwLmdldFZpZXcoKS5zZXRDZW50ZXIoXG4gICAgICAgICAgb2wucHJvai5mcm9tTG9uTGF0KFtwb3MubG9uZ2l0dWRlLCBwb3MubGF0aXR1ZGVdKVxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgIGFkZEZhdm9yaXRlUGxhY2U6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBsaXN0PUpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJvbHRlc3QuZmF2b2xpdGVwbGFjZVwiKSkgfHwgW107XG4gICAgICAgIGxpc3QucHVzaChbXG4gICAgICAgICAgdGhpcy4kZGF0YS5wb3NpdGlvbi5sb25naXR1ZGUsXG4gICAgICAgICAgdGhpcy4kZGF0YS5wb3NpdGlvbi5sYXRpdHVkZVxuICAgICAgICBdKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJvbHRlc3QuZmF2b2xpdGVwbGFjZVwiLEpTT04uc3RyaW5naWZ5KGxpc3QpKTtcbiAgICAgICAgY29uc29sZS5sb2cobGlzdCk7XG4gICAgICB9LFxuICAgICAgc2V0UGFyYW1XaGVuQWN0Q2hhbmdlZDogc2VsZWN0ZWRIYW5kbGVyXG4gICAgfVxuICB9KTtcblxuICBtYXAub24oXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcbiAgICBpZih0eXBlb2YobGF0bG5nSW5wdXRzLiRkYXRhLnNlbGVjdGVkX2FjdGlvbi50eXBlKSA9PT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICBsYXRsbmdJbnB1dHMuJGRhdGEuc2VsZWN0ZWRfYWN0aW9uLmZ1bmMoZSk7XG4gICAgfVxuICB9KTtcblxuICB3aW5kb3cubGF0bG5nSW5wdXRzPWxhdGxuZ0lucHV0cztcbn1cblxuZXhwb3J0IGRlZmF1bHQgdnVlX3NldHRpbmc7XG4iLCIvKipcbiAqIOODkeODqeODoeODvOOCv+WFpeWKm+ODleOCqeODvOODoOOBqOWun+ihjOOBruioreWumuOCkui/lOOBmemWouaVsFxuICogQHBhcmFtIG9sIE9wZW5MYXllcjMg44Gu44Kq44OW44K444Kn44Kv44OIXG4gKiBAcGFyYW0gbWFwIOihqOekuueUqOOBrk1hcOOCquODluOCuOOCp+OCr+ODiFxuICovXG5mdW5jdGlvbiBnZXRPcHRpb25zKG9sLG1hcCl7XG4gIHZhciBvcHRpb25zID0ge1xuICAgIExhdExvbmdDb250cm9sbGVyOiB7XG4gICAgICBzZXROb3dQb3NpdGlvbjoge1xuICAgICAgICBmdW5jOiBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgZXZlbnQudGFyZ2V0LmRpc2FibGVkPXRydWU7XG4gICAgICAgICAgZXZlbnQudGFyZ2V0LnRleHRDb250ZW50PVwiTG9hZGluZy4uLlwiO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24ocG9zaXRpb24pe1xuICAgICAgICAgICAgdGhpcy4kZGF0YS5wb3NpdGlvbi5sYXRpdHVkZT1wb3NpdGlvbi5jb29yZHMubGF0aXR1ZGU7XG4gICAgICAgICAgICB0aGlzLiRkYXRhLnBvc2l0aW9uLmxvbmdpdHVkZT1wb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlO1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnRleHRDb250ZW50PVwiU2V0IE5vdyBQb3NpdGlvblwiO1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LmRpc2FibGVkPWZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBpc0VuYWJsZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gIShcImdlb2xvY2F0aW9uXCIgaW4gbmF2aWdhdG9yKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGdvVG86IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBwb3M9dGhpcy4kZGF0YS5wb3NpdGlvbjtcbiAgICAgICAgbWFwLmdldFZpZXcoKS5zZXRDZW50ZXIoXG4gICAgICAgICAgb2wucHJvai5mcm9tTG9uTGF0KFtwb3MubG9uZ2l0dWRlLCBwb3MubGF0aXR1ZGVdKVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICByZXR1cm4gb3B0aW9ucztcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0T3B0aW9ucztcbiIsIi8qICBlc2xpbnQgbm8tY29uc29sZTogXCJvZmZcIiAqL1xuaW1wb3J0IGdldE9wdHMgZnJvbSBcImZvcm1fc2V0dGluZ3NcIjtcbmltcG9ydCByZW5kZXIgZnJvbSBcImRvbV9zZXR0aW5nc1wiO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGZ1bmN0aW9uKCl7XG4gIC8qXG4gIHZhciBtZWdhbmVNdXNldW09IG5ldyBvbC5GZWF0dXJlKHtcbiAgICBnZW9tZXRyeTogbmV3IG9sLmdlb20uUG9pbnQob2wucHJvai5mcm9tTG9uTGF0KFsxMzYuMTk4ODQyNCwzNS45NDI3NTU3XSkpXG4gIH0pO1xuICBtZWdhbmVNdXNldW0uc2V0U3R5bGUobmV3IG9sLnN0eWxlLlN0eWxlKHtcbiAgICBpbWFnZTogbmV3IG9sLnN0eWxlLkNpcmNsZSh7XG4gICAgICByYWRpdXM6IDcsXG4gICAgICBzbmFwVG9QaXhlbDogZmFsc2UsXG4gICAgICBmaWxsOiBuZXcgb2wuc3R5bGUuRmlsbCh7Y29sb3I6IFwiYmxhY2tcIn0pLFxuICAgICAgc3Ryb2tlOiBuZXcgb2wuc3R5bGUuU3Ryb2tlKHtcbiAgICAgICAgY29sb3I6IFwid2hpdGVcIiwgd2lkdGg6IDJcbiAgICAgIH0pXG4gICAgfSlcbiAgfSkpO1xuXG4gIHZhciB2ZWN0b3JTb3VyY2UgPSBuZXcgb2wuc291cmNlLlZlY3Rvcih7XG4gICAgZmVhdHVyZXM6IFttZWdhbmVNdXNldW1dXG4gIH0pO1xuICovXG5cbiAgdmFyIHZlY3RvckxheW9yID0gbmV3IG9sLmxheWVyLlZlY3Rvcih7XG4gICAgc291cmNlOiBuZXcgb2wuc291cmNlLlZlY3RvcigpXG4gIH0pO1xuICB2YXIgdmlldyA9IG5ldyBvbC5WaWV3KHtcbiAgICBjZW50ZXI6IG9sLnByb2ouZnJvbUxvbkxhdChbMTM5Ljc1MjgsMzUuNjg1MTc1XSksXG4gICAgem9vbTogMTRcbiAgfSk7XG5cbiAgdmFyIG1hcD1uZXcgb2wuTWFwKHtcbiAgICB0YXJnZXQ6IFwibWFwXCIsXG4gICAgbGF5ZXJzOiBbXG4gICAgICBuZXcgb2wubGF5ZXIuVGlsZSh7IHNvdXJjZTogbmV3IG9sLnNvdXJjZS5PU00oKSB9KSxcbiAgICAgIHZlY3RvckxheW9yXG4gICAgXSxcbiAgICB2aWV3OiB2aWV3XG4gIH0pO1xuXG4gIHZhciBvcHRpb25zPWdldE9wdHMob2wsbWFwKTtcbiAgcmVuZGVyKG1hcCx2ZWN0b3JMYXlvcixvcHRpb25zKTtcblxuICAvLyDmnIDliJ3jga7mmYLjga7jgb/nj77lnKjlnLDjgpLkuK3lpK7jgavjgZnjgovjgojjgYbjgavjgZnjgotcbiAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbiggKHBvc2l0aW9uKSA9PiB7XG4gICAgdmlldy5zZXRDZW50ZXIoXG4gICAgICBvbC5wcm9qLmZyb21Mb25MYXQoW1xuICAgICAgICBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlLFxuICAgICAgICBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGVdKSk7XG4gIH0sIGVycm9yID0+IHtcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gIH0pO1xuXG4gIHNldEZpbGVFdmVudHMoKTtcblxuICB3aW5kb3cubWFwPW1hcDtcbiAgd2luZG93LnZlY3RvckxheW9yPXZlY3RvckxheW9yO1xufSk7XG5cbmZ1bmN0aW9uIGhhbmRsZURyYWdPdmVyKGUpe1xuICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3Q9XCJjb3B5XCI7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUZpbGVTZWxlY3QoZSl7XG4gIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIGUucHJldmVudERlZmF1bHQoKTtcblxuICB2YXIgZmlsZXM9ZS5kYXRhVHJhbnNmZXIuZmlsZXM7XG4gIGNvbnNvbGUubG9nKGZpbGVzKTtcbiAgYWRkUG9pbnRzRnJvbUZpbGVzKGZpbGVzKTtcbn1cblxuZnVuY3Rpb24gc2V0RmlsZUV2ZW50cygpe1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIixoYW5kbGVEcmFnT3ZlcixmYWxzZSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsaGFuZGxlRmlsZVNlbGVjdCxmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIGFkZFBvaW50c0Zyb21GaWxlcyhmaWxlcyl7XG4gIGZvcih2YXIgaT0wO2k8ZmlsZXMubGVuZ3RoO2krKyl7XG4gICAgbGV0IGZpbGU9ZmlsZXNbaV07XG4gICAgaWYgKGZpbGUudHlwZSAhPSBcImFwcGxpY2F0aW9uL2pzb25cIil7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIHJlYWRlci5vbmxvYWQ9IGZ1bmN0aW9uKGUpe1xuICAgICAgdmFyIHJlc3VsdHM9SlNPTi5wYXJzZShlLnRhcmdldC5yZXN1bHQpO1xuICAgICAgcmVzdWx0cy5wb3NpdGlvbnMuZm9yRWFjaChwb3MgPT4ge1xuICAgICAgICB2YXIgZmVhdHVyZT1mZWF0dXJlRmFjdG9yeShwb3MpO1xuICAgICAgICBjb25zb2xlLmxvZyhmZWF0dXJlKTtcbiAgICAgICAgd2luZG93LnZlY3RvckxheW9yLmdldFNvdXJjZSgpLmFkZEZlYXR1cmUoZmVhdHVyZSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZlYXR1cmVGYWN0b3J5KHBvc19kYXRhKXtcbiAgdmFyIGVhcnRoUmFkaXVzID0gNjM3ODEzNzsgLy8gW21dXG4gIHZhciB3Z3M4NFNwaGVyZSA9IG5ldyBvbC5TcGhlcmUoZWFydGhSYWRpdXMpO1xuICBpZihcInJhZGl1c1wiIGluIHBvc19kYXRhKXtcbiAgICBsZXQgY2lyY2xlID0gb2wuZ2VvbS5Qb2x5Z29uLmNpcmN1bGFyKFxuICAgICAgd2dzODRTcGhlcmUsXG4gICAgICBbXG4gICAgICAgIHBvc19kYXRhLmxvbmdpdHVkZSxcbiAgICAgICAgcG9zX2RhdGEubGF0aXR1ZGVcbiAgICAgIF0sXG4gICAgICBwb3NfZGF0YS5yYWRpdXMsXG4gICAgICA2NFxuICAgICkudHJhbnNmb3JtKFwiRVBTRzo0MzI2XCIsIFwiRVBTRzozODU3XCIpO1xuICAgIHJldHVybiBuZXcgb2wuRmVhdHVyZShjaXJjbGUpO1xuICB9XG4gIGlmKEFycmF5LmlzQXJyYXkocG9zX2RhdGEpKXtcbiAgICBsZXQgY29vcmRpbmF0ZV9hcnJheSA9IHBvc19kYXRhLm1hcCggY29vcmRpbmF0ZSA9PlxuICAgICAgW2Nvb3JkaW5hdGUubGF0aXR1ZGUsIGNvb3JkaW5hdGUubG9uZ2l0dWRlXVxuICAgICk7XG5cbiAgICBsZXQgbGluZSA9IG5ldyBvbC5nZW9tLk11bHRpTGluZVN0cmluZyhjb29yZGluYXRlX2FycmF5KTtcblxuICAgIHJldHVybiBuZXcgb2wuRmVhdHVyZShsaW5lLnRyYW5zZm9ybShcIkVQU0c6NDMyNlwiLCBcIkVQU0c6Mzg1N1wiKSk7XG4gIH1cbiAgcmV0dXJuIG5ldyBvbC5GZWF0dXJlKHtcbiAgICBnZW9tZXRyeTogbmV3IG9sLmdlb20uUG9pbnQoXG4gICAgICBvbC5wcm9qLmZyb21Mb25MYXQoW1xuICAgICAgICBwb3NfZGF0YS5sb25naXR1ZGUsXG4gICAgICAgIHBvc19kYXRhLmxhdGl0dWRlXG4gICAgICBdKVxuICAgIClcbiAgfSk7XG59XG4iXX0=
