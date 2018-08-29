mapboxgl.accessToken = 'pk.eyJ1IjoiaWFtd2VybmVyaGVyem9nIiwiYSI6ImNpemFiNWNnZzAxcngzMnRldG05OXZ6a3QifQ.DNmFL4Ue09E4QGLM14aoHg';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/iamwernerherzog/cjlcx906q4wnp2rn6gi20c9pt', //stylesheet location
    center: [26, 28], // starting position
    zoom: 2// starting zoom
});

// map.addControl(new mapboxgl.Navigation());



map.on('style.load', function () {
    map.addSource("markers", {
      type: 'geojson',
      data: 'https://cdn.rawgit.com/xrwang/geoprivacy/master/data/rhinos.json?token=AD1W2cn2J22G3JH0dKLD0CVkZhK84zx_ks5bjgKrwA%3D%3D',
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
      'id': "conservation-areas1",
      'type': 'fill',
      'source' :
      {
        'type':'geojson',
        'data': 'https://cdn.rawgit.com/xrwang/geoprivacy/2c99dde5/data/existingData/SACAD.geojson',

      },
      'layout': {},
        'paint': {
            'fill-color': '#088',
            'fill-opacity': 0.8
        }
    });

    map.addLayer({
      'id': "conservation-areas2",
      'type': 'fill',
      'source' :
      {
        'type':'geojson',
        'data': 'https://cdn.rawgit.com/xrwang/geoprivacy/2c99dde5/data/existingData/SAPAD.geojson',

      },
      'layout': {},
        'paint': {
            'fill-color': '#088',
            'fill-opacity': 0.8
        }
    });


    map.addLayer({
        id: "clusters",
        type: "circle",
        source: "markers",
        filter: ["has", "point_count"],
        paint: {
            // Use step expressions (https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            "circle-color": [
                "step",
                ["get", "point_count"],
                "#51bbd6",
                100,
                "#f1f075",
                750,
                "#f28cb1"
            ],
            "circle-radius": [
                "step",
                ["get", "point_count"],
                20,
                100,
                30,
                750,
                40
            ]
        }
    });



    map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "markers",
        filter: ["!", ["has", "point_count"]],
        paint: {
            "circle-color": "#11b4da",
            "circle-radius": 4,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff"
        }
    });

    map.addLayer({
        id: "markers",
        type: "circle",
        source: "markers",
        paint: {
            "circle-color": "#cd0000",
            "circle-radius": 4,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff"
        }
    });


    map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "markers",
        filter: ["has", "point_count"],
        layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12
        }
    });

    map.on('click', 'clusters', function (e) {
      var features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
      var clusterId = features[0].properties.cluster_id;
      map.getSource('markers').getClusterExpansionZoom(clusterId, function (err, zoom) {
          if (err)
              return;

          map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
          });
      });
    });

    map.on('mouseenter', 'clusters', function () {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', function () {
        map.getCanvas().style.cursor = '';
    });

    map.on('click', 'markers', function(e) {
      new mapboxgl.Popup()
        .setLngLat(e.features[0].geometry.coordinates)
        .setHTML('<b>Title</b> ' + e.features[0].properties.name  +'<br><br>'+'<b>URL</b>'+ '<a href='+e.features[0].properties.url+' target="blank">'+e.features[0].properties.url+'</a>')
        .addTo(map);
    });

});





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
