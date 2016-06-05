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

var LatLongForm=React.createClass({
  clickHandler: function(){
    var data={
      latitude: ReactDOM.findDOMNode(this.refs.latitude).value.trim(),
      longitude: ReactDOM.findDOMNode(this.refs.longitude).value.trim()
    };
    this.props.setting.execute(data);
  },
  render: function(){
    return (
        <div className="LatLongForm">
        <h2> {this.props.setting.head} </h2>
        緯度: <input type="number" ref="latitude" /><br />
        経度: <input type="number" ref="longitude" /><br />
        <button onClick={this.clickHandler}>
        Do It!!!!
        </button>
        </div>
        );
  }
});

function factoryComponent(setting){
  var componentMap={
    "LatLong" : setting => ( <LatLongForm setting={setting} /> )
  };

  return componentMap[setting.type](setting);
}

var InputBox=React.createClass({
  render: function(){
    var settings=this.props.settings;
    var nodes=Object.keys(settings).map(key => factoryComponent(settings[key] ));
    return ( <div className="InputBox"> {nodes} </div>);
  }
});

var create_components=function(node,settings){
  ReactDOM.render(<InputBox settings={settings} />, node);
};

export default create_components;
