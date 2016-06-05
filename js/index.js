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
    global.dom_components = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /*
   * this is for custom input
  var Inputs=React.createClass({
    clickHandler: function(){
      var values=this.refs.k
      console.log(this.refs);
    },
    render: function(){
      var isString = val => (typeof(val) === "string" || val instanceof String);
      var setting=this.props.setting;
      var inputData=setting.inputs.map( input => isString(input) ? {name: input} : input);
      var inputComponents=inputData.map( input => (
            <input type={input.type || "text"} ref={input.name} placeholder={input.name} />
            ));
      return (
          <div className="Inputs">
          <h2>{setting.head}</h2>
          {inputComponents}
          <button onClick={this.clickHandler}>
          Evalute!!
          </button>
          </div>
          );
    }
  });
  */

  var LatLongForm = React.createClass({
    displayName: "LatLongForm",

    clickHandler: function clickHandler() {
      var data = {
        latitude: ReactDOM.findDOMNode(this.refs.latitude).value.trim(),
        longitude: ReactDOM.findDOMNode(this.refs.longitude).value.trim()
      };
      this.props.setting.execute(data);
    },
    render: function render() {
      return React.createElement(
        "div",
        { className: "LatLongForm" },
        React.createElement(
          "h2",
          null,
          " ",
          this.props.setting.head,
          " "
        ),
        "緯度: ",
        React.createElement("input", { type: "number", ref: "latitude" }),
        React.createElement("br", null),
        "経度: ",
        React.createElement("input", { type: "number", ref: "longitude" }),
        React.createElement("br", null),
        React.createElement(
          "button",
          { onClick: this.clickHandler },
          "Do It!!!!"
        )
      );
    }
  });

  function factoryComponent(setting) {
    var componentMap = {
      "LatLong": function LatLong(setting) {
        return React.createElement(LatLongForm, { setting: setting });
      }
    };

    return componentMap[setting.type](setting);
  }

  var InputBox = React.createClass({
    displayName: "InputBox",

    render: function render() {
      var settings = this.props.settings;
      var nodes = Object.keys(settings).map(function (key) {
        return factoryComponent(settings[key]);
      });
      return React.createElement(
        "div",
        { className: "InputBox" },
        " ",
        nodes,
        " "
      );
    }
  });

  var create_components = function create_components(node, settings) {
    ReactDOM.render(React.createElement(InputBox, { settings: settings }), node);
  };

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
    define(["form_settings", "dom_components"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("form_settings"), require("dom_components"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.form_settings, global.dom_components);
    global.index = mod.exports;
  }
})(this, function (_form_settings, _dom_components) {
  "use strict";

  var _form_settings2 = _interopRequireDefault(_form_settings);

  var _dom_components2 = _interopRequireDefault(_dom_components);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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

    var map = new ol.Map({
      target: "map",
      layers: [new ol.layer.Tile({ source: new ol.source.OSM() }), new ol.layer.Vector({ source: vectorSource })],
      view: new ol.View({
        center: ol.proj.fromLonLat([136.223333, 36.062083]),
        zoom: 14
      })
    });
    var options = (0, _form_settings2.default)(ol, map);
    (0, _dom_components2.default)(document.getElementById("forms"), options);
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvbV9jb21wb25lbnRzLmpzIiwiZm9ybV9zZXR0aW5ncy5qcyIsImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQSxNQUFJLGNBQVksTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQ2hDLGtCQUFjLHdCQUFVO0FBQ3RCLFVBQUksT0FBSztBQUNQLGtCQUFVLFNBQVMsV0FBVCxDQUFxQixLQUFLLElBQUwsQ0FBVSxRQUEvQixFQUF5QyxLQUF6QyxDQUErQyxJQUEvQyxFQURIO0FBRVAsbUJBQVcsU0FBUyxXQUFULENBQXFCLEtBQUssSUFBTCxDQUFVLFNBQS9CLEVBQTBDLEtBQTFDLENBQWdELElBQWhEO0FBRkosT0FBVDtBQUlBLFdBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsT0FBbkIsQ0FBMkIsSUFBM0I7QUFDRCxLQVArQjtBQVFoQyxZQUFRLGtCQUFVO0FBQ2hCLGFBQ0k7QUFBQTtRQUFBLEVBQUssV0FBVSxhQUFmO1FBQ0E7QUFBQTtVQUFBO1VBQUE7VUFBTSxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLElBQXpCO1VBQUE7QUFBQSxTQURBO1FBQUE7UUFFSSwrQkFBTyxNQUFLLFFBQVosRUFBcUIsS0FBSSxVQUF6QixHQUZKO1FBRTBDLCtCQUYxQztRQUFBO1FBR0ksK0JBQU8sTUFBSyxRQUFaLEVBQXFCLEtBQUksV0FBekIsR0FISjtRQUcyQywrQkFIM0M7UUFJQTtBQUFBO1VBQUEsRUFBUSxTQUFTLEtBQUssWUFBdEI7VUFBQTtBQUFBO0FBSkEsT0FESjtBQVVEO0FBbkIrQixHQUFsQixDQUFoQjs7QUFzQkEsV0FBUyxnQkFBVCxDQUEwQixPQUExQixFQUFrQztBQUNoQyxRQUFJLGVBQWE7QUFDZixpQkFBWTtBQUFBLGVBQWEsb0JBQUMsV0FBRCxJQUFhLFNBQVMsT0FBdEIsR0FBYjtBQUFBO0FBREcsS0FBakI7O0FBSUEsV0FBTyxhQUFhLFFB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TyxTQUFTLGNBQVQsQ0FBd0IsT0FBeEIsQ0FBUCxFQUF3QyxPQUF4QztBQUNELEdBaENEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIHRoaXMgaXMgZm9yIGN1c3RvbSBpbnB1dFxudmFyIElucHV0cz1SZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGNsaWNrSGFuZGxlcjogZnVuY3Rpb24oKXtcbiAgICB2YXIgdmFsdWVzPXRoaXMucmVmcy5rXG4gICAgY29uc29sZS5sb2codGhpcy5yZWZzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpe1xuICAgIHZhciBpc1N0cmluZyA9IHZhbCA9PiAodHlwZW9mKHZhbCkgPT09IFwic3RyaW5nXCIgfHwgdmFsIGluc3RhbmNlb2YgU3RyaW5nKTtcbiAgICB2YXIgc2V0dGluZz10aGlzLnByb3BzLnNldHRpbmc7XG4gICAgdmFyIGlucHV0RGF0YT1zZXR0aW5nLmlucHV0cy5tYXAoIGlucHV0ID0+IGlzU3RyaW5nKGlucHV0KSA/IHtuYW1lOiBpbnB1dH0gOiBpbnB1dCk7XG4gICAgdmFyIGlucHV0Q29tcG9uZW50cz1pbnB1dERhdGEubWFwKCBpbnB1dCA9PiAoXG4gICAgICAgICAgPGlucHV0IHR5cGU9e2lucHV0LnR5cGUgfHwgXCJ0ZXh0XCJ9IHJlZj17aW5wdXQubmFtZX0gcGxhY2Vob2xkZXI9e2lucHV0Lm5hbWV9IC8+XG4gICAgICAgICAgKSk7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJJbnB1dHNcIj5cbiAgICAgICAgPGgyPntzZXR0aW5nLmhlYWR9PC9oMj5cbiAgICAgICAge2lucHV0Q29tcG9uZW50c31cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt0aGlzLmNsaWNrSGFuZGxlcn0+XG4gICAgICAgIEV2YWx1dGUhIVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gIH1cbn0pO1xuKi9cblxudmFyIExhdExvbmdGb3JtPVJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgY2xpY2tIYW5kbGVyOiBmdW5jdGlvbigpe1xuICAgIHZhciBkYXRhPXtcbiAgICAgIGxhdGl0dWRlOiBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLnJlZnMubGF0aXR1ZGUpLnZhbHVlLnRyaW0oKSxcbiAgICAgIGxvbmdpdHVkZTogUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5yZWZzLmxvbmdpdHVkZSkudmFsdWUudHJpbSgpXG4gICAgfTtcbiAgICB0aGlzLnByb3BzLnNldHRpbmcuZXhlY3V0ZShkYXRhKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpe1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiTGF0TG9uZ0Zvcm1cIj5cbiAgICAgICAgPGgyPiB7dGhpcy5wcm9wcy5zZXR0aW5nLmhlYWR9IDwvaDI+XG4gICAgICAgIOe3r+W6pjogPGlucHV0IHR5cGU9XCJudW1iZXJcIiByZWY9XCJsYXRpdHVkZVwiIC8+PGJyIC8+XG4gICAgICAgIOe1jOW6pjogPGlucHV0IHR5cGU9XCJudW1iZXJcIiByZWY9XCJsb25naXR1ZGVcIiAvPjxiciAvPlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuY2xpY2tIYW5kbGVyfT5cbiAgICAgICAgRG8gSXQhISEhXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIGZhY3RvcnlDb21wb25lbnQoc2V0dGluZyl7XG4gIHZhciBjb21wb25lbnRNYXA9e1xuICAgIFwiTGF0TG9uZ1wiIDogc2V0dGluZyA9PiAoIDxMYXRMb25nRm9ybSBzZXR0aW5nPXtzZXR0aW5nfSAvPiApXG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvbmVudE1hcFtzZXR0aW5nLnR5cGVdKHNldHRpbmcpO1xufVxuXG52YXIgSW5wdXRCb3g9UmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHNldHRpbmdzPXRoaXMucHJvcHMuc2V0dGluZ3M7XG4gICAgdmFyIG5vZGVzPU9iamVjdC5rZXlzKHNldHRpbmdzKS5tYXAoa2V5ID0+IGZhY3RvcnlDb21wb25lbnQoc2V0dGluZ3Nba2V5XSApKTtcbiAgICByZXR1cm4gKCA8ZGl2IGNsYXNzTmFtZT1cIklucHV0Qm94XCI+IHtub2Rlc30gPC9kaXY+KTtcbiAgfVxufSk7XG5cbnZhciBjcmVhdGVfY29tcG9uZW50cz1mdW5jdGlvbihub2RlLHNldHRpbmdzKXtcbiAgUmVhY3RET00ucmVuZGVyKDxJbnB1dEJveCBzZXR0aW5ncz17c2V0dGluZ3N9IC8+LCBub2RlKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZV9jb21wb25lbnRzO1xuIiwiLyoqXG4gKiDjg5Hjg6njg6Hjg7zjgr/lhaXlipvjg5Xjgqnjg7zjg6Djgajlrp/ooYzjga7oqK3lrprjgpLov5TjgZnplqLmlbBcbiAqIEBwYXJhbSBvbCBPcGVuTGF5ZXIzIOOBruOCquODluOCuOOCp+OCr+ODiFxuICogQHBhcmFtIG1hcCDooajnpLrnlKjjga5NYXDjgqrjg5bjgrjjgqfjgq/jg4hcbiAqL1xuZnVuY3Rpb24gZ2V0T3B0aW9ucyhvbCxtYXApe1xuICB2YXIgb3B0aW9ucyA9IHtcbiAgICBcImFkZF9zaW5nbGVfYmFsbG9uXCI6IHtcbiAgICAgIGhlYWQ6IFwiQWRkIFNpbmdsZSBCYWxsb29uXCIsXG4gICAgICB0eXBlOiBcIkxhdExvbmdcIixcbiAgICAgIGV4ZWN1dGU6IGZ1bmN0aW9uKGRhdGFzKXtcbiAgICAgICAgdmFyIGxhdGl0dWRlPWRhdGFzLmxhdGl0dWRlO1xuICAgICAgICB2YXIgbG9uZ2l0dWRlPWRhdGFzLmxvbmdpdHVkZTtcbiAgICAgICAgd2luZG93LmFsZXJ0KGxhdGl0dWRlKTtcbiAgICAgICAgd2luZG93LmFsZXJ0KGxvbmdpdHVkZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBtYXA7XG5cbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldE9wdGlvbnM7XG4iLCJpbXBvcnQgZ2V0T3B0cyBmcm9tIFwiZm9ybV9zZXR0aW5nc1wiO1xuaW1wb3J0IHJlbmRlciBmcm9tIFwiZG9tX2NvbXBvbmVudHNcIjtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixmdW5jdGlvbigpe1xuICB2YXIgbWVnYW5lTXVzZXVtPSBuZXcgb2wuRmVhdHVyZSh7XG4gICAgZ2VvbWV0cnk6IG5ldyBvbC5nZW9tLlBvaW50KG9sLnByb2ouZnJvbUxvbkxhdChbMTM2LjE5ODg0MjQsMzUuOTQyNzU1N10pKVxuICB9KTtcbiAgbWVnYW5lTXVzZXVtLnNldFN0eWxlKG5ldyBvbC5zdHlsZS5TdHlsZSh7XG4gICAgaW1hZ2U6IG5ldyBvbC5zdHlsZS5DaXJjbGUoe1xuICAgICAgcmFkaXVzOiA3LFxuICAgICAgc25hcFRvUGl4ZWw6IGZhbHNlLFxuICAgICAgZmlsbDogbmV3IG9sLnN0eWxlLkZpbGwoe2NvbG9yOiBcImJsYWNrXCJ9KSxcbiAgICAgIHN0cm9rZTogbmV3IG9sLnN0eWxlLlN0cm9rZSh7XG4gICAgICAgIGNvbG9yOiBcIndoaXRlXCIsIHdpZHRoOiAyXG4gICAgICB9KVxuICAgIH0pXG4gIH0pKTtcblxuICB2YXIgdmVjdG9yU291cmNlID0gbmV3IG9sLnNvdXJjZS5WZWN0b3Ioe1xuICAgIGZlYXR1cmVzOiBbbWVnYW5lTXVzZXVtXVxuICB9KTtcblxuICB2YXIgbWFwPW5ldyBvbC5NYXAoe1xuICAgIHRhcmdldDogXCJtYXBcIixcbiAgICBsYXllcnM6IFtcbiAgICAgIG5ldyBvbC5sYXllci5UaWxlKHsgc291cmNlOiBuZXcgb2wuc291cmNlLk9TTSgpIH0pLFxuICAgICAgbmV3IG9sLmxheWVyLlZlY3Rvcih7IHNvdXJjZTogdmVjdG9yU291cmNlIH0pXG4gICAgXSxcbiAgICB2aWV3OiBuZXcgb2wuVmlldyh7XG4gICAgICBjZW50ZXI6IG9sLnByb2ouZnJvbUxvbkxhdChbMTM2LjIyMzMzMywzNi4wNjIwODNdKSxcbiAgICAgIHpvb206IDE0XG4gICAgfSlcbiAgfSk7XG4gIHZhciBvcHRpb25zPWdldE9wdHMob2wsbWFwKTtcbiAgcmVuZGVyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZm9ybXNcIiksb3B0aW9ucyk7XG59KTtcbiJdfQ==
