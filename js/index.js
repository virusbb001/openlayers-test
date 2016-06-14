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
  function vue_setting(map, options) {
    var latlngInputs;
    var click_actions = [{
      label: "None",
      func: function func(e) {}
    }, {
      label: "Set Now Place",
      func: function func(e) {
        var lonlat = ol.proj.toLonLat(e.coordinate);
        if (latlngInputs.$data.flags.setWhenClicked) {
          latlngInputs.$data.position.longitude = lonlat[0];
          latlngInputs.$data.position.latitude = lonlat[1];
        }
      }
    }];

    latlngInputs = new Vue({
      el: "#forms",
      data: {
        position: {
          latitude: 0,
          longitude: 0
        },
        flags: {
          setWhenClicked: true
        },
        selected_action: click_actions[0].func,
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
          var lon = list.push([this.$data.position.longitude, this.$data.position.latitude]);
          localStorage.setItem("oltest.favoliteplace", JSON.stringify(list));
          console.log(list);
        }
      }
    });

    map.on("click", function (e) {
      latlngInputs.$data.selected_action(e);
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
    (0, _dom_settings2.default)(map, options);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvbV9zZXR0aW5ncy5qcyIsImZvcm1fc2V0dGluZ3MuanMiLCJpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxXQUFTLFdBQVQsQ0FBcUIsR0FBckIsRUFBeUIsT0FBekIsRUFBaUM7QUFDL0IsUUFBSSxZQUFKO0FBQ0EsUUFBSSxnQkFBZ0IsQ0FBQztBQUNuQixhQUFPLE1BRFk7QUFFbkIsWUFBTSxjQUFTLENBQVQsRUFBVyxDQUNoQjtBQUhrQixLQUFELEVBSWxCO0FBQ0EsYUFBTyxlQURQO0FBRUEsWUFBTSxjQUFTLENBQVQsRUFBVztBQUNmLFlBQUksU0FBTyxHQUFHLElBQUgsQ0FBUSxRQUFSLENBQWlCLEVBQUUsVUFBbkIsQ0FBWDtBQUNBLFlBQUcsYUFBYSxLQUFiLENBQW1CLEtBQW5CLENBQXlCLGNBQTVCLEVBQTJDO0FBQ3pDLHVCQUFhLEtBQWIsQ0FBbUIsUUFBbkIsQ0FBNEIsU0FBNUIsR0FBc0MsT0FBTyxDQUFQLENBQXRDO0FBQ0EsdUJBQWEsS0FBYixDQUFtQixRQUFuQixDQUE0QixRQUE1QixHQUFxQyxPQUFPLENBQVAsQ0FBckM7QUFDRDtBQUNGO0FBUkQsS0FKa0IsQ0FBcEI7O0FBZUEsbUJBQWEsSUFBSSxHQUFKLENBQVE7QUFDbkIsVUFBSSxRQURlO0FBRW5CLFlBQU07QUFDSixrQkFBVTtBQUNSLG9CQUFVLENBREY7QUFFUixxQkFBVztBQUZILFNBRE47QUFLSixlQUFPO0FBQ0wsMEJBQWdCO0FBRFgsU0FMSDtBQVFKLHlCQUFpQixjQUFjLENBQWQsRUFBaUIsSUFSOUI7QUFTSix1QkFBZSxhQVRYO0FBVUosZ0JBQVE7QUFWSixPQUZhO0FBY25CLGVBQVM7QUFDUCx5QkFBaUIseUJBQVMsS0FBVCxFQUFlO0FBQUE7O0FBQzlCLGdCQUFNLE1BQU4sQ0FBYSxRQUFiLEdBQXNCLElBQXRCO0FBQ0EsZ0JBQU0sTUFBTixDQUFhLFdBQWIsR0FBeUIsWUFBekI7QUFDQSxvQkFBVSxX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VUFBL0IsQ0FBMEMsT0FBMUM7QUFDRCxTQUhEO0FBSUQsT0FORDtBQU9BLGFBQU8sVUFBUCxDQUFrQixJQUFsQjtBQUNEO0FBQ0Y7O0FBRUQsV0FBUyxjQUFULENBQXdCLFFBQXhCLEVBQWlDO0FBQy9CLFFBQUksY0FBYyxPQUFsQjtBQUNBLFFBQUksY0FBYyxJQUFJLEdBQUcsTUFBUCxDQUFjLFdBQWQsQ0FBbEI7QUFDQSxRQUFHLFlBQVksUUFBZixFQUF3QjtBQUN0QixVQUFJLFNBQVMsR0FBRyxJQUFILENBQVEsT0FBUixDQUFnQixRQUFoQixDQUNYLFdBRFcsRUFFWCxDQUNFLFNBQVMsU0FEWCxFQUVFLFNBQVMsUUFGWCxDQUZXLEVBTVgsU0FBUyxNQU5FLEVBT1gsRUFQVyxFQVFYLFNBUlcsQ0FRRCxXQVJDLEVBUVksV0FSWixDQUFiO0FBU0EsYUFBTyxJQUFJLEdBQUcsT0FBUCxDQUFlLE1BQWYsQ0FBUDtBQUNEO0FBQ0QsV0FBTyxJQUFJLEdBQUcsT0FBUCxDQUFlO0FBQ3BCLGdCQUFVLElBQUksR0FBRyxJQUFILENBQVEsS0FBWixDQUNSLEdBQUcsSUFBSCxDQUFRLFVBQVIsQ0FBbUIsQ0FDakIsU0FBUyxTQURRLEVBRWpCLFNBQVMsUUFGUSxDQUFuQixDQURRO0FBRFUsS0FBZixDQUFQO0FBUUQiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiB2dWVfc2V0dGluZyhtYXAsb3B0aW9ucyl7XG4gIHZhciBsYXRsbmdJbnB1dHM7XG4gIHZhciBjbGlja19hY3Rpb25zID0gW3tcbiAgICBsYWJlbDogXCJOb25lXCIsXG4gICAgZnVuYzogZnVuY3Rpb24oZSl7XG4gICAgfVxuICB9LHtcbiAgICBsYWJlbDogXCJTZXQgTm93IFBsYWNlXCIsXG4gICAgZnVuYzogZnVuY3Rpb24oZSl7XG4gICAgICB2YXIgbG9ubGF0PW9sLnByb2oudG9Mb25MYXQoZS5jb29yZGluYXRlKTtcbiAgICAgIGlmKGxhdGxuZ0lucHV0cy4kZGF0YS5mbGFncy5zZXRXaGVuQ2xpY2tlZCl7XG4gICAgICAgIGxhdGxuZ0lucHV0cy4kZGF0YS5wb3NpdGlvbi5sb25naXR1ZGU9bG9ubGF0WzBdO1xuICAgICAgICBsYXRsbmdJbnB1dHMuJGRhdGEucG9zaXRpb24ubGF0aXR1ZGU9bG9ubGF0WzFdO1xuICAgICAgfVxuICAgIH1cbiAgfV07XG5cbiAgbGF0bG5nSW5wdXRzPW5ldyBWdWUoe1xuICAgIGVsOiBcIiNmb3Jtc1wiLFxuICAgIGRhdGE6IHtcbiAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgIGxhdGl0dWRlOiAwLFxuICAgICAgICBsb25naXR1ZGU6IDBcbiAgICAgIH0sXG4gICAgICBmbGFnczoge1xuICAgICAgICBzZXRXaGVuQ2xpY2tlZDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHNlbGVjdGVkX2FjdGlvbjogY2xpY2tfYWN0aW9uc1swXS5mdW5jLFxuICAgICAgY2xpY2tfYWN0aW9uczogY2xpY2tfYWN0aW9ucyxcbiAgICAgIHN0YXR1czogXCJcIlxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgc2V0RnJvbU5vd1BsYWNlOiBmdW5jdGlvbihldmVudCl7XG4gICAgICAgIGV2ZW50LnRhcmdldC5kaXNhYmxlZD10cnVlO1xuICAgICAgICBldmVudC50YXJnZXQudGV4dENvbnRlbnQ9XCJMb2FkaW5nLi4uXCI7XG4gICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oKHBvc2l0aW9uKT0+e1xuICAgICAgICAgIHRoaXMuJGRhdGEucG9zaXRpb24ubGF0aXR1ZGU9cG9zaXRpb24uY29vcmRzLmxhdGl0dWRlO1xuICAgICAgICAgIHRoaXMuJGRhdGEucG9zaXRpb24ubG9uZ2l0dWRlPXBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGU7XG4gICAgICAgICAgZXZlbnQudGFyZ2V0LnRleHRDb250ZW50PVwiU2V0IG5vdyBQb3NpdGlvblwiO1xuICAgICAgICAgIGV2ZW50LnRhcmdldC5kaXNhYmxlZD1mYWxzZTtcbiAgICAgICAgfSwoZXJyb3IpPT57XG4gICAgICAgICAgdGhpcy4kZGF0YS5zdGF0dXM9XCJFUlJPUi1cIitlcnJvci5jb2RlK1wiOiBcIitlcnJvci5tZXNzYWdlO1xuICAgICAgICAgIGV2ZW50LnRhcmdldC50ZXh0Q29udGVudD1cIlNldCBub3cgUG9zaXRpb25cIjtcbiAgICAgICAgICBldmVudC50YXJnZXQuZGlzYWJsZWQ9ZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGNoZWNrR2VvbG9jYXRpb246IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiAhKFwiZ2VvbG9jYXRpb25cIiBpbiBuYXZpZ2F0b3IpO1xuICAgICAgfSxcbiAgICAgIGdvVG86IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBwb3M9dGhpcy4kZGF0YS5wb3NpdGlvbjtcbiAgICAgICAgbWFwLmdldFZpZXcoKS5zZXRDZW50ZXIoXG4gICAgICAgICAgb2wucHJvai5mcm9tTG9uTGF0KFtwb3MubG9uZ2l0dWRlLCBwb3MubGF0aXR1ZGVdKVxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgIGFkZEZhdm9yaXRlUGxhY2U6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBsaXN0PUpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJvbHRlc3QuZmF2b2xpdGVwbGFjZVwiKSkgfHwgW107XG4gICAgICAgIHZhciBsb249XG4gICAgICAgIGxpc3QucHVzaChbXG4gICAgICAgICAgdGhpcy4kZGF0YS5wb3NpdGlvbi5sb25naXR1ZGUsXG4gICAgICAgICAgdGhpcy4kZGF0YS5wb3NpdGlvbi5sYXRpdHVkZVxuICAgICAgICBdKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJvbHRlc3QuZmF2b2xpdGVwbGFjZVwiLEpTT04uc3RyaW5naWZ5KGxpc3QpKTtcbiAgICAgICAgY29uc29sZS5sb2cobGlzdCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBtYXAub24oXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcbiAgICBsYXRsbmdJbnB1dHMuJGRhdGEuc2VsZWN0ZWRfYWN0aW9uKGUpO1xuICB9KTtcblxuICB3aW5kb3cubGF0bG5nSW5wdXRzPWxhdGxuZ0lucHV0cztcbn1cblxuZXhwb3J0IGRlZmF1bHQgdnVlX3NldHRpbmc7XG4iLCIvKipcbiAqIOODkeODqeODoeODvOOCv+WFpeWKm+ODleOCqeODvOODoOOBqOWun+ihjOOBruioreWumuOCkui/lOOBmemWouaVsFxuICogQHBhcmFtIG9sIE9wZW5MYXllcjMg44Gu44Kq44OW44K444Kn44Kv44OIXG4gKiBAcGFyYW0gbWFwIOihqOekuueUqOOBrk1hcOOCquODluOCuOOCp+OCr+ODiFxuICovXG5mdW5jdGlvbiBnZXRPcHRpb25zKG9sLG1hcCl7XG4gIHZhciBvcHRpb25zID0ge1xuICAgIExhdExvbmdDb250cm9sbGVyOiB7XG4gICAgICBzZXROb3dQb3NpdGlvbjoge1xuICAgICAgICBmdW5jOiBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgZXZlbnQudGFyZ2V0LmRpc2FibGVkPXRydWU7XG4gICAgICAgICAgZXZlbnQudGFyZ2V0LnRleHRDb250ZW50PVwiTG9hZGluZy4uLlwiO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24ocG9zaXRpb24pe1xuICAgICAgICAgICAgdGhpcy4kZGF0YS5wb3NpdGlvbi5sYXRpdHVkZT1wb3NpdGlvbi5jb29yZHMubGF0aXR1ZGU7XG4gICAgICAgICAgICB0aGlzLiRkYXRhLnBvc2l0aW9uLmxvbmdpdHVkZT1wb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlO1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnRleHRDb250ZW50PVwiU2V0IE5vdyBQb3NpdGlvblwiO1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LmRpc2FibGVkPWZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBpc0VuYWJsZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gIShcImdlb2xvY2F0aW9uXCIgaW4gbmF2aWdhdG9yKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGdvVG86IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBwb3M9dGhpcy4kZGF0YS5wb3NpdGlvbjtcbiAgICAgICAgbWFwLmdldFZpZXcoKS5zZXRDZW50ZXIoXG4gICAgICAgICAgb2wucHJvai5mcm9tTG9uTGF0KFtwb3MubG9uZ2l0dWRlLCBwb3MubGF0aXR1ZGVdKVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICByZXR1cm4gb3B0aW9ucztcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0T3B0aW9ucztcbiIsIi8qICBlc2xpbnQgbm8tY29uc29sZTogXCJvZmZcIiAqL1xuaW1wb3J0IGdldE9wdHMgZnJvbSBcImZvcm1fc2V0dGluZ3NcIjtcbmltcG9ydCByZW5kZXIgZnJvbSBcImRvbV9zZXR0aW5nc1wiO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGZ1bmN0aW9uKCl7XG4gIC8qXG4gIHZhciBtZWdhbmVNdXNldW09IG5ldyBvbC5GZWF0dXJlKHtcbiAgICBnZW9tZXRyeTogbmV3IG9sLmdlb20uUG9pbnQob2wucHJvai5mcm9tTG9uTGF0KFsxMzYuMTk4ODQyNCwzNS45NDI3NTU3XSkpXG4gIH0pO1xuICBtZWdhbmVNdXNldW0uc2V0U3R5bGUobmV3IG9sLnN0eWxlLlN0eWxlKHtcbiAgICBpbWFnZTogbmV3IG9sLnN0eWxlLkNpcmNsZSh7XG4gICAgICByYWRpdXM6IDcsXG4gICAgICBzbmFwVG9QaXhlbDogZmFsc2UsXG4gICAgICBmaWxsOiBuZXcgb2wuc3R5bGUuRmlsbCh7Y29sb3I6IFwiYmxhY2tcIn0pLFxuICAgICAgc3Ryb2tlOiBuZXcgb2wuc3R5bGUuU3Ryb2tlKHtcbiAgICAgICAgY29sb3I6IFwid2hpdGVcIiwgd2lkdGg6IDJcbiAgICAgIH0pXG4gICAgfSlcbiAgfSkpO1xuXG4gIHZhciB2ZWN0b3JTb3VyY2UgPSBuZXcgb2wuc291cmNlLlZlY3Rvcih7XG4gICAgZmVhdHVyZXM6IFttZWdhbmVNdXNldW1dXG4gIH0pO1xuICovXG5cbiAgdmFyIHZlY3RvckxheW9yID0gbmV3IG9sLmxheWVyLlZlY3Rvcih7XG4gICAgc291cmNlOiBuZXcgb2wuc291cmNlLlZlY3RvcigpXG4gIH0pO1xuICB2YXIgdmlldyA9IG5ldyBvbC5WaWV3KHtcbiAgICBjZW50ZXI6IG9sLnByb2ouZnJvbUxvbkxhdChbMTM5Ljc1MjgsMzUuNjg1MTc1XSksXG4gICAgem9vbTogMTRcbiAgfSk7XG5cbiAgdmFyIG1hcD1uZXcgb2wuTWFwKHtcbiAgICB0YXJnZXQ6IFwibWFwXCIsXG4gICAgbGF5ZXJzOiBbXG4gICAgICBuZXcgb2wubGF5ZXIuVGlsZSh7IHNvdXJjZTogbmV3IG9sLnNvdXJjZS5PU00oKSB9KSxcbiAgICAgIHZlY3RvckxheW9yXG4gICAgXSxcbiAgICB2aWV3OiB2aWV3XG4gIH0pO1xuXG4gIHZhciBvcHRpb25zPWdldE9wdHMob2wsbWFwKTtcbiAgcmVuZGVyKG1hcCxvcHRpb25zKTtcblxuICAvLyDmnIDliJ3jga7mmYLjga7jgb/nj77lnKjlnLDjgpLkuK3lpK7jgavjgZnjgovjgojjgYbjgavjgZnjgotcbiAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbiggKHBvc2l0aW9uKSA9PiB7XG4gICAgdmlldy5zZXRDZW50ZXIoXG4gICAgICBvbC5wcm9qLmZyb21Mb25MYXQoW1xuICAgICAgICBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlLFxuICAgICAgICBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGVdKSk7XG4gIH0sIGVycm9yID0+IHtcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gIH0pO1xuXG4gIHNldEZpbGVFdmVudHMoKTtcblxuICB3aW5kb3cubWFwPW1hcDtcbiAgd2luZG93LnZlY3RvckxheW9yPXZlY3RvckxheW9yO1xufSk7XG5cbmZ1bmN0aW9uIGhhbmRsZURyYWdPdmVyKGUpe1xuICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3Q9XCJjb3B5XCI7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUZpbGVTZWxlY3QoZSl7XG4gIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIGUucHJldmVudERlZmF1bHQoKTtcblxuICB2YXIgZmlsZXM9ZS5kYXRhVHJhbnNmZXIuZmlsZXM7XG4gIGNvbnNvbGUubG9nKGZpbGVzKTtcbiAgYWRkUG9pbnRzRnJvbUZpbGVzKGZpbGVzKTtcbn1cblxuZnVuY3Rpb24gc2V0RmlsZUV2ZW50cygpe1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIixoYW5kbGVEcmFnT3ZlcixmYWxzZSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsaGFuZGxlRmlsZVNlbGVjdCxmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIGFkZFBvaW50c0Zyb21GaWxlcyhmaWxlcyl7XG4gIGZvcih2YXIgaT0wO2k8ZmlsZXMubGVuZ3RoO2krKyl7XG4gICAgbGV0IGZpbGU9ZmlsZXNbaV07XG4gICAgaWYgKGZpbGUudHlwZSAhPSBcImFwcGxpY2F0aW9uL2pzb25cIil7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIHJlYWRlci5vbmxvYWQ9IGZ1bmN0aW9uKGUpe1xuICAgICAgdmFyIHJlc3VsdHM9SlNPTi5wYXJzZShlLnRhcmdldC5yZXN1bHQpO1xuICAgICAgcmVzdWx0cy5wb3NpdGlvbnMuZm9yRWFjaChwb3MgPT4ge1xuICAgICAgICB2YXIgZmVhdHVyZT1mZWF0dXJlRmFjdG9yeShwb3MpO1xuICAgICAgICB3aW5kb3cudmVjdG9yTGF5b3IuZ2V0U291cmNlKCkuYWRkRmVhdHVyZShmZWF0dXJlKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmVhdHVyZUZhY3RvcnkocG9zX2RhdGEpe1xuICB2YXIgZWFydGhSYWRpdXMgPSA2Mzc4MTM3OyAvLyBbbV1cbiAgdmFyIHdnczg0U3BoZXJlID0gbmV3IG9sLlNwaGVyZShlYXJ0aFJhZGl1cyk7XG4gIGlmKFwicmFkaXVzXCIgaW4gcG9zX2RhdGEpe1xuICAgIGxldCBjaXJjbGUgPSBvbC5nZW9tLlBvbHlnb24uY2lyY3VsYXIoXG4gICAgICB3Z3M4NFNwaGVyZSxcbiAgICAgIFtcbiAgICAgICAgcG9zX2RhdGEubG9uZ2l0dWRlLFxuICAgICAgICBwb3NfZGF0YS5sYXRpdHVkZVxuICAgICAgXSxcbiAgICAgIHBvc19kYXRhLnJhZGl1cyxcbiAgICAgIDY0XG4gICAgKS50cmFuc2Zvcm0oXCJFUFNHOjQzMjZcIiwgXCJFUFNHOjM4NTdcIik7XG4gICAgcmV0dXJuIG5ldyBvbC5GZWF0dXJlKGNpcmNsZSk7XG4gIH1cbiAgcmV0dXJuIG5ldyBvbC5GZWF0dXJlKHtcbiAgICBnZW9tZXRyeTogbmV3IG9sLmdlb20uUG9pbnQoXG4gICAgICBvbC5wcm9qLmZyb21Mb25MYXQoW1xuICAgICAgICBwb3NfZGF0YS5sb25naXR1ZGUsXG4gICAgICAgIHBvc19kYXRhLmxhdGl0dWRlXG4gICAgICBdKVxuICAgIClcbiAgfSk7XG59XG4iXX0=
