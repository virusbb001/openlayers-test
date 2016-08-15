function vue_setting(map,vectorLayer,options){
  var latlngInputs;
  var draw;
  var click_actions = [{
    label: "None",
    func: function(){
    }
  },{
    label: "Set Now Place",
    func: function(e){
      var lonlat=ol.proj.toLonLat(e.coordinate);
      latlngInputs.$data.position.longitude=lonlat[0];
      latlngInputs.$data.position.latitude=lonlat[1];
    }
  },{
    label: "Draw Line",
    type: "when_selected",
    func: function(){
      draw = new ol.interaction.Draw({
        source: vectorLayer.getSource(),
        type: "LineString"
      });
      map.addInteraction(draw);
    }
  }];

  var selectedHandler = function(){
    map.removeInteraction(draw);
    if(this.selected_action.type === "when_selected"){
      this.selected_action.func();
    }
  };

  latlngInputs=new Vue({
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
      setFromNowPlace: function(event){
        event.target.disabled=true;
        event.target.textContent="Loading...";
        navigator.geolocation.getCurrentPosition((position)=>{
          this.$data.position.latitude=position.coords.latitude;
          this.$data.position.longitude=position.coords.longitude;
          event.target.textContent="Set now Position";
          event.target.disabled=false;
        },(error)=>{
          this.$data.status="ERROR-"+error.code+": "+error.message;
          event.target.textContent="Set now Position";
          event.target.disabled=false;
        });
      },
      checkGeolocation: function(){
        return !("geolocation" in navigator);
      },
      goTo: function(){
        var pos=this.$data.position;
        map.getView().setCenter(
          ol.proj.fromLonLat([pos.longitude, pos.latitude])
        );
      },
      addFavoritePlace: function(){
        var list=JSON.parse(localStorage.getItem("oltest.favoliteplace")) || [];
        list.push([
          this.$data.position.longitude,
          this.$data.position.latitude
        ]);
        localStorage.setItem("oltest.favoliteplace",JSON.stringify(list));
      },
      setParamWhenActChanged: selectedHandler
    }
  });

  map.on("click", function(e){
    if(typeof(latlngInputs.$data.selected_action.type) === "undefined"){
      latlngInputs.$data.selected_action.func(e);
    }
  });

  window.latlngInputs=latlngInputs;
}

export default vue_setting;
