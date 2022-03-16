// Client facing scripts here

/****************************/
/*     AFTER HTML LOADS     */
/****************************/
// $(() => {


/****************************/
/*        VARIABLES         */
/****************************/
const $newMapPoint = $('.new_pin form');
const $deleteMapPoint = $('#REPLACE-ME-WITH-A-TAG');


/****************************/
/*        FUNCTIONS         */
/****************************/



$('.map_points_list').on('click',function(event) {
  event.preventDefault();

  // console.log("map", map);
  // map.removeLayer(marker);
  // marker.clearLayer();
  // map.remove();
  // initMap();
  // console.log("Map layers:", map.layers);
  // console.log("Does it have layers?:", map.hasLayer());
  // map.removeLayer(this);
  // console.log("Map Point ID:",event.target.id.split('_')[2]);
  // console.log("Edit or Delete?:",event.target.id.split('_')[3]);

  const type = event.target.id.split('_')[3];
  const mapPointId = event.target.id.split('_')[2];

  if (type === 'delete') {
    const dataForCall = {
      map_id: currentMapId,
      map_point_id: mapPointId
    };

    $.ajax({ url: `map_points/${mapPointId}/delete`, method: "POST", data: dataForCall})
      .then((response, status) => {
        console.log(`Map ID ${currentMapId}'s map_point ${mapPointId} has been made inactive.`);
        reloadMap();
      })
      .catch((err) => {
        console.log("Error :", err);
      });
  }

});


const escape = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// Create element for Single Map point
const createMapPointElement = function(mapPointData) {
  const {name, description, id} = mapPointData;

  // <a class="name" href="/map_points/${id}">${escape(name)}</a><button type="button" id="map_point_${id}_edit"> Edit </button> <form action="/map_points/${id}/delete" method="POST"><button type="submit" id="map_point_${id}_delete"> Delete </button></form>
  //  <a class="name" href="/map_points/${id}">${escape(name)}</a><button type="button" id="map_point_${id}_edit"> Edit </button> <form><button type="submit" id="map_point_${id}_delete"> Delete </button></form>
  const $mapPoint = $(`
    <div class="map_point_element_wrapper">
      <a class="name" href="/map_points/${id}">${escape(name)}</a>
      <p>${escape(description)}</p>
      <button type="button" id="map_point_${id}_edit"> Edit </button>
      <button type="submit" id="map_point_${id}_delete"> Delete </button>
    </div>
  `);
  return $mapPoint;
};

// Loops through all Map_points and appends to .ejs template
const renderMapPointsList = function(dataObj) {
  const mapPointsArr = dataObj.mapPoints;
  for (let mapPoint of mapPointsArr) {
    const $mapPoint = createMapPointElement(mapPoint);
    $('.map_points_list').prepend($mapPoint);
    generatePin(mapPoint.coord_x, mapPoint.coord_y, mapPoint.image, mapPoint.name, mapPoint.description);
  }
  return;
};

const loadMapPoints = function() {
  const queryObj = {
    // set the current map
    map_id: currentMapId
  };

  $.ajax({url: "/map_points", method: 'GET', data: queryObj})
    .then((mapPointsObj) => {
      // Clears entire div of all existing map_points
      $(".map_point_element_wrapper").remove();
      // Render Map points with object returned from database
      renderMapPointsList(mapPointsObj);
    })
    .catch(err => {
      // console.log('Load Map Points Error', err);
    });
};


/****************************/
/*      EVENT LISTENERS     */
/****************************/

$('#fav-button').on('click', function(event) {
  event.preventDefault();
  console.log("Fav Button clicked!");

  $.ajax({ url: "/map_points/1", method: "GET"})
    .then((response, status) => {
      console.log("Response:", response.mapPoint);
    })
    .catch((err) => {
      console.log("Error :", console.err.message);
    });

});


// Create a new map_point
$newMapPoint.submit(function(event) {
  event.preventDefault();
  // console.log('newPinLat', newPinLat, 'newPinLng', newPinLng);
  // const currentMapId = 1;

  const dataForCall = {
    map_id: currentMapId,
    owner_id: 3,
    name: $("#ptitle").val(),
    description: $("#pdesc").val(),
    coord_x: newPinLat,
    coord_y: newPinLng,
    zoom: 16,
    image: '../images/map_logo.png'
  };

  $.ajax({ url: "/map_points", method: "POST", data: dataForCall})
    .then((response, status) =>  {
      console.log(`Created a new map point on map_id ${currentMapId}. The new map_point's ID is: `, response.newMapPoint.id);
      $("#ptitle").val('');
      $("#pdesc").val('');
      reloadMap();
    })
    .catch((err) => {
      console.log("Error :", console.err.message);
    });
});

// Delete an existing map_point
$deleteMapPoint.on('click',function(event) {
  event.preventDefault();

  // const currentMapId = 1;
  const currentMapPointId = 1;

  const dataForCall = {
    map_id: currentMapId,
    map_point_id: currentMapPointId
  };

  $.ajax({ url: `map_points/${currentMapPointId}/delete`, method: "POST", data: dataForCall})
    .then((response, status) => {
      console.log(`Map ID ${currentMapId}'s map_point ${currentMapPointId} has been made inactive.`);
      loadMapPoints();
    })
    .catch((err) => {
      console.log("Error :", err.message);
    });
});



/****************************/
/*     ON INITIAL LOAD      */
/****************************/

loadMapPoints();

// });
