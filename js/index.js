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
  function create_components() {
    var latlngInputs = new Vue({
      el: "#forms",
      data: {
        position: {
          latitude: 0,
          longitude: 0
        }
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
          });
        },
        checkGeolocation: function checkGeolocation() {
          return !("geolocation" in navigator);
        }
      }
    });

    window.latlngInputs = latlngInputs;
  }

  exports.default = create_components;
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
      "add_single_ballon": {
        head: "Add Single Balloon",
        type: "LatLong",
        execute: function execute(datas) {
          var latitude = datas.latitude;
          var longitude = datas.longitude;
          window.alert(latitude);
          window.alert(longitude);
        }
      }
    };
    map;

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
    var meganeMuseum = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([136.1988424, 35.9427557]))
    });
    meganeMuseum.setStyle(new ol.style.Style({
      image: new ol.style.Circle({
        radius: 7,
        snapToPixel: false,
        fill: new ol.style.Fill({ color: "black" }),
        stroke: new ol.style.Stroke({
          color: "white", width: 2
        })
      })
    }));

    var vectorSource = new ol.source.Vector({
      features: [meganeMuseum]
    });
    var view = new ol.View({
      center: ol.proj.fromLonLat([139.7528, 35.685175]),
      zoom: 14
    });

    var map = new ol.Map({
      target: "map",
      layers: [new ol.layer.Tile({ source: new ol.source.OSM() }), new ol.layer.Vector({ source: vectorSource })],
      view: view
    });
    var options = (0, _form_settings2.default)(ol, map);
    (0, _dom_settings2.default)(document.getElementById("forms"), options);

    navigator.geolocation.getCurrentPosition(function (position) {
      view.setCenter(ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude]));
    }, function (error) {
      console.log(error);
    });

    window.map = map;
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvbV9zZXR0aW5ncy5qcyIsImZvcm1fc2V0dGluZ3MuanMiLCJpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxXQUFTLGlCQUFULEdBQTRCO0FBQzFCLFFBQUksZUFBYSxJQUFJLEdBQUosQ0FBUTtBQUN2QixVQUFJLFFBRG1CO0FBRXZCLFlBQU07QUFDSixrQkFBVTtBQUNSLG9CQUFVLENBREY7QUFFUixxQkFBVztBQUZIO0FBRE4sT0FGaUI7QUFRdkIsZUFBUztBQUNQLHlCQUFpQix5QkFBUyxLQUFULEVBQWU7QUFBQTs7QUFDOUIsZ0JBQU0sTUFBTixDQUFhLFFBQWIsR0FBc0IsSUFBdEI7QUFDQSxnQkFBTSxNQUFOLENBQWEsV0FBYixHQUF5QixZQUF6QjtBQUNBLG9CQUFVLFdBQVYsQ0FBc0Isa0JBQXRCLENBQXlDLFVBQUMsUUFBRCxFQUFZO0FBQ25ELGtCQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLFFBQXBCLEdBQTZCLFNBQVMsTUFBVCxDQUFnQixRQUE3QztBQUNBLGtCQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLFNBQXBCLEdBQThCLFNBQVMsTUFBVCxDQUFnQixTQUE5QztBQUNBLGtCQUFNLE1BQU4sQ0FBYSxXQUFiLEdBQXlCLGtCQUF6QjtBQUNBLGtCQUFNLE1BQU4sQ0FBYSxRQUFiLEdBQXNCLEtBQXRCO0FBQ0QsV0FMRDtBQU1ELFNBVk07QUFXUCwwQkFBa0IsNEJBQVU7QUFDMUIsaUJBQU8sRUFBRSxpQkFBaUIsU0FBbkIsQ0FBUDtBQUNEO0FBYk07QUFSYyxLQUFSLENBQWpCOztBQXlCQSxXQUFPLFlBQVAsR0FBb0IsWUFBcEI7QUFDRDs7b0JBRWM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4QmYsV0FBUyxVQUFULENBQW9CLEVBQXBCLEVBQXVCLEdBQXZCLEVBQTJCO0FBQ3pCLFFBQUksVUFBVTtBQUNaLDJCQUFxQjtBQUNuQixjQUFNLG9CQURhO0FBRW5CLGNBQU0sU0FGYTtBQUduQixpQkFBUyxpQkFBUyxLQUFULEVBQWU7QUFDdEIsY0FBSSxXQUFTLE1BQU0sUUFBbkI7QUFDQSxjQUFJLFlBQVUsTUFBTSxTQUFwQjtBQUNBLGlCQUFPLEtBQVAsQ0FBYSxRQUFiO0FBQ0EsaUJBQU8sS0FBUCxDQUFhLFNBQWI7QUFDRDtBQVJrQjtBQURULEtBQWQ7QUFZQTs7QUFFQSxXQUFPLE9BQVA7QUFDRDs7b0JBRWM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25CZixXQUFTLGdCQUFULENBQTBCLGtCQUExQixFQUE2QyxZQUFVO0FBQ3JELFFBQUksZUFBYyxJQUFJLEdBQUcsT0FBUCxDQUFlO0FBQy9CLGdCQUFVLElBQUksR0FBRyxJQUFILENBQVEsS0FBWixDQUFrQixHQUFHLElBQUgsQ0FBUSxVQUFSLENBQW1CLENBQUMsV0FBRCxFQUFhLFVBQWIsQ0FBbkIsQ0FBbEI7QUFEcUIsS0FBZixDQUFsQjtBQUdBLGlCQUFhLFFBQWIsQ0FBc0IsSUFBSSxHQUFHLEtBQUgsQ0FBUyxLQUFiLENBQW1CO0FBQ3ZDLGFBQU8sSUFBSSxHQUFHLEtBQUgsQ0FBUyxNQUFiLENBQW9CO0FBQ3pCLGdCQUFRLENBRGlCO0FBRXpCLHFCQUFhLEtBRlk7QUFHekIsY0FBTSxJQUFJLEdBQUcsS0FBSCxDQUFTLElBQWIsQ0FBa0IsRUFBQyxPQUFPLE9BQVIsRUFBbEIsQ0FIbUI7QUFJekIsZ0JBQVEsSUFBSSxHQUFHLEtBQUgsQ0FBUyxNQUFiLENBQW9CO0FBQzFCLGlCQUFPLE9BRG1CLEVBQ1YsT0FBTztBQURHLFNBQXBCO0FBSmlCLE9BQXBCO0FBRGdDLEtBQW5CLENBQXRCOztBQVdBLFFBQUksZUFBZSxJQUFJLEdBQUcsTUFBSCxDQUFVLE1BQWQsQ0FBcUI7QUFDdEMsZ0JBQVUsQ0FBQyxZQUFEO0FBRDRCLEtBQXJCLENBQW5CO0FBR0EsUUFBSSxPQUFPLElBQUksR0FBRyxJQUFQLENBQVk7QUFDckIsY0FBUSxHQUFHLElBQUgsQ0FBUSxVQUFSLENBQW1CLENBQUMsUUFBRCxFQUFVLFNBQVYsQ0FBbkIsQ0FEYTtBQUVyQixZQUFNO0FBRmUsS0FBWixDQUFYOztBQUtBLFFBQUksTUFBSSxJQUFJLEdBQUcsR0FBUCxDQUFXO0FBQ2pCLGNBQVEsS0FEUztBQUVqQixjQUFRLENBQ04sSUFBSSxHQUFHLEtBQUgsQ0FBUyxJQUFiLENBQWtCLEVBQUUsUUFBUSxJQUFJLEdBQUcsTUFBSCxDQUFVLEdBQWQsRUFBVixFQUFsQixDQURNLEVBRU4sSUFBSSxHQUFHLEtBQUgsQ0FBUyxNQUFiLENBQW9CLEVBQUUsUUFBUSxZQUFWLEVBQXBCLENBRk0sQ0FGUztBQU1qQixZQUFNO0FBTlcsS0FBWCxDQUFSO0FBUUEsUUFBSSxVQUFRLDZCQUFRLEVBQVIsRUFBVyxHQUFYLENBQVo7QUFDQSxnQ0FBTyxTQUFTLGNBQVQsQ0FBd0IsT0FBeEIsQ0FBUCxFQUF3QyxPQUF4Qzs7QUFFQSxjQUFVLFdBQVYsQ0FBc0Isa0JBQXRCLENBQTBDLFVBQUMsUUFBRCxFQUFjO0FBQ3RELFdBQUssU0FBTCxDQUNFLEdBQUcsSUFBSCxDQUFRLFVBQVIsQ0FBbUIsQ0FDakIsU0FBUyxNQUFULENBQWdCLFNBREMsRUFFakIsU0FBUyxNQUFULENBQWdCLFFBRkMsQ0FBbkIsQ0FERjtBQUlELEtBTEQsRUFLRyxpQkFBUztBQUNWLGNBQVEsR0FBUixDQUFZLEtBQVo7QUFDRCxLQVBEOztBQVNBLFdBQU8sR0FBUCxHQUFXLEdBQVg7QUFDRCxHQTVDRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGNyZWF0ZV9jb21wb25lbnRzKCl7XG4gIHZhciBsYXRsbmdJbnB1dHM9bmV3IFZ1ZSh7XG4gICAgZWw6IFwiI2Zvcm1zXCIsXG4gICAgZGF0YToge1xuICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgbGF0aXR1ZGU6IDAsXG4gICAgICAgIGxvbmdpdHVkZTogMFxuICAgICAgfVxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgc2V0RnJvbU5vd1BsYWNlOiBmdW5jdGlvbihldmVudCl7XG4gICAgICAgIGV2ZW50LnRhcmdldC5kaXNhYmxlZD10cnVlO1xuICAgICAgICBldmVudC50YXJnZXQudGV4dENvbnRlbnQ9XCJMb2FkaW5nLi4uXCJcbiAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbigocG9zaXRpb24pPT57XG4gICAgICAgICAgdGhpcy4kZGF0YS5wb3NpdGlvbi5sYXRpdHVkZT1wb3NpdGlvbi5jb29yZHMubGF0aXR1ZGU7XG4gICAgICAgICAgdGhpcy4kZGF0YS5wb3NpdGlvbi5sb25naXR1ZGU9cG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZTtcbiAgICAgICAgICBldmVudC50YXJnZXQudGV4dENvbnRlbnQ9XCJTZXQgbm93IFBvc2l0aW9uXCJcbiAgICAgICAgICBldmVudC50YXJnZXQuZGlzYWJsZWQ9ZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGNoZWNrR2VvbG9jYXRpb246IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiAhKFwiZ2VvbG9jYXRpb25cIiBpbiBuYXZpZ2F0b3IpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgd2luZG93LmxhdGxuZ0lucHV0cz1sYXRsbmdJbnB1dHM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZV9jb21wb25lbnRzO1xuIiwiLyoqXG4gKiDjg5Hjg6njg6Hjg7zjgr/lhaXlipvjg5Xjgqnjg7zjg6Djgajlrp/ooYzjga7oqK3lrprjgpLov5TjgZnplqLmlbBcbiAqIEBwYXJhbSBvbCBPcGVuTGF5ZXIzIOOBruOCquODluOCuOOCp+OCr+ODiFxuICogQHBhcmFtIG1hcCDooajnpLrnlKjjga5NYXDjgqrjg5bjgrjjgqfjgq/jg4hcbiAqL1xuZnVuY3Rpb24gZ2V0T3B0aW9ucyhvbCxtYXApe1xuICB2YXIgb3B0aW9ucyA9IHtcbiAgICBcImFkZF9zaW5nbGVfYmFsbG9uXCI6IHtcbiAgICAgIGhlYWQ6IFwiQWRkIFNpbmdsZSBCYWxsb29uXCIsXG4gICAgICB0eXBlOiBcIkxhdExvbmdcIixcbiAgICAgIGV4ZWN1dGU6IGZ1bmN0aW9uKGRhdGFzKXtcbiAgICAgICAgdmFyIGxhdGl0dWRlPWRhdGFzLmxhdGl0dWRlO1xuICAgICAgICB2YXIgbG9uZ2l0dWRlPWRhdGFzLmxvbmdpdHVkZTtcbiAgICAgICAgd2luZG93LmFsZXJ0KGxhdGl0dWRlKTtcbiAgICAgICAgd2luZG93LmFsZXJ0KGxvbmdpdHVkZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBtYXA7XG5cbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldE9wdGlvbnM7XG4iLCIvKiAgZXNsaW50IG5vLWNvbnNvbGU6IFwib2ZmXCIgKi9cbmltcG9ydCBnZXRPcHRzIGZyb20gXCJmb3JtX3NldHRpbmdzXCI7XG5pbXBvcnQgcmVuZGVyIGZyb20gXCJkb21fc2V0dGluZ3NcIjtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixmdW5jdGlvbigpe1xuICB2YXIgbWVnYW5lTXVzZXVtPSBuZXcgb2wuRmVhdHVyZSh7XG4gICAgZ2VvbWV0cnk6IG5ldyBvbC5nZW9tLlBvaW50KG9sLnByb2ouZnJvbUxvbkxhdChbMTM2LjE5ODg0MjQsMzUuOTQyNzU1N10pKVxuICB9KTtcbiAgbWVnYW5lTXVzZXVtLnNldFN0eWxlKG5ldyBvbC5zdHlsZS5TdHlsZSh7XG4gICAgaW1hZ2U6IG5ldyBvbC5zdHlsZS5DaXJjbGUoe1xuICAgICAgcmFkaXVzOiA3LFxuICAgICAgc25hcFRvUGl4ZWw6IGZhbHNlLFxuICAgICAgZmlsbDogbmV3IG9sLnN0eWxlLkZpbGwoe2NvbG9yOiBcImJsYWNrXCJ9KSxcbiAgICAgIHN0cm9rZTogbmV3IG9sLnN0eWxlLlN0cm9rZSh7XG4gICAgICAgIGNvbG9yOiBcIndoaXRlXCIsIHdpZHRoOiAyXG4gICAgICB9KVxuICAgIH0pXG4gIH0pKTtcblxuICB2YXIgdmVjdG9yU291cmNlID0gbmV3IG9sLnNvdXJjZS5WZWN0b3Ioe1xuICAgIGZlYXR1cmVzOiBbbWVnYW5lTXVzZXVtXVxuICB9KTtcbiAgdmFyIHZpZXcgPSBuZXcgb2wuVmlldyh7XG4gICAgY2VudGVyOiBvbC5wcm9qLmZyb21Mb25MYXQoWzEzOS43NTI4LDM1LjY4NTE3NV0pLFxuICAgIHpvb206IDE0XG4gIH0pO1xuXG4gIHZhciBtYXA9bmV3IG9sLk1hcCh7XG4gICAgdGFyZ2V0OiBcIm1hcFwiLFxuICAgIGxheWVyczogW1xuICAgICAgbmV3IG9sLmxheWVyLlRpbGUoeyBzb3VyY2U6IG5ldyBvbC5zb3VyY2UuT1NNKCkgfSksXG4gICAgICBuZXcgb2wubGF5ZXIuVmVjdG9yKHsgc291cmNlOiB2ZWN0b3JTb3VyY2UgfSlcbiAgICBdLFxuICAgIHZpZXc6IHZpZXdcbiAgfSk7XG4gIHZhciBvcHRpb25zPWdldE9wdHMob2wsbWFwKTtcbiAgcmVuZGVyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZm9ybXNcIiksb3B0aW9ucyk7XG5cbiAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbiggKHBvc2l0aW9uKSA9PiB7XG4gICAgdmlldy5zZXRDZW50ZXIoXG4gICAgICBvbC5wcm9qLmZyb21Mb25MYXQoW1xuICAgICAgICBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlLFxuICAgICAgICBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGVdKSk7XG4gIH0sIGVycm9yID0+IHtcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gIH0pO1xuXG4gIHdpbmRvdy5tYXA9bWFwO1xufSk7XG4iXX0=
