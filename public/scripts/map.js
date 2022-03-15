let map;

function initMap() {
  let map = L.map('map').setView([49.285395314699244, -123.12673661801905], 13);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZXRoYW5sb2V3ZW4iLCJhIjoiY2wwb2JhamMwMWl5bDNsbmVuczI2aXBrZyJ9.tfw9ypNjnVAzLUqlUTNZ4g', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZXRoYW5sb2V3ZW4iLCJhIjoiY2wwb2JhamMwMWl5bDNsbmVuczI2aXBrZyJ9.tfw9ypNjnVAzLUqlUTNZ4g'
  }).addTo(map);

  let lat, lng;

  map.addEventListener('mousemove', function(ev) {
    lat = ev.latlng.lat;
    lng = ev.latlng.lng;
  });

  document.getElementById("map").addEventListener("contextmenu", function(event) {
    // Prevent the browser's context menu from appearing
    event.preventDefault();

    let marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup("<img src='images/location_example.png' width='50' height='50'><br><b> Hey There! </b><br> This is a description");

    return false; // To disable default popup.
  });

  const hideFolders = function (selector) {
    $(selector).toggleClass('hide');
    $('.hide').slideUp();
    $(selector).toggleClass('hide');
  };

  // Collapse folder sections on click
  $('#maps-collapse').click(() => {
    $('.maps_list').slideToggle();
    hideFolders('.maps_list');
  });
  $('#pins-collapse').click(() => {
    $('.map_points_list').slideToggle();
    hideFolders('.map_points_list');
  });
  $('#fav-collapse').click(() => {
    $('.favourites_list').slideToggle();
    hideFolders('.favourites_list');
  });
  $('#contrib-collapse').click(() => {
    $('.contributed_maps_list').slideToggle();
    hideFolders('.contributed_maps_list');
  });
  $('#new-map-collapse').click(() => {
    $('.new_map_list').slideToggle();
    hideFolders('.new_map_list');
  });
  $('#new-pin-collapse').click(() => {
    $('.new_pin_list').slideToggle();
    hideFolders('.new_pin_list');
  });

  // Make nav buttons collapse/expand their associated folders
  $('#maps-button').click(() => {
    $('.maps_list').slideToggle();
    hideFolders('.maps_list');
  });
  $('#pins-button').click(() => {
    $('.map_points_list').slideToggle();
    hideFolders('.map_points_list');
  });
  $('#fav-button').click(() => {
    $('.favourites_list').slideToggle();
    hideFolders('.favourites_list');
  });
  $('#contrib-button').click(() => {
    $('.contributed_maps_list').slideToggle();
    hideFolders('.contributed_maps_list');
  });
  $('#new-map-button').click(() => {
    $('.new_map_list').slideToggle();
    hideFolders('.new_map_list');
  });
  $('#new-pin-button').click(() => {
    $('.new_pin_list').slideToggle();
    hideFolders('.new_pin_list');
  });
}
