/**
 * パラメータ入力フォームと実行の設定を返す関数
 * @param ol OpenLayer3 のオブジェクト
 * @param map 表示用のMapオブジェクト
 */
function getOptions(ol,map){
  var options = {
    LatLongController: {
      setNowPosition: {
        func: function(event){
          event.target.disabled=true;
          event.target.textContent="Loading...";
          console.log(this);
          navigator.geolocation.getCurrentPosition(function(position){
            this.$data.position.latitude=position.coords.latitude;
            this.$data.position.longitude=position.coords.longitude;
            event.target.textContent="Set Now Position";
            event.target.disabled=false;
          });
        },
        isEnable: function(){
          return !("geolocation" in navigator);
        }
      },
      goTo: function(){
        var pos=this.$data.position;
        map.getView().setCenter(
          ol.proj.fromLonLat([pos.longitude, pos.latitude])
        );
      }
    }
  };

  return options;
}

export default getOptions;
