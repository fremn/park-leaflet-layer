var sdk = new CitySDK();
var censusModule = sdk.modules.census;
var PARK_COLOR = '#2DCB70';

var parkData;
d3.json("json/parks.json", function(error, json) {
  if (error) return console.warn(error);
  parkData = json;
  _.each(parkData,function(park){
  	var coords = flipCoords(park.geometry);
    // var shape = L.mapbox.featureLayer().setGeoJSON(turf.polygon(coords));
    // shape.addTo(map);
    L.polygon(coords, {color:PARK_COLOR, fillColor: PARK_COLOR, weight: 1}).addTo(map);
    var parkToBuffer = turf.polygon(park.geometry);
    //console.log(parkToBuffer);
    var buffer = turf.buffer(parkToBuffer, 0.25, 'miles');
    var collection = turf.featurecollection([buffer, parkToBuffer]);
    //collection.addTo(map);
    console.log(collection);
  });
});

censusModule.enable("28d40d74c74b4be0554772cbc339ee99662fc2bf");

map = L.map('map-canvas').setView([30.2500, -97.7500], 10);

// map.data.setStyle({
//     fillColor: 'blue'
// });

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

var tractCallback = function(err,response) {
 //    var datas = _.pluck(_.pluck(features,'properties'),'age').sort();
 //    console.log(datas.sort());
 //    var d3Color = d3.scale.threshold()
	// 				.domain(datas)
	// 			    .range(colorbrewer.RdBu[9]);

	// console.log(d3Color.range());
    _.each(response,function(feature){
    	var props = feature.properties;
		var coords = flipCoords(feature.geometry.coordinates[0]);
		L.polygon(coords, {color: "#A6CFD5", weight: 1}).addTo(map);
		L.polygon(coords, style(props.age)).addTo(map).bringToBack();

    });
};

function flipCoords(coords){
	return coords.map(function(data){
		return [data[1],data[0]];
	});
}

var affordableHousing;

$.when($.get('https://data.austintexas.gov/resource/wa68-dsqa.json')).then(function( data, textStatus, jqXHR ) {
 console.log( jqXHR.response );
 console.log( data );
 affordableHousing = data;
})

// censusModule.GEORequest(request, callback);

d3.json("json/tracts.json", tractCallback);
