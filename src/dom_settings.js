function vue_setting(map,options){
  var latlngInputs=new Vue({
    el: "#forms",
    data: {
      position: {
        latitude: 0,
        longitude: 0
      },
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
      }
    }
  });

  window.latlngInputs=latlngInputs;
}

export default vue_setting;
