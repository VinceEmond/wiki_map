// Client facing scripts here

/****************************/
/*     AFTER HTML LOADS     */
/****************************/
// $(() => {


/****************************/
/*        VARIABLES         */
/****************************/
const $newMapPoint = $('.new_pin form');
const $mapPointsList = $('.map_points_list');
const $newMapPointTitleInput = $("#ptitle");
const $newMapPointUrlInput = $("#pimage");
const $newMapPointDescInput = $("#pdesc");
const $updateMapPointSubmitBtn = $('#update-psubmit');
const $updateMapPointCancelBtn = $('#cancel-psubmit');
const $updateMapPointTitleInput = $('#update-ptitle');
const $updateMapPointDescInput = $('#update-pdesc');
const $updateMapPointURLInput = $('#update-pimage');

let idOfMapPointToUpdate;


/****************************/
/*        FUNCTIONS         */
/****************************/


const escape = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// Create HTML element for a Single Map Point List Item
const createMapPointElement = function(mapPointData) {
  const {name, description, id} = mapPointData;

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

// Loops through all Map_points, and appends to map_point list
const renderMapPointsList = function(mapPointsArr) {
  for (const mapPoint of mapPointsArr) {
    $mapPointsList.prepend(createMapPointElement(mapPoint));
    generatePin(mapPoint.coord_x, mapPoint.coord_y, mapPoint.image, mapPoint.name, mapPoint.description);
  }
  return;
};

const loadMapPoints = function() {
  const dataForCall = {
    map_id: currentMapId
  };

  $.ajax({url: "/map_points", method: 'GET', data: dataForCall})
    .then((response) => {
      const mapPointsArr = response.mapPoints;
      // Clear all existing map_points in the list
      $(".map_point_element_wrapper").remove();
      // Render Map points in list and on map using data from database
      renderMapPointsList(mapPointsArr);
    })
    .catch(err => {
      console.log(err);
    });
};

const clearNewMapPointFormInputs = function() {
  $newMapPointTitleInput.val('');
  $newMapPointDescInput.val('');
  $newMapPointUrlInput.val('');
};

const clearUpdateMapPointFormInputs = function() {
  $updateMapPointTitleInput.val('');
  $updateMapPointDescInput.val('');
  $updateMapPointURLInput.val('');
};


/****************************/
/*      EVENT LISTENERS     */
/****************************/


// Listen for EDIT or DELETE buttons in map_points list
$mapPointsList.on('click',function(event) {
  event.preventDefault();

  const type = event.target.id.split('_')[3];
  const mapPointId = event.target.id.split('_')[2];

  // If DELETE button is pressed for a map_point
  if (type === 'delete') {
    const dataForCall = {
      map_id: currentMapId,
      map_point_id: mapPointId
    };

    $.ajax({ url: `map_points/${mapPointId}/delete`, method: "POST", data: dataForCall})
      .then((response, status) => {
        // console.log(`Map ID ${currentMapId}'s map_point ${mapPointId} has been made inactive.`);
        toggleForm('#pform', '#update-pform');
        showNewPinTitle();
        clearUpdateMapPointFormInputs();
        reloadMap();
      })
      .catch((err) => {
        console.log("Error :", err);
      });
  }

  // If EDIT button is pressed for a map_point
  if (type === 'edit') {

    $.ajax({ url: `map_points/${mapPointId}`, method: "GET"})
      .then((response) => {
        const {name, description, image, id} = response.mapPoint;
        idOfMapPointToUpdate = id;
        // Populate text boxes with existing values from db
        $updateMapPointTitleInput.val(name);
        $updateMapPointDescInput.val(description);
        $updateMapPointURLInput.val(image);
      })
      .catch((err) => {
        console.log("Error :", err);
      });

    toggleForm('#update-pform', '#pform');
    showEditPinTitle();
    $('.new_pin').slideToggle();
    hideFolders('.new_pin');
    removeFolderSpace('.folder:nth-of-type(7)');
  }

});


// Listen for cancel button on map_points update form
$updateMapPointCancelBtn.on('click', function(event) {
  event.preventDefault();
  toggleForm('#pform', '#update-pform');
  showNewPinTitle();
  clearUpdateMapPointFormInputs();
});

// List for update button on map_points update form
$updateMapPointSubmitBtn.on('click', function(event) {
  event.preventDefault();
  // console.log("Update button clicked! ID of map point to update:", idOfMapPointToUpdate);

  const dataForCall = {
    name: $updateMapPointTitleInput.val(),
    description: $updateMapPointDescInput.val(),
    image: $updateMapPointURLInput.val()
  };

  $.ajax({url: `map_points/${idOfMapPointToUpdate}`, method: "POST", data: dataForCall})
    .then((response) => {
      console.log("The response with point", response.mapPoint);
      clearUpdateMapPointFormInputs();
      reloadMap();
    })
    .catch((err) => {
      console.log("Error Status:", err.status);
      console.log("Error Status Text:", err.statusText);
    });
});

// Listen for the favourite button to be clicked
$('#fav-button').on('click', function(event) {
  event.preventDefault();
  console.log("Fav Button clicked!");

});


// Create a new map_point
$newMapPoint.submit(function(event) {
  event.preventDefault();

  const userIDFromCookie = document.cookie.split('=')[1];
  let newMapPointUrlInput = $newMapPointUrlInput.val();

  // If image URL input box is empty, set a default map pin image
  if (!newMapPointUrlInput) {
    newMapPointUrlInput = defaultNewPinImageURL;
  }

  const dataForCall = {
    map_id: currentMapId,
    owner_id: userIDFromCookie,
    name: $newMapPointTitleInput.val(),
    description: $newMapPointDescInput.val(),
    coord_x: newPinLat,
    coord_y: newPinLng,
    zoom: 16,
    image: newMapPointUrlInput
  };

  $.ajax({ url: "/map_points", method: "POST", data: dataForCall})
    .then((response, status) =>  {
      // console.log(`Created a new map point on map_id ${currentMapId}. The new map_point's ID is: `, response.newMapPoint.id);
      clearNewMapPointFormInputs();
      reloadMap();
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
