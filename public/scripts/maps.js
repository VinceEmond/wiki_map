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

    const $map = $(`
      <p class="name"><a href="/maps/${escape(mapData.id)}">${escape(mapData.name)}</a></p>
      <p>${escape(mapData.description)}</p>
    `);
    return $map;
  };
  //this appends map items to the maps_list element in index.ejs.
  const renderMaps = function(arrMapData) {
    for (let mapData of arrMapData.maps) {
      const $map = createMapElement(mapData);
      $('.maps_list').append($map);
    }
    return;
  };

  //this request the data from /maps GET route and renders all map items
  const loadMaps = function() {
    $.ajax('/maps', { method: 'GET' })
      .then(function(mapsText) {
        console.log('Success: ', mapsText);
        renderMaps(mapsText);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
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
    const $form = $('.new_map_list form');
    //****** ROUTE: POST maps/ ************/
    //Save new maps and recreate the sidebar list.
    $form.submit(function(event) {
      event.preventDefault();

      let queryObj = {
        owner_id: 1,
        map_name: $("#mtitle").val(),
        map_desc: $("#mdesc").val(),
        mapCoordX: 1,
        mapCoordY: 2,
        mapZoom: 10
      };
      console.log("queryObj:", queryObj);

      //****************TODO****************************/
      //**Add data validation here**/

      request = $.ajax({ url: "/maps", method: "POST", data: queryObj});
      // Callback handler that will be called on success
      request.done(function(response, status, jqXHR) {
        console.log("Map POST successful. MapID:", response.maps.id);
        //if successful clear out the text values.
        $("#mtitle").val("");
        $("#mdesc").val("");
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
    //****** ROUTE: GET maps/:id ************/
    //this is the map selection form the maps list.
    //it fires when a map link is clicked and then gets the details of the map
    //and renders it.
    const $mapLink = $('.map_name a');
    $mapLink.on('click', function(event) {
      event.preventDefault();

      let queryObj = {
        owner_id: 1,
        map_name: $("#mtitle").val(),
        map_desc: $("#mdesc").val(),
        mapCoordX: 1,
        mapCoordY: 2,
        mapZoom: 10
      };
      console.log("Get Map queryObj:", queryObj);

      //****************TODO****************************/
      //**Add data validation here**/

      request = $.ajax({ url: "/maps/:id", method: "GET", data: queryObj});
      // Callback handler that will be called on success
      request.done(function(response, status, jqXHR) {
        console.log("Map GET successful. MapID:", response.map.id);
        //*****Open the Selected Map *******/
        //loadMap();
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
