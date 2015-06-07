var sdk = new CitySDK();
var censusModule = sdk.modules.census;

censusModule.enable("28d40d74c74b4be0554772cbc339ee99662fc2bf");

map = L.map('map-canvas').setView([30.2500, -97.7500], 10);

var mapLayers = {};

L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
            attribution: '&copy; Map tiles by MAPC',
            minZoom: 0,
            maxZoom: 17,
            id: 'drmaples.ipbindf8'
        }).addTo(map);


var request = {
    "state": "TX",
    "level": "county",
    "sublevel":true,
    "variables":[
		'age'
    ]
};

var polygonOptions = {
	color: "red",
	fillColor: "#f03"
};

function getColor(d) {
    return d < 20  ? '#800026' :
           d < 25  ? '#BD0026' :
           d < 30  ? '#E31A1C' :
           d < 35  ? '#FC4E2A' :
           d < 40  ? '#FD8D3C' :
           d < 45  ? '#FEB24C' :
           d < 50  ? '#FED976' :
                     '#FFEDA0';
}

function style(age) {
    return {
        fillColor: getColor(parseInt(age ? age : '0')),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

var callback = function(response) {
    var tractAges = []
    var features = response.features;
    _.each(features,function(feature){
      	var props = feature.properties;
  		var lat = parseFloat(props.CENTLAT);
  		var lng = parseFloat(props.CENTLON);
  		var coords = feature.geometry.coordinates[0].map(function(data){
  			return [data[1],data[0]];
  		});
  		var age = props.age;
  		tractAges.push(L.polygon(coords, style(age)))
    });
    makeLayerGroup('medianAge', tractAges)
};

function makeLayerGroup(name, layerCollection) {
  mapLayers[name] = L.layerGroup(layerCollection);
  mapLayerState('show', name)
}

$.when($.get('https://data.austintexas.gov/resource/siyu-szxn.json')).then(
  function( data, textStatus, jqXHR ) {
      var affordableHousing = data;
      var housing = [];
      _.each(affordableHousing, function(af) {
        var loc = af.location_1;
        if (loc !== undefined && loc.hasOwnProperty('latitude') && loc.hasOwnProperty('longitude')) {
          housing.push(L.circle([loc.latitude, loc.longitude], (af.affordable_units)));
        }
      });
      makeLayerGroup('affordableHousing', housing);
});

function mapLayerState(action, layer) {
  if (action === 'show') {
    map.addLayer(mapLayers[layer])
  } else {
    map.removeLayer(mapLayers[layer])
  }
  renderApp();
}

censusModule.GEORequest(request, callback);
