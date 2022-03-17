let map;
let newPinLng;
let newPinLat;
let lat, lng;
let marker;
let mapLayer;
let updatePin = true;

const mapStartingLat = 49.285395314699244;
const mapStartingLng = -123.12673661801905;
const mapStartingZoom = 13;

// Place new pin on the map at lat, lng
const generatePin = function(lat, lng, img, name, desc) {
  const marker = L.marker([lat, lng]);
  marker.addTo(map);
  marker.bindPopup(`<div class='pin-popup'><img src='${img}'><h1>${name}</h1><h2>${desc}</h2></div>`);
};

const reloadMap = function() {
  const {lat, lng} = map.getCenter();
  const zoom =  map.getZoom();
  updatePin = true;
  map.remove();
  initMap();
  map.setView([lat, lng], zoom, {
    zoom: {
      animate: false
    }
  });
  loadMapPoints();
};

// Set view and zoom for the map
const setView = function(lat, lng, zoom) {
  map.setView([lat, lng], zoom);
};


// const initMap = function(mapViewLat, mapViewLng, zoom) {
const initMap = function() {

  // map = L.map('map').setView([mapViewLat, mapViewlng], zoom);
  map = L.map('map').setView([mapStartingLat, mapStartingLng], mapStartingZoom);

  const mapLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZXRoYW5sb2V3ZW4iLCJhIjoiY2wwb2JhamMwMWl5bDNsbmVuczI2aXBrZyJ9.tfw9ypNjnVAzLUqlUTNZ4g', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZXRoYW5sb2V3ZW4iLCJhIjoiY2wwb2JhamMwMWl5bDNsbmVuczI2aXBrZyJ9.tfw9ypNjnVAzLUqlUTNZ4g'
  });

  mapLayer.addTo(map);
  // map.addLayer(mapLayer);

  map.addEventListener('mousemove', function(ev) {
    lat = ev.latlng.lat;
    lng = ev.latlng.lng;
  });
};


document.getElementById("map").addEventListener("contextmenu", function(event) {
  // Prevent the browser's context menu from appearing
  event.preventDefault();
  const defaultPopup = "<div class='pin-popup'><img src='../images/map_logo.png'><h1>New Pin</h1><h2>Add a description!</h2></div>";

  if (updatePin === false) {
    let newLatLng = new L.LatLng(lat, lng);
    marker.bindPopup(defaultPopup);
    marker.setLatLng(newLatLng);
    newPinLat = lat;
    newPinLng = lng;
    return false;
  }
  updatePin = false;

  marker = L.marker([lat, lng]).addTo(map);
  marker.bindPopup(defaultPopup);
  newPinLat = lat;
  newPinLng = lng;
  return false; // To disable default popup.
});

// hide all other folders
const hideFolders = function(selector) {
  $(selector).toggleClass('hide');
  $('.hide').slideUp();
  $(selector).toggleClass('hide');
};

// remove unwanted space bellow the current opened folder
const removeFolderSpace = function(selector) {
  $('.folder').addClass("push-next");
  // only runs if the clicked folder is not the current open one
  if (!$(`${selector} .hide`).height() > 0) {
    $(selector).removeClass('push-next');
  }
};

// Show selector1 and hide selector 2
const toggleForm = function(selector1, selector2) {
  $(selector1).removeClass('form-hide');
  $(selector2).addClass('form-hide');
};

const showEditPinTitle = function() {
  $('#new-pin-collapse h2:nth-of-type(2)').removeClass('form-hide');
  $('#new-pin-collapse h2:nth-of-type(1)').addClass('form-hide');
};

const showNewPinTitle = function() {
  $('#new-pin-collapse h2:nth-of-type(1)').removeClass('form-hide');
  $('#new-pin-collapse h2:nth-of-type(2)').addClass('form-hide');
};

// Collapse folder sections on click
$('#maps-collapse').click(() => {
  $('.maps_list').slideToggle();
  hideFolders('.maps_list');
  removeFolderSpace('.folder:nth-of-type(2)');
});
$('#pins-collapse').click(() => {
  $('.map_points_list').slideToggle();
  hideFolders('.map_points_list');
  removeFolderSpace('.folder:nth-of-type(3)');
});
$('#fav-collapse').click(() => {
  $('.favourites_list').slideToggle();
  hideFolders('.favourites_list');
  removeFolderSpace('.folder:nth-of-type(4)');
});
$('#contrib-collapse').click(() => {
  $('.contributed_maps_list').slideToggle();
  hideFolders('.contributed_maps_list');
  removeFolderSpace('.folder:nth-of-type(5)');
});
$('#new-map-collapse').click(() => {
  $('.new_map').slideToggle();
  hideFolders('.new_map');
  removeFolderSpace('.folder:nth-of-type(6)');
});
$('#new-pin-collapse').click(() => {
  $('.new_pin').slideToggle();
  hideFolders('.new_pin');
  removeFolderSpace('.folder:nth-of-type(7)');
});

// Make nav buttons collapse/expand their associated folders
$('#maps-button').click(() => {
  $('.maps_list').slideToggle();
  hideFolders('.maps_list');
  removeFolderSpace('.folder:nth-of-type(2)');
});
$('#pins-button').click(() => {
  $('.map_points_list').slideToggle();
  hideFolders('.map_points_list');
  removeFolderSpace('.folder:nth-of-type(3)');
});
$('#fav-button').click(() => {
  $('.favourites_list').slideToggle();
  hideFolders('.favourites_list');
  removeFolderSpace('.folder:nth-of-type(4)');
});
$('#contrib-button').click(() => {
  $('.contributed_maps_list').slideToggle();
  hideFolders('.contributed_maps_list');
  removeFolderSpace('.folder:nth-of-type(5)');
});
$('#new-map-button').click(() => {
  $('.new_map').slideToggle();
  hideFolders('.new_map');
  removeFolderSpace('.folder:nth-of-type(6)');
});
$('#new-pin-button').click(() => {
  toggleForm('#pform', '#update-pform');
  showNewPinTitle();
  $('.new_pin').slideToggle();
  hideFolders('.new_pin');
  removeFolderSpace('.folder:nth-of-type(7)');
});


initMap();
