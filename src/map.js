mapboxgl.accessToken = 'pk.eyJ1IjoiaWFtd2VybmVyaGVyem9nIiwiYSI6ImNpemFiNWNnZzAxcngzMnRldG05OXZ6a3QifQ.DNmFL4Ue09E4QGLM14aoHg';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/iamwernerherzog/cjlcx906q4wnp2rn6gi20c9pt', //stylesheet location
    center: [-74.50, 40], // starting position
    zoom: 6// starting zoom
});

// map.addControl(new mapboxgl.Navigation());



map.on('style.load', function () {
    map.addSource("markers", {
        "type": "geojson",
        "data": rhinos
    });

    map.addLayer({
        "id": "markers",
        "interactive": true,
        "type": "symbol",
        "source": "markers",
        "layout": {
            "icon-image": "superfund",
            "icon-size": 0.75
        },
        "paint": {
            /*"text-size": 10,*/
        }
    });
});

// map.on('click', function (e) {
//
//     map.featuresAt(e.point, {layer: 'markers', radius: 10, includeGeometry: true}, function (err, features) {
//         if (err) throw err;
//         if (features.length) {
//             var featureName = features[0].properties.NAME;
//             var featureHRS= features[0].properties.HRS;
//             var featureStat = features[0].properties.NPLSTAT;
//             var featureDate = features[0].properties.STATUS_DAT;
//             var tooltip = new mapboxgl.Popup()
//                 .setLngLat(e.lngLat)
//                 .setHTML('<p>' + 'Name of site: '+ featureName + '</br>'+'HRS: '+ featureHRS + '</br>' + 'Status of site: '+ featureStat +'</br>'+ 'Last status update: ' + featureDate + '</p>' )
//                 .addTo(map);
//         }
//     });
// });


// Use the same approach as above to indicate that the symbols are clickable
// by changing the cursor style to 'pointer'.
// map.on('mousemove', function (e) {
//     map.featuresAt(e.point, {layer: 'markers', radius: 10}, function (err, features) {
//         if (err) throw err;
//         map.getCanvas().style.cursor = features.length ? 'pointer' : '';
//     });
// });


// var geocoder = new mapboxgl.Geocoder({position: 'bottom-right'});

// var geoc = map.addControl(geocoder);





var geolocate = document.getElementById('current-location-btn');






// the unsecure and decrepit html5 location getter api

  if (!navigator.geolocation) {
      alert('Geolocation is not available');
  } else {
      geolocate.onclick = function (e) {
        navigator.geolocation.getCurrentPosition(callback);
    };
  }

  function callback(position) {
     console.log(position.coords.latitude);
     console.log(position.coords.longitude);

    map.flyTo({
        center: [
            position.coords.longitude,
            position.coords.latitude],
            zoom: 11,
    });



  }

  // var latitude = position.coords.latitude;
  // var longitude = position.coords.longitude;


// If the user chooses not to allow their location
// to be shared, display an error message.
map.on('locationerror', function() {
    alert('Position could not be found');
});
