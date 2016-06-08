function create_components(){
  var latlngInputs=new Vue({
    el: "#forms",
    data: {
      position: {
        latitude: 0,
        longitude: 0
      }
    },
    methods: {
      setFromNowPlace: function(event){
        event.target.disabled=true;
        event.target.textContent="Loading..."
        navigator.geolocation.getCurrentPosition((position)=>{
          this.$data.position.latitude=position.coords.latitude;
          this.$data.position.longitude=position.coords.longitude;
          event.target.textContent="Set now Position"
          event.target.disabled=false;
        });
      },
      checkGeolocation: function(){
        return !("geolocation" in navigator);
      }
    }
  });

  window.latlngInputs=latlngInputs;
}

export default create_components;
