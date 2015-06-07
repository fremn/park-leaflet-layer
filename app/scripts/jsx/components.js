var MapLayerToggle = React.createClass({
  showLayer: function(event) {
    mapLayerState('show', this.props.layerName)
  },
  hideLayer: function(argument) {
    mapLayerState('hide', this.props.layerName)
  },
  render: function(){
    return (
      <li>
        <button onClick={this.showLayer}>
         {this.props.layerName} On
        </button>
        <button onClick={this.hideLayer}>
         {this.props.layerName} off
        </button>
      </li>
    )
  }
})

var MapControls = React.createClass({
  render: function() {

    var layersNames = _.keys(this.props.mapLayers);

    var layers = layersNames.map(function (layer) {
      return (
        <MapLayerToggle key={layer} layerName={layer}/>
      );
    });

    return (
      <ul>
        {layers}
      </ul>
    )
  }
});

var renderApp = function() {
  var domEl = document.getElementById('controls');
  React.render(<MapControls mapLayers={mapLayers}/>, domEl);
}
