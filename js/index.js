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
        return [coordinate.longitude, coordinate.latitude];
      });
      console.log(coordinate_array);

      var line = new ol.geom.MultiLineString(coordinate_array);

      return new ol.Feature(line.transform("EPSG:4326", "EPSG:3857"));
    }
    return new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([pos_data.longitude, pos_data.latitude]))
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvbV9zZXR0aW5ncy5qcyIsImZvcm1fc2V0dGluZ3MuanMiLCJpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxXQUFTLFdBQVQsQ0FBcUIsR0FBckIsRUFBeUIsV0FBekIsRUFBcUMsT0FBckMsRUFBNkM7QUFDM0MsUUFBSSxZQUFKO0FBQ0EsUUFBSSxJQUFKO0FBQ0EsUUFBSSxnQkFBZ0IsQ0FBQztBQUNuQixhQUFPLE1BRFk7QUFFbkIsWUFBTSxnQkFBVSxDQUNmO0FBSGtCLEtBQUQsRUFJbEI7QUFDQSxhQUFPLGVBRFA7QUFFQSxZQUFNLGNBQVMsQ0FBVCxFQUFXO0FBQ2YsWUFBSSxTQUFPLEdBQUcsSUFBSCxDQUFRLFFBQVIsQ0FBaUIsRUFBRSxVQUFuQixDQUFYO0FBQ0EscUJBQWEsS0FBYixDQUFtQixRQUFuQixDQUE0QixTQUE1QixHQUFzQyxPQUFPLENBQVAsQ0FBdEM7QUFDQSxxQkFBYSxLQUFiLENBQW1CLFFBQW5CLENBQTRCLFFBQTVCLEdBQXFDLE9BQU8sQ0FBUCxDQUFyQztBQUNEO0FBTkQsS0FKa0IsRUFXbEI7QUFDQSxhQUFPLFdBRFA7QUFFQSxZQUFNLGVBRk47QUFHQSxZQUFNLGdCQUFVO0FBQ2QsZUFBTyxJQUFJLEdBQUcsV0FBSCxDQUFlLElBQW5CLENBQXdCO0FBQzdCLGtCQUFRLFlBQVksU0FBWixFQURxQjtBQUU3QixnQkFBTTtBQUZ1QixTQUF4QixDQUFQO0FBSUEsWUFBSSxjQUFKLENBQW1CLElBQW5CO0FBQ0Q7QUFURCxLQVhrQixDQUFwQjs7QUF1QkEsUUFBSSxrQkFBa0IsU0FBbEIsZUFBa0IsR0FBVTtBQUM5QixVQUFJLGlCQUFKLENBQXNCLElBQXRCO0FBQ0EsVUFBRyxLQUFLLGVBQUwsQ0FBcUIsSUFBckIsS0FBOEIsZUFBakMsRUFBaUQ7QUFDL0MsYUFBSyxlQUFMLENBQXFCLElBQXJCO0FBQ0Q7QUFDRixLQUxEOztBQU9BLG1CQUFhLElBQUksR0FBSixDQUFR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QVcsU0FBWixFQUF1QixXQUFXLFFBQWxDLENBRG1DO0FBQUEsT0FBZCxDQUF2QjtBQUdBLGNBQVEsR0FBUixDQUFZLGdCQUFaOztBQUVBLFVBQUksT0FBTyxJQUFJLEdBQUcsSUFBSCxDQUFRLGVBQVosQ0FBNEIsZ0JBQTVCLENBQVg7O0FBRUEsYUFBTyxJQUFJLEdBQUcsT0FBUCxDQUFlLEtBQUssU0FBTCxDQUFlLFdBQWYsRUFBNEIsV0FBNUIsQ0FBZixDQUFQO0FBQ0Q7QUFDRCxXQUFPLElBQUksR0FBRyxPQUFQLENBQWU7QUFDcEIsZ0JBQVUsSUFBSSxHQUFHLElBQUgsQ0FBUSxLQUFaLENBQ1IsR0FBRyxJQUFILENBQVEsVUFBUixDQUFtQixDQUNqQixTQUFTLFNBRFEsRUFFakIsU0FBUyxRQUZRLENBQW5CLENBRFE7QUFEVSxLQUFmLENBQVA7QUFRRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHZ1ZV9zZXR0aW5nKG1hcCx2ZWN0b3JMYXllcixvcHRpb25zKXtcbiAgdmFyIGxhdGxuZ0lucHV0cztcbiAgdmFyIGRyYXc7XG4gIHZhciBjbGlja19hY3Rpb25zID0gW3tcbiAgICBsYWJlbDogXCJOb25lXCIsXG4gICAgZnVuYzogZnVuY3Rpb24oKXtcbiAgICB9XG4gIH0se1xuICAgIGxhYmVsOiBcIlNldCBOb3cgUGxhY2VcIixcbiAgICBmdW5jOiBmdW5jdGlvbihlKXtcbiAgICAgIHZhciBsb25sYXQ9b2wucHJvai50b0xvbkxhdChlLmNvb3JkaW5hdGUpO1xuICAgICAgbGF0bG5nSW5wdXRzLiRkYXRhLnBvc2l0aW9uLmxvbmdpdHVkZT1sb25sYXRbMF07XG4gICAgICBsYXRsbmdJbnB1dHMuJGRhdGEucG9zaXRpb24ubGF0aXR1ZGU9bG9ubGF0WzFdO1xuICAgIH1cbiAgfSx7XG4gICAgbGFiZWw6IFwiRHJhdyBMaW5lXCIsXG4gICAgdHlwZTogXCJ3aGVuX3NlbGVjdGVkXCIsXG4gICAgZnVuYzogZnVuY3Rpb24oKXtcbiAgICAgIGRyYXcgPSBuZXcgb2wuaW50ZXJhY3Rpb24uRHJhdyh7XG4gICAgICAgIHNvdXJjZTogdmVjdG9yTGF5ZXIuZ2V0U291cmNlKCksXG4gICAgICAgIHR5cGU6IFwiTGluZVN0cmluZ1wiXG4gICAgICB9KTtcbiAgICAgIG1hcC5hZGRJbnRlcmFjdGlvbihkcmF3KTtcbiAgICB9XG4gIH1dO1xuXG4gIHZhciBzZWxlY3RlZEhhbmRsZXIgPSBmdW5jdGlvbigpe1xuICAgIG1hcC5yZW1vdmVJbnRlcmFjdGlvbihkcmF3KTtcbiAgICBpZih0aGlzLnNlbGVjdGVkX2FjdGlvbi50eXBlID09PSBcIndoZW5fc2VsZWN0ZWRcIil7XG4gICAgICB0aGlzLnNlbGVjdGVkX2FjdGlvbi5mdW5jKCk7XG4gICAgfVxuICB9XG5cbiAgbGF0bG5nSW5wdXRzPW5ldyBWdWUoe1xuICAgIGVsOiBcIiNmb3Jtc1wiLFxuICAgIGRhdGE6IHtcbiAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgIGxhdGl0dWRlOiAwLFxuICAgICAgICBsb25naXR1ZGU6IDBcbiAgICAgIH0sXG4gICAgICBzZWxlY3RlZF9hY3Rpb246IGNsaWNrX2FjdGlvbnNbMF0sXG4gICAgICBjbGlja19hY3Rpb25zOiBjbGlja19hY3Rpb25zLFxuICAgICAgc3RhdHVzOiBcIlwiXG4gICAgfSxcbiAgICBtZXRob2RzOiB7XG4gICAgICBzZXRGcm9tTm93UGxhY2U6IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgZXZlbnQudGFyZ2V0LmRpc2FibGVkPXRydWU7XG4gICAgICAgIGV2ZW50LnRhcmdldC50ZXh0Q29udGVudD1cIkxvYWRpbmcuLi5cIjtcbiAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbigocG9zaXRpb24pPT57XG4gICAgICAgICAgdGhpcy4kZGF0YS5wb3NpdGlvbi5sYXRpdHVkZT1wb3NpdGlvbi5jb29yZHMubGF0aXR1ZGU7XG4gICAgICAgICAgdGhpcy4kZGF0YS5wb3NpdGlvbi5sb25naXR1ZGU9cG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZTtcbiAgICAgICAgICBldmVudC50YXJnZXQudGV4dENvbnRlbnQ9XCJTZXQgbm93IFBvc2l0aW9uXCI7XG4gICAgICAgICAgZXZlbnQudGFyZ2V0LmRpc2FibGVkPWZhbHNlO1xuICAgICAgICB9LChlcnJvcik9PntcbiAgICAgICAgICB0aGlzLiRkYXRhLnN0YXR1cz1cIkVSUk9SLVwiK2Vycm9yLmNvZGUrXCI6IFwiK2Vycm9yLm1lc3NhZ2U7XG4gICAgICAgICAgZXZlbnQudGFyZ2V0LnRleHRDb250ZW50PVwiU2V0IG5vdyBQb3NpdGlvblwiO1xuICAgICAgICAgIGV2ZW50LnRhcmdldC5kaXNhYmxlZD1mYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgY2hlY2tHZW9sb2NhdGlvbjogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuICEoXCJnZW9sb2NhdGlvblwiIGluIG5hdmlnYXRvcik7XG4gICAgICB9LFxuICAgICAgZ29UbzogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHBvcz10aGlzLiRkYXRhLnBvc2l0aW9uO1xuICAgICAgICBtYXAuZ2V0VmlldygpLnNldENlbnRlcihcbiAgICAgICAgICBvbC5wcm9qLmZyb21Mb25MYXQoW3Bvcy5sb25naXR1ZGUsIHBvcy5sYXRpdHVkZV0pXG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgYWRkRmF2b3JpdGVQbGFjZTogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGxpc3Q9SlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm9sdGVzdC5mYXZvbGl0ZXBsYWNlXCIpKSB8fCBbXTtcbiAgICAgICAgbGlzdC5wdXNoKFtcbiAgICAgICAgICB0aGlzLiRkYXRhLnBvc2l0aW9uLmxvbmdpdHVkZSxcbiAgICAgICAgICB0aGlzLiRkYXRhLnBvc2l0aW9uLmxhdGl0dWRlXG4gICAgICAgIF0pO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIm9sdGVzdC5mYXZvbGl0ZXBsYWNlXCIsSlNPTi5zdHJpbmdpZnkobGlzdCkpO1xuICAgICAgICBjb25zb2xlLmxvZyhsaXN0KTtcbiAgICAgIH0sXG4gICAgICBzZXRQYXJhbVdoZW5BY3RDaGFuZ2VkOiBzZWxlY3RlZEhhbmRsZXJcbiAgICB9XG4gIH0pO1xuXG4gIG1hcC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuICAgIGlmKHR5cGVvZihsYXRsbmdJbnB1dHMuJGRhdGEuc2VsZWN0ZWRfYWN0aW9uLnR5cGUpID09PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgIGxhdGxuZ0lucHV0cy4kZGF0YS5zZWxlY3RlZF9hY3Rpb24uZnVuYyhlKTtcbiAgICB9XG4gIH0pO1xuXG4gIHdpbmRvdy5sYXRsbmdJbnB1dHM9bGF0bG5nSW5wdXRzO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2dWVfc2V0dGluZztcbiIsIi8qKlxuICog44OR44Op44Oh44O844K/5YWl5Yqb44OV44Kp44O844Og44Go5a6f6KGM44Gu6Kit5a6a44KS6L+U44GZ6Zai5pWwXG4gKiBAcGFyYW0gb2wgT3BlbkxheWVyMyDjga7jgqrjg5bjgrjjgqfjgq/jg4hcbiAqIEBwYXJhbSBtYXAg6KGo56S655So44GuTWFw44Kq44OW44K444Kn44Kv44OIXG4gKi9cbmZ1bmN0aW9uIGdldE9wdGlvbnMob2wsbWFwKXtcbiAgdmFyIG9wdGlvbnMgPSB7XG4gICAgTGF0TG9uZ0NvbnRyb2xsZXI6IHtcbiAgICAgIHNldE5vd1Bvc2l0aW9uOiB7XG4gICAgICAgIGZ1bmM6IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICBldmVudC50YXJnZXQuZGlzYWJsZWQ9dHJ1ZTtcbiAgICAgICAgICBldmVudC50YXJnZXQudGV4dENvbnRlbnQ9XCJMb2FkaW5nLi4uXCI7XG4gICAgICAgICAgY29uc29sZS5sb2codGhpcyk7XG4gICAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbihwb3NpdGlvbil7XG4gICAgICAgICAgICB0aGlzLiRkYXRhLnBvc2l0aW9uLmxhdGl0dWRlPXBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZTtcbiAgICAgICAgICAgIHRoaXMuJGRhdGEucG9zaXRpb24ubG9uZ2l0dWRlPXBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGU7XG4gICAgICAgICAgICBldmVudC50YXJnZXQudGV4dENvbnRlbnQ9XCJTZXQgTm93IFBvc2l0aW9uXCI7XG4gICAgICAgICAgICBldmVudC50YXJnZXQuZGlzYWJsZWQ9ZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGlzRW5hYmxlOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHJldHVybiAhKFwiZ2VvbG9jYXRpb25cIiBpbiBuYXZpZ2F0b3IpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZ29UbzogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHBvcz10aGlzLiRkYXRhLnBvc2l0aW9uO1xuICAgICAgICBtYXAuZ2V0VmlldygpLnNldENlbnRlcihcbiAgICAgICAgICBvbC5wcm9qLmZyb21Mb25MYXQoW3Bvcy5sb25naXR1ZGUsIHBvcy5sYXRpdHVkZV0pXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBvcHRpb25zO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRPcHRpb25zO1xuIiwiLyogIGVzbGludCBuby1jb25zb2xlOiBcIm9mZlwiICovXG5pbXBvcnQgZ2V0T3B0cyBmcm9tIFwiZm9ybV9zZXR0aW5nc1wiO1xuaW1wb3J0IHJlbmRlciBmcm9tIFwiZG9tX3NldHRpbmdzXCI7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsZnVuY3Rpb24oKXtcbiAgLypcbiAgdmFyIG1lZ2FuZU11c2V1bT0gbmV3IG9sLkZlYXR1cmUoe1xuICAgIGdlb21ldHJ5OiBuZXcgb2wuZ2VvbS5Qb2ludChvbC5wcm9qLmZyb21Mb25MYXQoWzEzNi4xOTg4NDI0LDM1Ljk0Mjc1NTddKSlcbiAgfSk7XG4gIG1lZ2FuZU11c2V1bS5zZXRTdHlsZShuZXcgb2wuc3R5bGUuU3R5bGUoe1xuICAgIGltYWdlOiBuZXcgb2wuc3R5bGUuQ2lyY2xlKHtcbiAgICAgIHJhZGl1czogNyxcbiAgICAgIHNuYXBUb1BpeGVsOiBmYWxzZSxcbiAgICAgIGZpbGw6IG5ldyBvbC5zdHlsZS5GaWxsKHtjb2xvcjogXCJibGFja1wifSksXG4gICAgICBzdHJva2U6IG5ldyBvbC5zdHlsZS5TdHJva2Uoe1xuICAgICAgICBjb2xvcjogXCJ3aGl0ZVwiLCB3aWR0aDogMlxuICAgICAgfSlcbiAgICB9KVxuICB9KSk7XG5cbiAgdmFyIHZlY3RvclNvdXJjZSA9IG5ldyBvbC5zb3VyY2UuVmVjdG9yKHtcbiAgICBmZWF0dXJlczogW21lZ2FuZU11c2V1bV1cbiAgfSk7XG4gKi9cblxuICB2YXIgdmVjdG9yTGF5b3IgPSBuZXcgb2wubGF5ZXIuVmVjdG9yKHtcbiAgICBzb3VyY2U6IG5ldyBvbC5zb3VyY2UuVmVjdG9yKClcbiAgfSk7XG4gIHZhciB2aWV3ID0gbmV3IG9sLlZpZXcoe1xuICAgIGNlbnRlcjogb2wucHJvai5mcm9tTG9uTGF0KFsxMzkuNzUyOCwzNS42ODUxNzVdKSxcbiAgICB6b29tOiAxNFxuICB9KTtcblxuICB2YXIgbWFwPW5ldyBvbC5NYXAoe1xuICAgIHRhcmdldDogXCJtYXBcIixcbiAgICBsYXllcnM6IFtcbiAgICAgIG5ldyBvbC5sYXllci5UaWxlKHsgc291cmNlOiBuZXcgb2wuc291cmNlLk9TTSgpIH0pLFxuICAgICAgdmVjdG9yTGF5b3JcbiAgICBdLFxuICAgIHZpZXc6IHZpZXdcbiAgfSk7XG5cbiAgdmFyIG9wdGlvbnM9Z2V0T3B0cyhvbCxtYXApO1xuICByZW5kZXIobWFwLHZlY3RvckxheW9yLG9wdGlvbnMpO1xuXG4gIC8vIOacgOWIneOBruaZguOBruOBv+ePvuWcqOWcsOOCkuS4reWkruOBq+OBmeOCi+OCiOOBhuOBq+OBmeOCi1xuICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKCAocG9zaXRpb24pID0+IHtcbiAgICB2aWV3LnNldENlbnRlcihcbiAgICAgIG9sLnByb2ouZnJvbUxvbkxhdChbXG4gICAgICAgIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgIHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZV0pKTtcbiAgfSwgZXJyb3IgPT4ge1xuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgfSk7XG5cbiAgc2V0RmlsZUV2ZW50cygpO1xuXG4gIHdpbmRvdy5tYXA9bWFwO1xuICB3aW5kb3cudmVjdG9yTGF5b3I9dmVjdG9yTGF5b3I7XG59KTtcblxuZnVuY3Rpb24gaGFuZGxlRHJhZ092ZXIoZSl7XG4gIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgZS5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdD1cImNvcHlcIjtcbn1cblxuZnVuY3Rpb24gaGFuZGxlRmlsZVNlbGVjdChlKXtcbiAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gIHZhciBmaWxlcz1lLmRhdGFUcmFuc2Zlci5maWxlcztcbiAgY29uc29sZS5sb2coZmlsZXMpO1xuICBhZGRQb2ludHNGcm9tRmlsZXMoZmlsZXMpO1xufVxuXG5mdW5jdGlvbiBzZXRGaWxlRXZlbnRzKCl7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLGhhbmRsZURyYWdPdmVyLGZhbHNlKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIixoYW5kbGVGaWxlU2VsZWN0LGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gYWRkUG9pbnRzRnJvbUZpbGVzKGZpbGVzKXtcbiAgZm9yKHZhciBpPTA7aTxmaWxlcy5sZW5ndGg7aSsrKXtcbiAgICBsZXQgZmlsZT1maWxlc1tpXTtcbiAgICBpZiAoZmlsZS50eXBlICE9IFwiYXBwbGljYXRpb24vanNvblwiKXtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgcmVhZGVyLm9ubG9hZD0gZnVuY3Rpb24oZSl7XG4gICAgICB2YXIgcmVzdWx0cz1KU09OLnBhcnNlKGUudGFyZ2V0LnJlc3VsdCk7XG4gICAgICByZXN1bHRzLnBvc2l0aW9ucy5mb3JFYWNoKHBvcyA9PiB7XG4gICAgICAgIHZhciBmZWF0dXJlPWZlYXR1cmVGYWN0b3J5KHBvcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKGZlYXR1cmUpO1xuICAgICAgICB3aW5kb3cudmVjdG9yTGF5b3IuZ2V0U291cmNlKCkuYWRkRmVhdHVyZShmZWF0dXJlKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmVhdHVyZUZhY3RvcnkocG9zX2RhdGEpe1xuICB2YXIgZWFydGhSYWRpdXMgPSA2Mzc4MTM3OyAvLyBbbV1cbiAgdmFyIHdnczg0U3BoZXJlID0gbmV3IG9sLlNwaGVyZShlYXJ0aFJhZGl1cyk7XG4gIGlmKFwicmFkaXVzXCIgaW4gcG9zX2RhdGEpe1xuICAgIGxldCBjaXJjbGUgPSBvbC5nZW9tLlBvbHlnb24uY2lyY3VsYXIoXG4gICAgICB3Z3M4NFNwaGVyZSxcbiAgICAgIFtcbiAgICAgICAgcG9zX2RhdGEubG9uZ2l0dWRlLFxuICAgICAgICBwb3NfZGF0YS5sYXRpdHVkZVxuICAgICAgXSxcbiAgICAgIHBvc19kYXRhLnJhZGl1cyxcbiAgICAgIDY0XG4gICAgKS50cmFuc2Zvcm0oXCJFUFNHOjQzMjZcIiwgXCJFUFNHOjM4NTdcIik7XG4gICAgcmV0dXJuIG5ldyBvbC5GZWF0dXJlKGNpcmNsZSk7XG4gIH1cbiAgaWYoQXJyYXkuaXNBcnJheShwb3NfZGF0YSkpe1xuICAgIGxldCBjb29yZGluYXRlX2FycmF5ID0gcG9zX2RhdGEubWFwKCBjb29yZGluYXRlID0+XG4gICAgICBbY29vcmRpbmF0ZS5sb25naXR1ZGUsIGNvb3JkaW5hdGUubGF0aXR1ZGVdXG4gICAgKTtcbiAgICBjb25zb2xlLmxvZyhjb29yZGluYXRlX2FycmF5KTtcblxuICAgIGxldCBsaW5lID0gbmV3IG9sLmdlb20uTXVsdGlMaW5lU3RyaW5nKGNvb3JkaW5hdGVfYXJyYXkpO1xuXG4gICAgcmV0dXJuIG5ldyBvbC5GZWF0dXJlKGxpbmUudHJhbnNmb3JtKFwiRVBTRzo0MzI2XCIsIFwiRVBTRzozODU3XCIpKTtcbiAgfVxuICByZXR1cm4gbmV3IG9sLkZlYXR1cmUoe1xuICAgIGdlb21ldHJ5OiBuZXcgb2wuZ2VvbS5Qb2ludChcbiAgICAgIG9sLnByb2ouZnJvbUxvbkxhdChbXG4gICAgICAgIHBvc19kYXRhLmxvbmdpdHVkZSxcbiAgICAgICAgcG9zX2RhdGEubGF0aXR1ZGVcbiAgICAgIF0pXG4gICAgKVxuICB9KTtcbn1cbiJdfQ==
