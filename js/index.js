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
    var latlngInputs = new Vue({
      el: "#forms",
      data: {
        position: {
          latitude: 0,
          longitude: 0
        },
        flags: {
          setWhenClicked: true
        },
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
      var lonlat = ol.proj.toLonLat(e.coordinate);
      if (latlngInputs.$data.flags.setWhenClicked) {
        latlngInputs.$data.position.longitude = lonlat[0];
        latlngInputs.$data.position.latitude = lonlat[1];
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
      console.log("radius");
      console.log(pos_data);
      var circle = ol.geom.Polygon.circular(wgs84Sphere, [pos_data.longitude, pos_data.latitude], pos_data.radius, 64).transform('EPSG:4326', 'EPSG:3857');
      console.log(circle);
      return new ol.Feature(circle);
    }
    return new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([pos_data.longitude, pos_data.latitude]))
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvbV9zZXR0aW5ncy5qcyIsImZvcm1fc2V0dGluZ3MuanMiLCJpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxXQUFTLFdBQVQsQ0FBcUIsR0FBckIsRUFBeUIsT0FBekIsRUFBaUM7QUFDL0IsUUFBSSxlQUFhLElBQUksR0FBSixDQUFRO0FBQ3ZCLFVBQUksUUFEbUI7QUFFdkIsWUFBTTtBQUNKLGtCQUFVO0FBQ1Isb0JBQVUsQ0FERjtBQUVSLHFCQUFXO0FBRkgsU0FETjtBQUtKLGVBQU87QUFDTCwwQkFBZ0I7QUFEWCxTQUxIO0FBUUosZ0JBQVE7QUFSSixPQUZpQjtBQVl2QixlQUFTO0FBQ1AseUJBQWlCLHlCQUFTLEtBQVQsRUFBZTtBQUFBOztBQUM5QixnQkFBTSxNQUFOLENBQWEsUUFBYixHQUFzQixJQUF0QjtBQUNBLGdCQUFNLE1BQU4sQ0FBYSxXQUFiLEdBQXlCLFlBQXpCO0FBQ0Esb0JBQVUsV0FBVixDQUFzQixrQkFBdEIsQ0FBeUMsVUFBQyxRQUFELEVBQVk7QUFDbkQsa0JBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsUUFBcEIsR0FBNkIsU0FBUyxNQUFULENBQWdCLFFBQTdDO0FBQ0Esa0JBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsU0FBcEIsR0FBOEIsU0FBUyxNQUFULENBQWdCLFNBQTlDO0FBQ0Esa0JBQU0sTUFBTixDQUFhLFdBQWIsR0FBeUIsa0JBQXpCO0FBQ0Esa0JBQU0sTUFBTixDQUFhLFFBQWIsR0FBc0IsS0FBdEI7QUFDRCxXQUxELEVBS0UsVUFBQyxLQUFELEVBQVM7QUFDVCxrQkFBSyxLQUFMLENBQVcsTUFBWCxHQUFrQixXQUFTLE1BQU0sSUFBZixHQUFvQixJQUFwQixHQUF5QixNQUFNLE9BQWpEO0FBQ0Esa0JBQU0sTUFBTixDQUFhLFdBQWIsR0FBeUIsa0JBQXpCO0FBQ0Esa0JBQU0sTUFBTixDQUFhLFFBQWIsR0FBc0IsS0FBdEI7QUFDRCxXQVREO0FBVUQs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LFFBQVo7QUFDQSxVQUFJLFNBQVMsR0FBRyxJQUFILENBQVEsT0FBUixDQUFnQixRQUFoQixDQUNYLFdBRFcsRUFFWCxDQUNFLFNBQVMsU0FEWCxFQUVFLFNBQVMsUUFGWCxDQUZXLEVBTVgsU0FBUyxNQU5FLEVBT1gsRUFQVyxFQVFYLFNBUlcsQ0FRRCxXQVJDLEVBUVksV0FSWixDQUFiO0FBU0EsY0FBUSxHQUFSLENBQVksTUFBWjtBQUNBLGFBQU8sSUFBSSxHQUFHLE9BQVAsQ0FBZSxNQUFmLENBQVA7QUFDRDtBQUNELFdBQU8sSUFBSSxHQUFHLE9BQVAsQ0FBZTtBQUNwQixnQkFBVSxJQUFJLEdBQUcsSUFBSCxDQUFRLEtBQVosQ0FDUixHQUFHLElBQUgsQ0FBUSxVQUFSLENBQW1CLENBQ2pCLFNBQVMsU0FEUSxFQUVqQixTQUFTLFFBRlEsQ0FBbkIsQ0FEUTtBQURVLEtBQWYsQ0FBUDtBQVFEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gdnVlX3NldHRpbmcobWFwLG9wdGlvbnMpe1xuICB2YXIgbGF0bG5nSW5wdXRzPW5ldyBWdWUoe1xuICAgIGVsOiBcIiNmb3Jtc1wiLFxuICAgIGRhdGE6IHtcbiAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgIGxhdGl0dWRlOiAwLFxuICAgICAgICBsb25naXR1ZGU6IDBcbiAgICAgIH0sXG4gICAgICBmbGFnczoge1xuICAgICAgICBzZXRXaGVuQ2xpY2tlZDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHN0YXR1czogXCJcIlxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgc2V0RnJvbU5vd1BsYWNlOiBmdW5jdGlvbihldmVudCl7XG4gICAgICAgIGV2ZW50LnRhcmdldC5kaXNhYmxlZD10cnVlO1xuICAgICAgICBldmVudC50YXJnZXQudGV4dENvbnRlbnQ9XCJMb2FkaW5nLi4uXCI7XG4gICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oKHBvc2l0aW9uKT0+e1xuICAgICAgICAgIHRoaXMuJGRhdGEucG9zaXRpb24ubGF0aXR1ZGU9cG9zaXRpb24uY29vcmRzLmxhdGl0dWRlO1xuICAgICAgICAgIHRoaXMuJGRhdGEucG9zaXRpb24ubG9uZ2l0dWRlPXBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGU7XG4gICAgICAgICAgZXZlbnQudGFyZ2V0LnRleHRDb250ZW50PVwiU2V0IG5vdyBQb3NpdGlvblwiO1xuICAgICAgICAgIGV2ZW50LnRhcmdldC5kaXNhYmxlZD1mYWxzZTtcbiAgICAgICAgfSwoZXJyb3IpPT57XG4gICAgICAgICAgdGhpcy4kZGF0YS5zdGF0dXM9XCJFUlJPUi1cIitlcnJvci5jb2RlK1wiOiBcIitlcnJvci5tZXNzYWdlO1xuICAgICAgICAgIGV2ZW50LnRhcmdldC50ZXh0Q29udGVudD1cIlNldCBub3cgUG9zaXRpb25cIjtcbiAgICAgICAgICBldmVudC50YXJnZXQuZGlzYWJsZWQ9ZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGNoZWNrR2VvbG9jYXRpb246IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiAhKFwiZ2VvbG9jYXRpb25cIiBpbiBuYXZpZ2F0b3IpO1xuICAgICAgfSxcbiAgICAgIGdvVG86IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBwb3M9dGhpcy4kZGF0YS5wb3NpdGlvbjtcbiAgICAgICAgbWFwLmdldFZpZXcoKS5zZXRDZW50ZXIoXG4gICAgICAgICAgb2wucHJvai5mcm9tTG9uTGF0KFtwb3MubG9uZ2l0dWRlLCBwb3MubGF0aXR1ZGVdKVxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgIGFkZEZhdm9yaXRlUGxhY2U6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBsaXN0PUpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJvbHRlc3QuZmF2b2xpdGVwbGFjZVwiKSkgfHwgW107XG4gICAgICAgIHZhciBsb249XG4gICAgICAgIGxpc3QucHVzaChbXG4gICAgICAgICAgdGhpcy4kZGF0YS5wb3NpdGlvbi5sb25naXR1ZGUsXG4gICAgICAgICAgdGhpcy4kZGF0YS5wb3NpdGlvbi5sYXRpdHVkZVxuICAgICAgICBdKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJvbHRlc3QuZmF2b2xpdGVwbGFjZVwiLEpTT04uc3RyaW5naWZ5KGxpc3QpKTtcbiAgICAgICAgY29uc29sZS5sb2cobGlzdCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBtYXAub24oXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcbiAgICB2YXIgbG9ubGF0PW9sLnByb2oudG9Mb25MYXQoZS5jb29yZGluYXRlKTtcbiAgICBpZihsYXRsbmdJbnB1dHMuJGRhdGEuZmxhZ3Muc2V0V2hlbkNsaWNrZWQpe1xuICAgICAgbGF0bG5nSW5wdXRzLiRkYXRhLnBvc2l0aW9uLmxvbmdpdHVkZT1sb25sYXRbMF07XG4gICAgICBsYXRsbmdJbnB1dHMuJGRhdGEucG9zaXRpb24ubGF0aXR1ZGU9bG9ubGF0WzFdO1xuICAgIH1cbiAgfSk7XG5cbiAgd2luZG93LmxhdGxuZ0lucHV0cz1sYXRsbmdJbnB1dHM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHZ1ZV9zZXR0aW5nO1xuIiwiLyoqXG4gKiDjg5Hjg6njg6Hjg7zjgr/lhaXlipvjg5Xjgqnjg7zjg6Djgajlrp/ooYzjga7oqK3lrprjgpLov5TjgZnplqLmlbBcbiAqIEBwYXJhbSBvbCBPcGVuTGF5ZXIzIOOBruOCquODluOCuOOCp+OCr+ODiFxuICogQHBhcmFtIG1hcCDooajnpLrnlKjjga5NYXDjgqrjg5bjgrjjgqfjgq/jg4hcbiAqL1xuZnVuY3Rpb24gZ2V0T3B0aW9ucyhvbCxtYXApe1xuICB2YXIgb3B0aW9ucyA9IHtcbiAgICBMYXRMb25nQ29udHJvbGxlcjoge1xuICAgICAgc2V0Tm93UG9zaXRpb246IHtcbiAgICAgICAgZnVuYzogZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgIGV2ZW50LnRhcmdldC5kaXNhYmxlZD10cnVlO1xuICAgICAgICAgIGV2ZW50LnRhcmdldC50ZXh0Q29udGVudD1cIkxvYWRpbmcuLi5cIjtcbiAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzKTtcbiAgICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uKHBvc2l0aW9uKXtcbiAgICAgICAgICAgIHRoaXMuJGRhdGEucG9zaXRpb24ubGF0aXR1ZGU9cG9zaXRpb24uY29vcmRzLmxhdGl0dWRlO1xuICAgICAgICAgICAgdGhpcy4kZGF0YS5wb3NpdGlvbi5sb25naXR1ZGU9cG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZTtcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC50ZXh0Q29udGVudD1cIlNldCBOb3cgUG9zaXRpb25cIjtcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC5kaXNhYmxlZD1mYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgaXNFbmFibGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuICEoXCJnZW9sb2NhdGlvblwiIGluIG5hdmlnYXRvcik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBnb1RvOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgcG9zPXRoaXMuJGRhdGEucG9zaXRpb247XG4gICAgICAgIG1hcC5nZXRWaWV3KCkuc2V0Q2VudGVyKFxuICAgICAgICAgIG9sLnByb2ouZnJvbUxvbkxhdChbcG9zLmxvbmdpdHVkZSwgcG9zLmxhdGl0dWRlXSlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldE9wdGlvbnM7XG4iLCIvKiAgZXNsaW50IG5vLWNvbnNvbGU6IFwib2ZmXCIgKi9cbmltcG9ydCBnZXRPcHRzIGZyb20gXCJmb3JtX3NldHRpbmdzXCI7XG5pbXBvcnQgcmVuZGVyIGZyb20gXCJkb21fc2V0dGluZ3NcIjtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixmdW5jdGlvbigpe1xuICAvKlxuICB2YXIgbWVnYW5lTXVzZXVtPSBuZXcgb2wuRmVhdHVyZSh7XG4gICAgZ2VvbWV0cnk6IG5ldyBvbC5nZW9tLlBvaW50KG9sLnByb2ouZnJvbUxvbkxhdChbMTM2LjE5ODg0MjQsMzUuOTQyNzU1N10pKVxuICB9KTtcbiAgbWVnYW5lTXVzZXVtLnNldFN0eWxlKG5ldyBvbC5zdHlsZS5TdHlsZSh7XG4gICAgaW1hZ2U6IG5ldyBvbC5zdHlsZS5DaXJjbGUoe1xuICAgICAgcmFkaXVzOiA3LFxuICAgICAgc25hcFRvUGl4ZWw6IGZhbHNlLFxuICAgICAgZmlsbDogbmV3IG9sLnN0eWxlLkZpbGwoe2NvbG9yOiBcImJsYWNrXCJ9KSxcbiAgICAgIHN0cm9rZTogbmV3IG9sLnN0eWxlLlN0cm9rZSh7XG4gICAgICAgIGNvbG9yOiBcIndoaXRlXCIsIHdpZHRoOiAyXG4gICAgICB9KVxuICAgIH0pXG4gIH0pKTtcblxuICB2YXIgdmVjdG9yU291cmNlID0gbmV3IG9sLnNvdXJjZS5WZWN0b3Ioe1xuICAgIGZlYXR1cmVzOiBbbWVnYW5lTXVzZXVtXVxuICB9KTtcbiAqL1xuXG4gIHZhciB2ZWN0b3JMYXlvciA9IG5ldyBvbC5sYXllci5WZWN0b3Ioe1xuICAgIHNvdXJjZTogbmV3IG9sLnNvdXJjZS5WZWN0b3IoKVxuICB9KTtcbiAgdmFyIHZpZXcgPSBuZXcgb2wuVmlldyh7XG4gICAgY2VudGVyOiBvbC5wcm9qLmZyb21Mb25MYXQoWzEzOS43NTI4LDM1LjY4NTE3NV0pLFxuICAgIHpvb206IDE0XG4gIH0pO1xuXG4gIHZhciBtYXA9bmV3IG9sLk1hcCh7XG4gICAgdGFyZ2V0OiBcIm1hcFwiLFxuICAgIGxheWVyczogW1xuICAgICAgbmV3IG9sLmxheWVyLlRpbGUoeyBzb3VyY2U6IG5ldyBvbC5zb3VyY2UuT1NNKCkgfSksXG4gICAgICB2ZWN0b3JMYXlvclxuICAgIF0sXG4gICAgdmlldzogdmlld1xuICB9KTtcblxuICB2YXIgb3B0aW9ucz1nZXRPcHRzKG9sLG1hcCk7XG4gIHJlbmRlcihtYXAsb3B0aW9ucyk7XG5cbiAgLy8g5pyA5Yid44Gu5pmC44Gu44G/54++5Zyo5Zyw44KS5Lit5aSu44Gr44GZ44KL44KI44GG44Gr44GZ44KLXG4gIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oIChwb3NpdGlvbikgPT4ge1xuICAgIHZpZXcuc2V0Q2VudGVyKFxuICAgICAgb2wucHJvai5mcm9tTG9uTGF0KFtcbiAgICAgICAgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlXSkpO1xuICB9LCBlcnJvciA9PiB7XG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xuICB9KTtcblxuICBzZXRGaWxlRXZlbnRzKCk7XG5cbiAgd2luZG93Lm1hcD1tYXA7XG4gIHdpbmRvdy52ZWN0b3JMYXlvcj12ZWN0b3JMYXlvcjtcbn0pO1xuXG5mdW5jdGlvbiBoYW5kbGVEcmFnT3ZlcihlKXtcbiAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBlLmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0PVwiY29weVwiO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVGaWxlU2VsZWN0KGUpe1xuICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgdmFyIGZpbGVzPWUuZGF0YVRyYW5zZmVyLmZpbGVzO1xuICBjb25zb2xlLmxvZyhmaWxlcyk7XG4gIGFkZFBvaW50c0Zyb21GaWxlcyhmaWxlcyk7XG59XG5cbmZ1bmN0aW9uIHNldEZpbGVFdmVudHMoKXtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsaGFuZGxlRHJhZ092ZXIsZmFsc2UpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLGhhbmRsZUZpbGVTZWxlY3QsZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBhZGRQb2ludHNGcm9tRmlsZXMoZmlsZXMpe1xuICBmb3IodmFyIGk9MDtpPGZpbGVzLmxlbmd0aDtpKyspe1xuICAgIGxldCBmaWxlPWZpbGVzW2ldO1xuICAgIGlmIChmaWxlLnR5cGUgIT0gXCJhcHBsaWNhdGlvbi9qc29uXCIpe1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICByZWFkZXIub25sb2FkPSBmdW5jdGlvbihlKXtcbiAgICAgIHZhciByZXN1bHRzPUpTT04ucGFyc2UoZS50YXJnZXQucmVzdWx0KTtcbiAgICAgIHJlc3VsdHMucG9zaXRpb25zLmZvckVhY2gocG9zID0+IHtcbiAgICAgICAgdmFyIGZlYXR1cmU9ZmVhdHVyZUZhY3RvcnkocG9zKTtcbiAgICAgICAgd2luZG93LnZlY3RvckxheW9yLmdldFNvdXJjZSgpLmFkZEZlYXR1cmUoZmVhdHVyZSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZlYXR1cmVGYWN0b3J5KHBvc19kYXRhKXtcbiAgdmFyIGVhcnRoUmFkaXVzID0gNjM3ODEzNzsgLy8gW21dXG4gIHZhciB3Z3M4NFNwaGVyZSA9IG5ldyBvbC5TcGhlcmUoZWFydGhSYWRpdXMpO1xuICBpZihcInJhZGl1c1wiIGluIHBvc19kYXRhKXtcbiAgICBjb25zb2xlLmxvZyhcInJhZGl1c1wiKTtcbiAgICBjb25zb2xlLmxvZyhwb3NfZGF0YSk7XG4gICAgbGV0IGNpcmNsZSA9IG9sLmdlb20uUG9seWdvbi5jaXJjdWxhcihcbiAgICAgIHdnczg0U3BoZXJlLFxuICAgICAgW1xuICAgICAgICBwb3NfZGF0YS5sb25naXR1ZGUsXG4gICAgICAgIHBvc19kYXRhLmxhdGl0dWRlXG4gICAgICBdLFxuICAgICAgcG9zX2RhdGEucmFkaXVzLFxuICAgICAgNjRcbiAgICApLnRyYW5zZm9ybSgnRVBTRzo0MzI2JywgJ0VQU0c6Mzg1NycpO1xuICAgIGNvbnNvbGUubG9nKGNpcmNsZSk7XG4gICAgcmV0dXJuIG5ldyBvbC5GZWF0dXJlKGNpcmNsZSk7XG4gIH1cbiAgcmV0dXJuIG5ldyBvbC5GZWF0dXJlKHtcbiAgICBnZW9tZXRyeTogbmV3IG9sLmdlb20uUG9pbnQoXG4gICAgICBvbC5wcm9qLmZyb21Mb25MYXQoW1xuICAgICAgICBwb3NfZGF0YS5sb25naXR1ZGUsXG4gICAgICAgIHBvc19kYXRhLmxhdGl0dWRlXG4gICAgICBdKVxuICAgIClcbiAgfSk7XG59XG4iXX0=
