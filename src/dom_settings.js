function vue_setting(map,options){
  var latlngInputs;
  var click_actions = [{
    label: "Set Now Place",
    func: (e)=>{
      var lonlat=ol.proj.toLonLat(e.coordinate);
      if(latlngInputs.$data.flags.setWhenClicked){
        latlngInputs.$data.position.longitude=lonlat[0];
        latlngInputs.$data.position.latitude=lonlat[1];
      }
    }
  }];

  latlngInputs=new Vue({
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
        var lon=
        list.push([
          this.$data.position.longitude,
          this.$data.position.latitude
        ]);
        localStorage.setItem("oltest.favoliteplace",JSON.stringify(list));
        console.log(list);
      }
    }
  });

  map.on("click", function(e){
    click_actions[0].func(e);
  });

  window.latlngInputs=latlngInputs;
}

export default vue_setting;
