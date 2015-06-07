var MapLayerToggle = React.createClass({
  showLayer: function(event) {
    map.addLayer(mapLayers[this.props.layerName])
  },
  hideLayer: function(argument) {
    map.removeLayer(mapLayers[this.props.layerName])
  },
  render: function(){
    return (
      <li>
        <button onClick={this.showLayer}>
         Affordable Housing On
        </button>
        <button onClick={this.hideLayer}>
         Affordable Housing off
        </button>
      </li>
    )
  }
})

var MapControls = React.createClass({
  render: function() {
    return (
      <ul>
        <MapLayerToggle layerName='affordableHousing'/>
      </ul>
    )
  }
});
var domEl = document.getElementById('controls');

React.render(<MapControls/>, domEl);
