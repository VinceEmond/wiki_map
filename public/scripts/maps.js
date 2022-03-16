// Client facing scripts here
// Map {
//   id: 'id',
//   name: 'name',
//   description: 'description',
//   coordX: 'coord_X',
//   coordY: 'coord_Y',
//   zoom: 'zoom'
// };

$(document).ready(function() {
  //this escapes the content
  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };
  //this creates the HTML for a single map item
  const createMapElement = function(mapData) {
// href="/maps/${escape(mapData.id)}""
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

  //this request the data from /maps GET route and renders all map items
  const loadMaps = function() {
    $.ajax('/maps', { method: 'GET' })
      .then(function(mapsText) {
        renderMaps(mapsText);
      })
      .catch(err => {
        console.log("error:", err.message);
      });
  };
  const mapDataIsValid = function(textString) {

    // if (!textString) {
    //   $("#error-msg").text("Error: The tweet contains no message.");
    //   $("#error-msg").slideDown();
    //   return false;
    // }
    //   if (textString.length > 140) {

  //   $("#error-msg").text("Error: The tweet message is too long.");
  //   $("#error-msg").slideDown();
  //   return false;
  // }
  // $("#error-msg").hide();
  // return true;
  };

  $(function() {
    let  request = null;
    //****** ROUTE: GET maps/:id ************/
    //this is the map selection form the maps list.
    //it fires when a map link is clicked and then gets the details of the map
    //and renders it.

    const $mapContainer = $('.maps_list');
    $mapContainer.on('click', function(event) {
      event.preventDefault();
      //console.log("mapLink:",$mapLink);
      let queryObj = {
        id: event.target.id
      };
      request = $.ajax({ url: "/maps/" + event.target.id, method: "GET", data: queryObj});

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
        //*****Open the Selected Map *******/
        currentMapId = id;
        $("#map-name").text(name);
        map.remove();
        initMap();
        setView(coord_x, coord_y, zoom);
        loadMapPoints();
      });
      // Callback handler that will be called on failure
      request.fail(function(jqXHR, status, error) {
        //if there was a failure
        console.error("The form POST failed. Error: " + status, error);
      });
      // Callback handler that will be called regardless
      // if the request failed or succeeded
      request.always(function() {
        //$inputs.prop("disabled", false);
      });
    });


    const $form = $('.new_map_list form');
    //****** ROUTE: POST maps/ ************/
    //Save new maps and recreate the sidebar list.
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
      console.log("queryObj:", queryObj);

      //****************TODO****************************/
      //**Add data validation here**/

      request = $.ajax({ url: "/maps", method: "POST", data: queryObj});
      // Callback handler that will be called on success
      request.done(function(response, status, jqXHR) {

        //if successful clear out the text values.
        $("#mtitle").val("");
        $("#mdesc").val("");
        //FIX TODO
        currentMapId = response.map.id;
        map.remove();
        initMap();
        $("#map-name").text(response.map.name);
        setView(response.map.coord_x, response.map.coord_y, response.map.zoom);
        loadMapPoints();
        loadMaps();
      });
      // Callback handler that will be called on failure
      request.fail(function(jqXHR, status, error) {
        //if there was a failure
        console.error("The form POST failed. Error: " + status, error);
      });
      // Callback handler that will be called regardless
      // if the request failed or succeeded
      request.always(function() {
        //$inputs.prop("disabled", false);
      });
    });

  });
  //the map list gets rendered the first time.
  loadMaps();
});
