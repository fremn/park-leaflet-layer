console.log('\'Allo \'Allo!');
var sdk = new CitySDK();
var censusModule = sdk.modules.census;

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
		'income'
    ]
};

var callback = function(response) {
    var features = response.features;
    _.each(features,function(feature){
    	var props = feature.properties;
		var lat = parseFloat(props.CENTLAT);
		var lng = parseFloat(props.CENTLON);
		var coords = feature.geometry.coordinates[0].map(function(data){
			return [data[1],data[0]];
		});
		L.polygon(coords).addTo(map);
		//var myLatlng = new google.maps.LatLng(lat,lng);
		//console.log(props);
		//L.marker([lat, lng]).addTo(map);
		/*var marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			title: props.NAME		  
		});*/
    });
};

censusModule.GEORequest(request, callback);
