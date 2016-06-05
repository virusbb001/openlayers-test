/**
 * パラメータ入力フォームと実行の設定を返す関数
 * @param ol OpenLayer3 のオブジェクト
 * @param map 表示用のMapオブジェクト
 */
function getOptions(ol,map){
  var options = {
    "add_single_ballon": {
      head: "Add Single Balloon",
      type: "LatLong",
      execute: function(datas){
        var latitude=datas.latitude;
        var longitude=datas.longitude;
        window.alert(latitude);
        window.alert(longitude);
      }
    }
  };
  map;

  return options;
}

export default getOptions;
