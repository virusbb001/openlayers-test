/*  eslint no-console: "off" */
import getOpts from "form_settings";
import render from "dom_settings";

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
  var view = new ol.View({
    center: ol.proj.fromLonLat([139.7528,35.685175]),
    zoom: 14
  });

  var map=new ol.Map({
    target: "map",
    layers: [
      new ol.layer.Tile({ source: new ol.source.OSM() }),
      new ol.layer.Vector({ source: vectorSource })
    ],
    view: view
  });

  var options=getOpts(ol,map);
  render(map,options);

  // 最初の時のみ現在地を中央にするようにする
  navigator.geolocation.getCurrentPosition( (position) => {
    view.setCenter(
      ol.proj.fromLonLat([
        position.coords.longitude,
        position.coords.latitude]));
  }, error => {
    console.log(error);
  });

  setFileEvents();

  window.map=map;
});

function handleDragOver(e){
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect="copy";
}

function handleFileSelect(e){
  e.stopPropagation();
  e.preventDefault();

  var files=e.dataTransfer.files;
  console.log(files);
  addPointsFromFiles(files);
}

function setFileEvents(){
  document.addEventListener("dragover",handleDragOver,false);
  document.addEventListener("drop",handleFileSelect,false);
}

function addPointsFromFiles(files){
  for(var i=0;i<files.length;i++){
    let file=files[i];
    if (file.type != "application/json"){
      return false;
    }
    var reader = new FileReader();
    reader.onload= function(e){
      var results=JSON.parse(e.target.result);
      // TODO: here to code
      console.log(results);
    };
    reader.readAsText(file);
  }
}
