
/****************************/
/*        VARIABLES         */
/****************************/

const $newMapPointSubmitBtn = $('#psubmit');
const $mapPointsList = $('.map_points_list');
const $newMapPointTitleInput = $("#ptitle");
const $newMapPointUrlInput = $("#pimage");
const $newMapPointDescInput = $("#pdesc");
const $updateMapPointTitleInput = $('#update-ptitle');
const $updateMapPointDescInput = $('#update-pdesc');
const $updateMapPointURLInput = $('#update-pimage');
const $updateMapPointSubmitBtn = $('#update-psubmit');
const $updateMapPointCancelBtn = $('#cancel-psubmit');
let idOfMapPointToUpdate;


/****************************/
/*        FUNCTIONS         */
/****************************/

const clearMapPointsList = function() {
  $(".map_point_element_wrapper").remove();
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

const populateUpdateForm = function(mapPoint) {
  const {name, description, image} = mapPoint;
  $updateMapPointTitleInput.val(name);
  $updateMapPointDescInput.val(description);
  $updateMapPointURLInput.val(image);
};

const displayErrorMsg = function(error) {
  console.log(`Error - ${error.status} : ${error.statusText}`);
};

const focusOnPin = function(mapPoint) {
  const {coord_x, coord_y} = mapPoint;
  setView(coord_x, coord_y, focusOnPinZoom);
};

const setUILayout = function(layout) {
  if (layout === 'newMapPoint') {
    toggleForm('#pform', '#update-pform');
    showNewPinTitle();
    clearUpdateMapPointFormInputs();
  }

  if (layout === 'updateMapPoint') {
    toggleForm('#update-pform', '#pform');
    showEditPinTitle();
    $('.new_pin').slideToggle();
    hideFolders('.new_pin');
    removeFolderSpace('.folder:nth-of-type(7)');
  }
};

const createMapPointElement = function(mapPoint) {
  // Create and return HTML element for a Single Map Point List Item
  const {name, description, id} = mapPoint;
  const $mapPoint = $(`
    <div class="map_point_element_wrapper">
      <a class="name" id="map_point_${escape(id)}_title" href="/map_points/${id}">${escape(name)}</a>
      <p>${escape(description)}</p>
      <button type="button" id="map_point_${escape(id)}_edit"> Edit </button>
      <button type="submit" id="map_point_${escape(id)}_delete"> Delete </button>
    </div>
  `);
  return $mapPoint;
};

const renderMapPoints = function(mapPointsArr) {
  // Append every map_point from array to the sidebar list and generate a pin on the map
  for (const mapPoint of mapPointsArr) {
    $mapPointsList.prepend(createMapPointElement(mapPoint));
    generatePin(mapPoint);
  }
};

const loadMapPoints = function(mapId) {
  getAllMapPoints(mapId)
    .then(mapPointsArr => {
      clearMapPointsList();
      renderMapPoints(mapPointsArr);
    })
    .catch(error => console.log(error));
};


/****************************/
/*       AJAX CALLS         */
/****************************/

const getAllMapPoints = function(mapId) {
  const dataForCall = {map_id: mapId};
  return $.ajax({url: "/map_points", method: 'GET', data: dataForCall})
    .then(response => response.mapPoints)
    .catch(error => displayErrorMsg(error));
};

const getPointById = function(mapPointId) {
  return $.ajax({ url: `map_points/${mapPointId}`, method: "GET"})
    .then(response => response.mapPoint)
    .catch(error => displayErrorMsg(error));
};

const updateMapPoint = function(mapPointId, dataForCall) {
  return $.ajax({url: `map_points/${idOfMapPointToUpdate}`, method: "POST", data: dataForCall})
    .then(response => response.updatedMapPoint)
    .catch(error => displayErrorMsg(error));
};

const createMapPoint = function(dataForCall) {
  return $.ajax({ url: "/map_points", method: "POST", data: dataForCall})
    .then(response => response.newMapPoint)
    .catch(error => displayErrorMsg(error));
};

const deleteMapPoint = function(mapPointId) {
  const dataForCall = {map_point_id: mapPointId};
  return $.ajax({ url: `map_points/${mapPointId}/delete`, method: "POST", data: dataForCall})
    .then(response => response)
    .catch(error => displayErrorMsg(error));
};


/****************************/
/*      EVENT LISTENERS     */
/****************************/

$mapPointsList.click(function(event) {
  event.preventDefault();
  const interaction = event.target.id.split('_')[3];
  const mapPointId = event.target.id.split('_')[2];

  // MAP POINT LIST - DELETE button
  if (interaction === 'delete') {
    deleteMapPoint(mapPointId)
      .then(() => {
      // console.log("Deleted the map_point with ID:", mapPointId);
        setUILayout('newMapPoint');
        reloadMap();
      })
      .catch(error => console.log(error));
  }

  // MAP POINT LIST - EDIT button
  if (interaction === 'edit') {
    idOfMapPointToUpdate = mapPointId;

    getPointById(mapPointId)
      .then(mapPoint => {
        populateUpdateForm(mapPoint);
        setUILayout('updateMapPoint');
      })
      .catch(error => console.log(error));
  }

  // MAP POINT LIST - TITLE click event
  if (interaction === 'title') {
    getPointById(mapPointId)
      .then(mapPoint => focusOnPin(mapPoint))
      .catch(error => console.log(error));
  }

});

$updateMapPointCancelBtn.click(function(event) {
  event.preventDefault();
  // console.log("Cancel button clicked! Resetting UI to new map point layout");
  clearUpdateMapPointFormInputs();
  setUILayout('newMapPoint');
});

$updateMapPointSubmitBtn.click(function(event) {
  event.preventDefault();
  // console.log("Update button clicked! ID of map point to update:", idOfMapPointToUpdate);

  let updateMapPointUrlInput = $updateMapPointURLInput.val();

  // If image URL input box is empty, set a default map pin image
  if (!updateMapPointUrlInput) {
    updateMapPointUrlInput = defaultNewPinImageURL;
  }

  const updatedData = {
    name: $updateMapPointTitleInput.val(),
    description: $updateMapPointDescInput.val(),
    image: updateMapPointUrlInput
  };

  updateMapPoint(idOfMapPointToUpdate, updatedData)
    .then(updatedMapPoint => {
      // console.log("Updated the following map_point:", updatedMapPoint);
      reloadMap();
    })
    .catch(error => console.log(error));
});


$newMapPointSubmitBtn.click(function(event) {
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
    zoom: defaultNewPinZoom,
    image: newMapPointUrlInput
  };

  createMapPoint(dataForCall)
    .then(newMapPoint => {
      // console.log('User ID', userIDFromCookie, 'created a new map point:', newMapPoint);
      clearNewMapPointFormInputs();
      reloadMap();
    })
    .catch(error => console.log(error));

});


/****************************/
/*     ON INITIAL LOAD      */
/****************************/

loadMapPoints(currentMapId);
