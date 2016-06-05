var Inputs=React.createClass({
  render: function(){
    return (
        <div>{this.props.setting.head}</div>
        );
  }
});

var InputBox=React.createClass({
  render: function(){
    var settings=this.props.settings;
    var nodes=Object.keys(settings).map(function(key){
      return <Inputs setting={settings[key]} />;
    });
    return ( <div> {nodes} </div>);
  }
});

var create_components=function(node,settings){
  ReactDOM.render(<InputBox settings={settings} />, node);
};

export default create_components;
