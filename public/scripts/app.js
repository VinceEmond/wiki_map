// Client facing scripts here


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
      <p class="name">${escape(mapData.name)}</p>
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
    const $form = $('form');
    //****************TODO****************************/
    //*****this maps submit/POST needs work **********/
    //************************************************/
    $form.submit(function (event) {
      event.preventDefault();
      const mapName = $("#map_name").val();
      const mapDesc = $("#map_desc").val();
      console.log("mapName:",mapName);

      let queryStr = $form.find("button, input, input");
      queryStr = { map_name: mapName, map_desc: mapDesc };
      console.log("queryStr:", queryStr);
      console.log("thisSerialize:",$( this ).serialize());
      console.log("formSerialize:",$form.serialize());
      //****************TODO****************************/
      //**Add data validation here**/

      //****************TODO****************************/
      //** "/maps" POST route to add a map needs to be created in routes/maps.js **/
      request = $.ajax({ url: "/maps", method: "POST", data: queryStr});
      // Callback handler that will be called on success
      request.done(function (response, status, jqXHR){
        console.log("Map POST successful.");
        //if successful clear out the text values.
        $("#map_name").val("");
        $("#map_desc").val("");
        loadMaps();
      });
      // Callback handler that will be called on failure
      request.fail(function (jqXHR, status, error){
        //if there was a failure
        console.error("The form POST failed. Error: " + status, error);
      });
      // Callback handler that will be called regardless
      // if the request failed or succeeded
      request.always(function () {
        //$inputs.prop("disabled", false);
      });
    });
  });
  //the map list gets rendered the first time.
  loadMaps();

});
