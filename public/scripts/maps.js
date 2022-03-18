//********* Map List  Functions **********/

const startingMapName = "Free Parking in London";

$(document).ready(function() {
  //********* Map List Render Functions **********/

  //this escapes the content
  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  //this creates the HTML for a single map item
  const createMapElement = function(mapData) {

    const $map = $(`
      <div class="map_element_wrapper">
        <p class="map_name"><a id="${escape(mapData.id)}" href="#">${escape(mapData.name)}</a></p>
        <p>${escape(mapData.description)}</p>
        <p>
          <button id="edit_${escape(mapData.id)}" type="submit">Edit</button>
          <button id="delete_${escape(mapData.id)}" type="submit">Delete</button>
          <button id="favourite_${escape(mapData.id)}" type="submit">Favourite</button>
        </p>
      </div>
    `);
    return $map;
  };

  //this appends map items to the maps_list element in index.ejs.
  const renderMaps = function(arrMapData) {
    $('.map_element_wrapper').remove();
    if (arrMapData.maps) {
      for (let mapData of arrMapData.maps) {
        const $map = createMapElement(mapData);
        $('.maps_list').prepend($map);
      }
    }
    return;
  };

  //this requests the data from /maps GET route and renders all map items
  const loadMaps = function() {
    $.ajax('/maps', { method: 'GET' })
      .then(function(mapsText) {
        renderMaps(mapsText);
      })
      .catch(err => {
        console.log("error:", err.message);
      });
  };
  //this adds a new favourite /favourites/new POST route and re-renders all map favourites
  const addToFavourites = function(mapId, userId) {
    const queryObj = { map_id: mapId, user_id: userId };
    $.ajax('/favourites/new', { method: 'POST', data: queryObj})
      .then(function(mapsText) {
        loadFavouritesMaps();
      })
      .catch(err => {
        console.log("error:", err.message);
      });
  };
  //this deletes a map from the maps list using /maps/:id/delete POST route and re-renders all map lists
  const deleteMap = function(mapId, userId) {
    const queryObj = { map_id: mapId, user_id: userId };
    $.ajax('/maps/' + mapId + '/delete', { method: 'POST', data: queryObj})
      .then(function(mapsText) {
        loadMaps();
        loadFavouritesMaps();
        loadContributorMaps();
      })
      .catch(err => {
        console.log("error:", err.message);
      });
  };
  //*********** End Map List Render Functions ***********/

  //this gets a map from the maps using /maps/"id" GET route and renders it.
  const getMap = function(mapId) {
    let queryObj = {
      id: mapId
    };
    request = $.ajax({ url: "/maps/" + mapId, method: "GET", data: queryObj});

    // Callback handler that will be called on success
    request.done(function(response, status, jqXHR) {
      console.log("Map GET successful. MapID:", response.map);
      const {
        id,
        active,
        owner_id,
        name,
        description,
        coord_x,
        coord_y,
        zoom
      } = response.map;
      currentMapId = id;
      $("#map-name").text(name);
      map.remove();
      initMap();
      setView(coord_x, coord_y, zoom);
      loadMapPoints(currentMapId);
    });
    // Callback handler that will be called on failure
    request.fail(function(jqXHR, status, error) {
      //if there was a failure
      console.error("The form POST failed. Error: " + status, error);
    });
  };

  // Event Handlers
  $(function() {
    let  request = null;

    //side bar list item click handler.
    $('.maps_list').on('click', function(event) {
      event.preventDefault();
      if (event.target.nodeName === 'A') {
        getMap(event.target.id);
      } else if (event.target.nodeName === 'BUTTON') {
        if (event.target.id.split('_')[0] === 'delete') {
          deleteMap(event.target.id.split('_')[1], document.cookie.split('=')[1]);
        }
        if (event.target.id.split('_')[0] === 'favourite') {
          addToFavourites(event.target.id.split('_')[1], document.cookie.split('=')[1]);
        }
      }
    });

    //side bar list click handler.
    $('.contributed_maps_list').on('click', function(event) {
      event.preventDefault();
      event.target.id;
      getMap(event.target.id.split('-')[1]);
    });

    //****** ROUTE: POST maps/ ************/
    //Save new maps and recreate the sidebar list.
    const $form = $('.new_map form');
    $form.submit(function(event) {
      event.preventDefault();

      let queryObj = {
        owner_id: document.cookie.split('=')[1],
        name: $("#mtitle").val(),
        desc: $("#mdesc").val(),
        mapCoordX: map.getCenter().lat,
        mapCoordY: map.getCenter().lng,
        zoom: map.getZoom()
      };
      // console.log("queryObj:", queryObj);

      request = $.ajax({ url: "/maps", method: "POST", data: queryObj});
      // Callback handler that will be called on success
      request.done(function(response, status, jqXHR) {
        //if successful clear out the text values.
        $("#mtitle").val("");
        $("#mdesc").val("");
        currentMapId = response.map.id;
        //clear out the map and pins
        map.remove();
        initMap();
        //setup the new map and add the pins
        $("#map-name").text(response.map.name);
        setView(response.map.coord_x, response.map.coord_y, response.map.zoom);
        loadMapPoints(currentMapId);
        loadMaps();
        loadContributorMaps();
        loadFavouritesMaps();
      });
      // Callback handler that will be called on failure
      request.fail(function(jqXHR, status, error) {
        //if there was a failure
        console.error("The form POST failed. Error: " + status, error);
      });
    });
  });
  // Set the Map Title.
  $("#map-name").text(startingMapName);
  // initial load of the maps list.
  loadMaps();
});

// END//
