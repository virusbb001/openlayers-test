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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvbV9zZXR0aW5ncy5qcyIsImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLFdBQVMsaUJBQVQsR0FBNEI7QUFDMUIsUUFBSSxlQUFhLElBQUksR0FBSixDQUFRO0FBQ3ZCLFVBQUksUUFEbUI7QUFFdkIsWUFBTTtBQUNKLGtCQUFVO0FBQ1Isb0JBQVUsQ0FERjtBQUVSLHFCQUFXO0FBRkg7QUFETixPQUZpQjtBQVF2QixlQUFTO0FBQ1AseUJBQWlCLHlCQUFTLEtBQVQsRUFBZTtBQUFBOztBQUM5QixnQkFBTSxNQUFOLENBQWEsUUFBYixHQUFzQixJQUF0QjtBQUNBLGdCQUFNLE1BQU4sQ0FBYSxXQUFiLEdBQXlCLFlBQXpCO0FBQ0Esb0JBQVUsV0FBVixDQUFzQixrQkFBdEIsQ0FBeUMsVUFBQyxRQUFELEVBQVk7QUFDbkQsa0JBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsUUFBcEIsR0FBNkIsU0FBUyxNQUFULENBQWdCLFFBQTdDO0FBQ0Esa0JBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsU0FBcEIsR0FBOEIsU0FBUyxNQUFULENBQWdCLFNBQTlDO0FBQ0Esa0JBQU0sTUFBTixDQUFhLFdBQWIsR0FBeUIsa0JBQXpCO0FBQ0Esa0JBQU0sTUFBTixDQUFhLFFBQWIsR0FBc0IsS0FBdEI7QUFDRCxXQUxEO0FBTUQsU0FWTTtBQVdQLDBCQUFrQiw0QkFBVTtBQUMxQixpQkFBTyxFQUFFLGlCQUFpQixTQUFuQixDQUFQO0FBQ0Q7QUFiTTtBQVJjLEtBQVIsQ0FBakI7O0FBeUJBLFdBQU8sWUFBUCxHQUFvQixZQUFwQjtBQUNEOztvQkFFYzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekJmLFdBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQTZDLFlBQVU7QUFDckQsUUFBSSxlQUFjLElBQUksR0FBRyxPQUFQLENBQWU7QUFDL0IsZ0JBQVUsSUFBSSxHQUFHLElBQUgsQ0FBUSxLQUFaLENBQWtCLEdBQUcsSUFBSCxDQUFRLFVBQVIsQ0FBbUIsQ0FBQyxXQUFELEVBQWEsVUFBYixDQUFuQixDQUFsQjtBQURxQixLQUFmLENBQWxCO0FBR0EsaUJBQWEsUUFBYixDQUFzQixJQUFJLEdBQUcsS0FBSCxDQUFTLEtBQWIsQ0FBbUI7QUFDdkMsYUFBTyxJQUFJLEdBQUcsS0FBSCxDQUFTLE1BQWIsQ0FBb0I7QUFDekIsZ0JBQVEsQ0FEaUI7QUFFekIscUJBQWEsS0FGWTtBQUd6QixjQUFNLElBQUksR0FBRyxLQUFILENBQVMsSUFBYixDQUFrQixFQUFDLE9BQU8sT0FBUixFQUFsQixDQUhtQjtBQUl6QixnQkFBUSxJQUFJLEdBQUcsS0FBSCxDQUFTLE1BQWIsQ0FBb0I7QUFDMUIsaUJBQU8sT0FEbUIsRUFDVixPQUFPO0FBREcsU0FBcEI7QUFKaUIsT0FBcEI7QUFEZ0MsS0FBbkIsQ0FBdEI7O0FBV0EsUUFBSSxlQUFlLElBQUksR0FBRyxNQUFILENBQVUsTUFBZCxDQUFxQjtBQUN0QyxnQkFBVSxDQUFDLFlBQUQ7QUFENEIsS0FBckIsQ0FBbkI7QUFHQSxRQUFJLE9BQU8sSUFBSSxHQUFHLElBQVAsQ0FBWTtBQUNyQixjQUFRLEdBQUcsSUFBSCxDQUFRLFVBQVIsQ0FBbUIsQ0FBQyxRQUFELEVBQVUsU0FBVixDQUFuQixDQURhO0FBRXJCLFlBQU07QUFGZSxLQUFaLENBQVg7O0FBS0EsUUFBSSxNQUFJLElBQUksR0FBRyxHQUFQLENBQVc7QUFDakIsY0FBUSxLQURTO0FBRWpCLGNBQVEsQ0FDTixJQUFJLEdBQUcsS0FBSCxDQUFTLElBQWIsQ0FBa0IsRUFBRSxRQUFRLElBQUksR0FBRyxNQUFILENBQVUsR0FBZCxFQUFWLEVBQWxCLENBRE0sRUFFTixJQUFJLEdBQUcsS0FBSCxDQUFTLE1BQWIsQ0FBb0IsRUFBRSxRQUFRLFlBQVYsRUFBcEIsQ0FGTSxDQUZTO0FBTWpCLFlBQU07QUFOVyxLQUFYLENBQVI7QUFRQSxRQUFJLFVBQVEsNkJBQVEsRUFBUixFQUFXLEdBQVgsQ0FBWjtBQUNBLGdDQUFPLFNBQVMsY0FBVCxDQUF3QixPQUF4QixDQUFQLEVBQXdDLE9BQXhDOztBQUVBLGNBQVUsV0FBVixDQUFzQixrQkFBdEIsQ0FBMEMsVUFBQyxRQUFELEVBQWM7QUFDdEQsV0FBSyxTQUFMLENBQ0UsR0FBRyxJQUFILENBQVEsVUFBUixDQUFtQixDQUNqQixTQUFTLE1BQVQsQ0FBZ0IsU0FEQyxFQUVqQixTQUFTLE1BQVQsQ0FBZ0IsUUFGQyxDQUFuQixDQURGO0FBSUQsS0FMRCxFQUtHLGlCQUFTO0FBQ1YsY0FBUSxHQUFSLENBQVksS0FBWjtBQUNELEtBUEQ7O0FBU0EsV0FBTyxHQUFQLEdBQVcsR0FBWDtBQUNELEdBNUNEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gY3JlYXRlX2NvbXBvbmVudHMoKXtcbiAgdmFyIGxhdGxuZ0lucHV0cz1uZXcgVnVlKHtcbiAgICBlbDogXCIjZm9ybXNcIixcbiAgICBkYXRhOiB7XG4gICAgICBwb3NpdGlvbjoge1xuICAgICAgICBsYXRpdHVkZTogMCxcbiAgICAgICAgbG9uZ2l0dWRlOiAwXG4gICAgICB9XG4gICAgfSxcbiAgICBtZXRob2RzOiB7XG4gICAgICBzZXRGcm9tTm93UGxhY2U6IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgZXZlbnQudGFyZ2V0LmRpc2FibGVkPXRydWU7XG4gICAgICAgIGV2ZW50LnRhcmdldC50ZXh0Q29udGVudD1cIkxvYWRpbmcuLi5cIlxuICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKChwb3NpdGlvbik9PntcbiAgICAgICAgICB0aGlzLiRkYXRhLnBvc2l0aW9uLmxhdGl0dWRlPXBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZTtcbiAgICAgICAgICB0aGlzLiRkYXRhLnBvc2l0aW9uLmxvbmdpdHVkZT1wb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlO1xuICAgICAgICAgIGV2ZW50LnRhcmdldC50ZXh0Q29udGVudD1cIlNldCBub3cgUG9zaXRpb25cIlxuICAgICAgICAgIGV2ZW50LnRhcmdldC5kaXNhYmxlZD1mYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgY2hlY2tHZW9sb2NhdGlvbjogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuICEoXCJnZW9sb2NhdGlvblwiIGluIG5hdmlnYXRvcik7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICB3aW5kb3cubGF0bG5nSW5wdXRzPWxhdGxuZ0lucHV0cztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlX2NvbXBvbmVudHM7XG4iLCIvKiAgZXNsaW50IG5vLWNvbnNvbGU6IFwib2ZmXCIgKi9cbmltcG9ydCBnZXRPcHRzIGZyb20gXCJmb3JtX3NldHRpbmdzXCI7XG5pbXBvcnQgcmVuZGVyIGZyb20gXCJkb21fc2V0dGluZ3NcIjtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixmdW5jdGlvbigpe1xuICB2YXIgbWVnYW5lTXVzZXVtPSBuZXcgb2wuRmVhdHVyZSh7XG4gICAgZ2VvbWV0cnk6IG5ldyBvbC5nZW9tLlBvaW50KG9sLnByb2ouZnJvbUxvbkxhdChbMTM2LjE5ODg0MjQsMzUuOTQyNzU1N10pKVxuICB9KTtcbiAgbWVnYW5lTXVzZXVtLnNldFN0eWxlKG5ldyBvbC5zdHlsZS5TdHlsZSh7XG4gICAgaW1hZ2U6IG5ldyBvbC5zdHlsZS5DaXJjbGUoe1xuICAgICAgcmFkaXVzOiA3LFxuICAgICAgc25hcFRvUGl4ZWw6IGZhbHNlLFxuICAgICAgZmlsbDogbmV3IG9sLnN0eWxlLkZpbGwoe2NvbG9yOiBcImJsYWNrXCJ9KSxcbiAgICAgIHN0cm9rZTogbmV3IG9sLnN0eWxlLlN0cm9rZSh7XG4gICAgICAgIGNvbG9yOiBcIndoaXRlXCIsIHdpZHRoOiAyXG4gICAgICB9KVxuICAgIH0pXG4gIH0pKTtcblxuICB2YXIgdmVjdG9yU291cmNlID0gbmV3IG9sLnNvdXJjZS5WZWN0b3Ioe1xuICAgIGZlYXR1cmVzOiBbbWVnYW5lTXVzZXVtXVxuICB9KTtcbiAgdmFyIHZpZXcgPSBuZXcgb2wuVmlldyh7XG4gICAgY2VudGVyOiBvbC5wcm9qLmZyb21Mb25MYXQoWzEzOS43NTI4LDM1LjY4NTE3NV0pLFxuICAgIHpvb206IDE0XG4gIH0pO1xuXG4gIHZhciBtYXA9bmV3IG9sLk1hcCh7XG4gICAgdGFyZ2V0OiBcIm1hcFwiLFxuICAgIGxheWVyczogW1xuICAgICAgbmV3IG9sLmxheWVyLlRpbGUoeyBzb3VyY2U6IG5ldyBvbC5zb3VyY2UuT1NNKCkgfSksXG4gICAgICBuZXcgb2wubGF5ZXIuVmVjdG9yKHsgc291cmNlOiB2ZWN0b3JTb3VyY2UgfSlcbiAgICBdLFxuICAgIHZpZXc6IHZpZXdcbiAgfSk7XG4gIHZhciBvcHRpb25zPWdldE9wdHMob2wsbWFwKTtcbiAgcmVuZGVyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZm9ybXNcIiksb3B0aW9ucyk7XG5cbiAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbiggKHBvc2l0aW9uKSA9PiB7XG4gICAgdmlldy5zZXRDZW50ZXIoXG4gICAgICBvbC5wcm9qLmZyb21Mb25MYXQoW1xuICAgICAgICBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlLFxuICAgICAgICBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGVdKSk7XG4gIH0sIGVycm9yID0+IHtcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gIH0pO1xuXG4gIHdpbmRvdy5tYXA9bWFwO1xufSk7XG4iXX0=
