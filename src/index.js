import getOpts from "form_settings";
import render from "dom_components";

document.addEventListener("DOMContentLoaded",function(){
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

  var map=new ol.Map({
    target: "map",
    layers: [
      new ol.layer.Tile({ source: new ol.source.OSM() }),
      new ol.layer.Vector({ source: vectorSource })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([136.223333,36.062083]),
      zoom: 14
    })
  });
  var options=getOpts(ol,map);
  render(document.getElementById("forms"),options);
});
