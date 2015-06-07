var MapLayerToggle = React.createClass({
  showLayer: function(event) {
    mapLayerState('show', this.props.layerName)
  },
  hideLayer: function(argument) {
    mapLayerState('hide', this.props.layerName)
  },
  render: function(){
    return (
      <div className='on-off-groups'>
        <h4>{this.props.layerName}</h4>
        <div className="btn-group btn-group-sm" role="group">
          <button type="button" className="btn btn-default" onClick={this.showLayer}>
            On
          </button>
          <button type="button" className="btn btn-default" onClick={this.hideLayer}>
            Off
          </button>
        </div>
      </div>
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
      <div className="btn-toolbar" role="toolbar" >
        {layers}
      </div>
    )
  }
});

var renderApp = function() {
  var domEl = document.getElementById('controls');
  React.render(<MapControls mapLayers={mapLayers}/>, domEl);
}
