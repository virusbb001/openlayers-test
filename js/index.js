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
      click_actions[0].func(e);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvbV9zZXR0aW5ncy5qcyIsImZvcm1fc2V0dGluZ3MuanMiLCJpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxXQUFTLFdBQVQsQ0FBcUIsR0FBckIsRUFBeUIsT0FBekIsRUFBaUM7QUFDL0IsUUFBSSxZQUFKO0FBQ0EsUUFBSSxnQkFBZ0IsQ0FBQztBQUNuQixhQUFPLGVBRFk7QUFFbkIsWUFBTSxjQUFDLENBQUQsRUFBSztBQUNULFlBQUksU0FBTyxHQUFHLElBQUgsQ0FBUSxRQUFSLENBQWlCLEVBQUUsVUFBbkIsQ0FBWDtBQUNBLFlBQUcsYUFBYSxLQUFiLENBQW1CLEtBQW5CLENBQXlCLGNBQTVCLEVBQTJDO0FBQ3pDLHVCQUFhLEtBQWIsQ0FBbUIsUUFBbkIsQ0FBNEIsU0FBNUIsR0FBc0MsT0FBTyxDQUFQLENBQXRDO0FBQ0EsdUJBQWEsS0FBYixDQUFtQixRQUFuQixDQUE0QixRQUE1QixHQUFxQyxPQUFPLENBQVAsQ0FBckM7QUFDRDtBQUNGO0FBUmtCLEtBQUQsQ0FBcEI7O0FBV0EsbUJBQWEsSUFBSSxHQUFKLENBQVE7QUFDbkIsVUFBSSxRQURlO0FBRW5CLFlBQU07QUFDSixrQkFBVTtBQUNSLG9CQUFVLENBREY7QUFFUixxQkFBVztBQUZILFNBRE47QUFLSixlQUFPO0FBQ0wsMEJBQWdCO0FBRFgsU0FMSDtBQVFKLHlCQUFpQixjQUFjLENBQWQsRUFBaUIsSUFSOUI7QUFTSix1QkFBZSxhQVRYO0FBVUosZ0JBQVE7QUFWSixPQUZhO0FBY25CLGVBQVM7QUFDUCx5QkFBaUIseUJBQVMsS0FBVCxFQUFlO0FBQUE7O0FBQzlCLGdCQUFNLE1BQU4sQ0FBYSxRQUFiLEdBQXNCLElBQXRCO0FBQ0EsZ0JBQU0sTUFBTixDQUFhLFdBQWIsR0FBeUIsWUFBekI7QUFDQSxvQkFBVSxXQUFWLENBQXNCLGtCQUF0QixDQUF5QyxVQUFDLFFBQUQsRUFBWTtBQUNuRCxrQkFBSyxLQUFMLENBQVcsUUFB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QjtBQUNEO0FBQ0Y7O0FBRUQsV0FBUyxjQUFULENBQXdCLFFBQXhCLEVBQWlDO0FBQy9CLFFBQUksY0FBYyxPQUFsQjtBQUNBLFFBQUksY0FBYyxJQUFJLEdBQUcsTUFBUCxDQUFjLFdBQWQsQ0FBbEI7QUFDQSxRQUFHLFlBQVksUUFBZixFQUF3QjtBQUN0QixVQUFJLFNBQVMsR0FBRyxJQUFILENBQVEsT0FBUixDQUFnQixRQUFoQixDQUNYLFdBRFcsRUFFWCxDQUNFLFNBQVMsU0FEWCxFQUVFLFNBQVMsUUFGWCxDQUZXLEVBTVgsU0FBUyxNQU5FLEVBT1gsRUFQVyxFQVFYLFNBUlcsQ0FRRCxXQVJDLEVBUVksV0FSWixDQUFiO0FBU0EsYUFBTyxJQUFJLEdBQUcsT0FBUCxDQUFlLE1BQWYsQ0FBUDtBQUNEO0FBQ0QsV0FBTyxJQUFJLEdBQUcsT0FBUCxDQUFlO0FBQ3BCLGdCQUFVLElBQUksR0FBRyxJQUFILENBQVEsS0FBWixDQUNSLEdBQUcsSUFBSCxDQUFRLFVBQVIsQ0FBbUIsQ0FDakIsU0FBUyxTQURRLEVBRWpCLFNBQVMsUUFGUSxDQUFuQixDQURRO0FBRFUsS0FBZixDQUFQO0FBUUQiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiB2dWVfc2V0dGluZyhtYXAsb3B0aW9ucyl7XG4gIHZhciBsYXRsbmdJbnB1dHM7XG4gIHZhciBjbGlja19hY3Rpb25zID0gW3tcbiAgICBsYWJlbDogXCJTZXQgTm93IFBsYWNlXCIsXG4gICAgZnVuYzogKGUpPT57XG4gICAgICB2YXIgbG9ubGF0PW9sLnByb2oudG9Mb25MYXQoZS5jb29yZGluYXRlKTtcbiAgICAgIGlmKGxhdGxuZ0lucHV0cy4kZGF0YS5mbGFncy5zZXRXaGVuQ2xpY2tlZCl7XG4gICAgICAgIGxhdGxuZ0lucHV0cy4kZGF0YS5wb3NpdGlvbi5sb25naXR1ZGU9bG9ubGF0WzBdO1xuICAgICAgICBsYXRsbmdJbnB1dHMuJGRhdGEucG9zaXRpb24ubGF0aXR1ZGU9bG9ubGF0WzFdO1xuICAgICAgfVxuICAgIH1cbiAgfV07XG5cbiAgbGF0bG5nSW5wdXRzPW5ldyBWdWUoe1xuICAgIGVsOiBcIiNmb3Jtc1wiLFxuICAgIGRhdGE6IHtcbiAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgIGxhdGl0dWRlOiAwLFxuICAgICAgICBsb25naXR1ZGU6IDBcbiAgICAgIH0sXG4gICAgICBmbGFnczoge1xuICAgICAgICBzZXRXaGVuQ2xpY2tlZDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHNlbGVjdGVkX2FjdGlvbjogY2xpY2tfYWN0aW9uc1swXS5mdW5jLFxuICAgICAgY2xpY2tfYWN0aW9uczogY2xpY2tfYWN0aW9ucyxcbiAgICAgIHN0YXR1czogXCJcIlxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgc2V0RnJvbU5vd1BsYWNlOiBmdW5jdGlvbihldmVudCl7XG4gICAgICAgIGV2ZW50LnRhcmdldC5kaXNhYmxlZD10cnVlO1xuICAgICAgICBldmVudC50YXJnZXQudGV4dENvbnRlbnQ9XCJMb2FkaW5nLi4uXCI7XG4gICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oKHBvc2l0aW9uKT0+e1xuICAgICAgICAgIHRoaXMuJGRhdGEucG9zaXRpb24ubGF0aXR1ZGU9cG9zaXRpb24uY29vcmRzLmxhdGl0dWRlO1xuICAgICAgICAgIHRoaXMuJGRhdGEucG9zaXRpb24ubG9uZ2l0dWRlPXBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGU7XG4gICAgICAgICAgZXZlbnQudGFyZ2V0LnRleHRDb250ZW50PVwiU2V0IG5vdyBQb3NpdGlvblwiO1xuICAgICAgICAgIGV2ZW50LnRhcmdldC5kaXNhYmxlZD1mYWxzZTtcbiAgICAgICAgfSwoZXJyb3IpPT57XG4gICAgICAgICAgdGhpcy4kZGF0YS5zdGF0dXM9XCJFUlJPUi1cIitlcnJvci5jb2RlK1wiOiBcIitlcnJvci5tZXNzYWdlO1xuICAgICAgICAgIGV2ZW50LnRhcmdldC50ZXh0Q29udGVudD1cIlNldCBub3cgUG9zaXRpb25cIjtcbiAgICAgICAgICBldmVudC50YXJnZXQuZGlzYWJsZWQ9ZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGNoZWNrR2VvbG9jYXRpb246IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiAhKFwiZ2VvbG9jYXRpb25cIiBpbiBuYXZpZ2F0b3IpO1xuICAgICAgfSxcbiAgICAgIGdvVG86IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBwb3M9dGhpcy4kZGF0YS5wb3NpdGlvbjtcbiAgICAgICAgbWFwLmdldFZpZXcoKS5zZXRDZW50ZXIoXG4gICAgICAgICAgb2wucHJvai5mcm9tTG9uTGF0KFtwb3MubG9uZ2l0dWRlLCBwb3MubGF0aXR1ZGVdKVxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgIGFkZEZhdm9yaXRlUGxhY2U6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBsaXN0PUpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJvbHRlc3QuZmF2b2xpdGVwbGFjZVwiKSkgfHwgW107XG4gICAgICAgIHZhciBsb249XG4gICAgICAgIGxpc3QucHVzaChbXG4gICAgICAgICAgdGhpcy4kZGF0YS5wb3NpdGlvbi5sb25naXR1ZGUsXG4gICAgICAgICAgdGhpcy4kZGF0YS5wb3NpdGlvbi5sYXRpdHVkZVxuICAgICAgICBdKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJvbHRlc3QuZmF2b2xpdGVwbGFjZVwiLEpTT04uc3RyaW5naWZ5KGxpc3QpKTtcbiAgICAgICAgY29uc29sZS5sb2cobGlzdCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBtYXAub24oXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcbiAgICBjbGlja19hY3Rpb25zWzBdLmZ1bmMoZSk7XG4gIH0pO1xuXG4gIHdpbmRvdy5sYXRsbmdJbnB1dHM9bGF0bG5nSW5wdXRzO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2dWVfc2V0dGluZztcbiIsIi8qKlxuICog44OR44Op44Oh44O844K/5YWl5Yqb44OV44Kp44O844Og44Go5a6f6KGM44Gu6Kit5a6a44KS6L+U44GZ6Zai5pWwXG4gKiBAcGFyYW0gb2wgT3BlbkxheWVyMyDjga7jgqrjg5bjgrjjgqfjgq/jg4hcbiAqIEBwYXJhbSBtYXAg6KGo56S655So44GuTWFw44Kq44OW44K444Kn44Kv44OIXG4gKi9cbmZ1bmN0aW9uIGdldE9wdGlvbnMob2wsbWFwKXtcbiAgdmFyIG9wdGlvbnMgPSB7XG4gICAgTGF0TG9uZ0NvbnRyb2xsZXI6IHtcbiAgICAgIHNldE5vd1Bvc2l0aW9uOiB7XG4gICAgICAgIGZ1bmM6IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICBldmVudC50YXJnZXQuZGlzYWJsZWQ9dHJ1ZTtcbiAgICAgICAgICBldmVudC50YXJnZXQudGV4dENvbnRlbnQ9XCJMb2FkaW5nLi4uXCI7XG4gICAgICAgICAgY29uc29sZS5sb2codGhpcyk7XG4gICAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbihwb3NpdGlvbil7XG4gICAgICAgICAgICB0aGlzLiRkYXRhLnBvc2l0aW9uLmxhdGl0dWRlPXBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZTtcbiAgICAgICAgICAgIHRoaXMuJGRhdGEucG9zaXRpb24ubG9uZ2l0dWRlPXBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGU7XG4gICAgICAgICAgICBldmVudC50YXJnZXQudGV4dENvbnRlbnQ9XCJTZXQgTm93IFBvc2l0aW9uXCI7XG4gICAgICAgICAgICBldmVudC50YXJnZXQuZGlzYWJsZWQ9ZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGlzRW5hYmxlOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHJldHVybiAhKFwiZ2VvbG9jYXRpb25cIiBpbiBuYXZpZ2F0b3IpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZ29UbzogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHBvcz10aGlzLiRkYXRhLnBvc2l0aW9uO1xuICAgICAgICBtYXAuZ2V0VmlldygpLnNldENlbnRlcihcbiAgICAgICAgICBvbC5wcm9qLmZyb21Mb25MYXQoW3Bvcy5sb25naXR1ZGUsIHBvcy5sYXRpdHVkZV0pXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBvcHRpb25zO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRPcHRpb25zO1xuIiwiLyogIGVzbGludCBuby1jb25zb2xlOiBcIm9mZlwiICovXG5pbXBvcnQgZ2V0T3B0cyBmcm9tIFwiZm9ybV9zZXR0aW5nc1wiO1xuaW1wb3J0IHJlbmRlciBmcm9tIFwiZG9tX3NldHRpbmdzXCI7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsZnVuY3Rpb24oKXtcbiAgLypcbiAgdmFyIG1lZ2FuZU11c2V1bT0gbmV3IG9sLkZlYXR1cmUoe1xuICAgIGdlb21ldHJ5OiBuZXcgb2wuZ2VvbS5Qb2ludChvbC5wcm9qLmZyb21Mb25MYXQoWzEzNi4xOTg4NDI0LDM1Ljk0Mjc1NTddKSlcbiAgfSk7XG4gIG1lZ2FuZU11c2V1bS5zZXRTdHlsZShuZXcgb2wuc3R5bGUuU3R5bGUoe1xuICAgIGltYWdlOiBuZXcgb2wuc3R5bGUuQ2lyY2xlKHtcbiAgICAgIHJhZGl1czogNyxcbiAgICAgIHNuYXBUb1BpeGVsOiBmYWxzZSxcbiAgICAgIGZpbGw6IG5ldyBvbC5zdHlsZS5GaWxsKHtjb2xvcjogXCJibGFja1wifSksXG4gICAgICBzdHJva2U6IG5ldyBvbC5zdHlsZS5TdHJva2Uoe1xuICAgICAgICBjb2xvcjogXCJ3aGl0ZVwiLCB3aWR0aDogMlxuICAgICAgfSlcbiAgICB9KVxuICB9KSk7XG5cbiAgdmFyIHZlY3RvclNvdXJjZSA9IG5ldyBvbC5zb3VyY2UuVmVjdG9yKHtcbiAgICBmZWF0dXJlczogW21lZ2FuZU11c2V1bV1cbiAgfSk7XG4gKi9cblxuICB2YXIgdmVjdG9yTGF5b3IgPSBuZXcgb2wubGF5ZXIuVmVjdG9yKHtcbiAgICBzb3VyY2U6IG5ldyBvbC5zb3VyY2UuVmVjdG9yKClcbiAgfSk7XG4gIHZhciB2aWV3ID0gbmV3IG9sLlZpZXcoe1xuICAgIGNlbnRlcjogb2wucHJvai5mcm9tTG9uTGF0KFsxMzkuNzUyOCwzNS42ODUxNzVdKSxcbiAgICB6b29tOiAxNFxuICB9KTtcblxuICB2YXIgbWFwPW5ldyBvbC5NYXAoe1xuICAgIHRhcmdldDogXCJtYXBcIixcbiAgICBsYXllcnM6IFtcbiAgICAgIG5ldyBvbC5sYXllci5UaWxlKHsgc291cmNlOiBuZXcgb2wuc291cmNlLk9TTSgpIH0pLFxuICAgICAgdmVjdG9yTGF5b3JcbiAgICBdLFxuICAgIHZpZXc6IHZpZXdcbiAgfSk7XG5cbiAgdmFyIG9wdGlvbnM9Z2V0T3B0cyhvbCxtYXApO1xuICByZW5kZXIobWFwLG9wdGlvbnMpO1xuXG4gIC8vIOacgOWIneOBruaZguOBruOBv+ePvuWcqOWcsOOCkuS4reWkruOBq+OBmeOCi+OCiOOBhuOBq+OBmeOCi1xuICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKCAocG9zaXRpb24pID0+IHtcbiAgICB2aWV3LnNldENlbnRlcihcbiAgICAgIG9sLnByb2ouZnJvbUxvbkxhdChbXG4gICAgICAgIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgIHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZV0pKTtcbiAgfSwgZXJyb3IgPT4ge1xuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgfSk7XG5cbiAgc2V0RmlsZUV2ZW50cygpO1xuXG4gIHdpbmRvdy5tYXA9bWFwO1xuICB3aW5kb3cudmVjdG9yTGF5b3I9dmVjdG9yTGF5b3I7XG59KTtcblxuZnVuY3Rpb24gaGFuZGxlRHJhZ092ZXIoZSl7XG4gIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgZS5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdD1cImNvcHlcIjtcbn1cblxuZnVuY3Rpb24gaGFuZGxlRmlsZVNlbGVjdChlKXtcbiAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gIHZhciBmaWxlcz1lLmRhdGFUcmFuc2Zlci5maWxlcztcbiAgY29uc29sZS5sb2coZmlsZXMpO1xuICBhZGRQb2ludHNGcm9tRmlsZXMoZmlsZXMpO1xufVxuXG5mdW5jdGlvbiBzZXRGaWxlRXZlbnRzKCl7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLGhhbmRsZURyYWdPdmVyLGZhbHNlKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIixoYW5kbGVGaWxlU2VsZWN0LGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gYWRkUG9pbnRzRnJvbUZpbGVzKGZpbGVzKXtcbiAgZm9yKHZhciBpPTA7aTxmaWxlcy5sZW5ndGg7aSsrKXtcbiAgICBsZXQgZmlsZT1maWxlc1tpXTtcbiAgICBpZiAoZmlsZS50eXBlICE9IFwiYXBwbGljYXRpb24vanNvblwiKXtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgcmVhZGVyLm9ubG9hZD0gZnVuY3Rpb24oZSl7XG4gICAgICB2YXIgcmVzdWx0cz1KU09OLnBhcnNlKGUudGFyZ2V0LnJlc3VsdCk7XG4gICAgICByZXN1bHRzLnBvc2l0aW9ucy5mb3JFYWNoKHBvcyA9PiB7XG4gICAgICAgIHZhciBmZWF0dXJlPWZlYXR1cmVGYWN0b3J5KHBvcyk7XG4gICAgICAgIHdpbmRvdy52ZWN0b3JMYXlvci5nZXRTb3VyY2UoKS5hZGRGZWF0dXJlKGZlYXR1cmUpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmZWF0dXJlRmFjdG9yeShwb3NfZGF0YSl7XG4gIHZhciBlYXJ0aFJhZGl1cyA9IDYzNzgxMzc7IC8vIFttXVxuICB2YXIgd2dzODRTcGhlcmUgPSBuZXcgb2wuU3BoZXJlKGVhcnRoUmFkaXVzKTtcbiAgaWYoXCJyYWRpdXNcIiBpbiBwb3NfZGF0YSl7XG4gICAgbGV0IGNpcmNsZSA9IG9sLmdlb20uUG9seWdvbi5jaXJjdWxhcihcbiAgICAgIHdnczg0U3BoZXJlLFxuICAgICAgW1xuICAgICAgICBwb3NfZGF0YS5sb25naXR1ZGUsXG4gICAgICAgIHBvc19kYXRhLmxhdGl0dWRlXG4gICAgICBdLFxuICAgICAgcG9zX2RhdGEucmFkaXVzLFxuICAgICAgNjRcbiAgICApLnRyYW5zZm9ybShcIkVQU0c6NDMyNlwiLCBcIkVQU0c6Mzg1N1wiKTtcbiAgICByZXR1cm4gbmV3IG9sLkZlYXR1cmUoY2lyY2xlKTtcbiAgfVxuICByZXR1cm4gbmV3IG9sLkZlYXR1cmUoe1xuICAgIGdlb21ldHJ5OiBuZXcgb2wuZ2VvbS5Qb2ludChcbiAgICAgIG9sLnByb2ouZnJvbUxvbkxhdChbXG4gICAgICAgIHBvc19kYXRhLmxvbmdpdHVkZSxcbiAgICAgICAgcG9zX2RhdGEubGF0aXR1ZGVcbiAgICAgIF0pXG4gICAgKVxuICB9KTtcbn1cbiJdfQ==
