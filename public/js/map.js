var longitude = <%=location[0].longitude%>;
var latitude = <%=location[0].latitude%>;
var des = "<%=location[0].formattedAddress%>";
var titleName = "<%=data.name%>";

mapboxgl.accessToken = 'pk.eyJ1IjoiYmFkY2Fubm9uIiwiYSI6ImNrNHk0OG1odTA3OHEzbW1uZ3ZzeHVnb3AifQ.xWEtr69OS7zEN2c6rT4XJw';
var geojson = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [longitude,latitude]
    },
    properties: {
      title: titleName,
      description: des
    }
  }]
};

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v10',
  center: [longitude,latitude],
  zoom: 3
});


// code from the next step will go here!
// add markers to map
geojson.features.forEach(function(marker) {

// create a HTML element for each feature
var el = document.createElement('div');
el.className = 'marker';

// make a marker for each feature and add to the map

  new mapboxgl.Marker(el)
    .setLngLat(marker.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
     .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
    .addTo(map);
});
