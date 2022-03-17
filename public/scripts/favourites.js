//$(document).ready(function() {
  //this escapes the content
  // const escape = function(str) {
  //   let div = document.createElement("div");
  //   div.appendChild(document.createTextNode(str));
  //   return div.innerHTML;
  // };

  //********* Favourites Map List Render Functions **********/
  //this creates the HTML for a single map item
  const createFavouritesMapElement = function(mapData) {
  // href="/maps/${escape(mapData.id)}""
    const $map = $(`
      <div class="map_favourite_element_wrapper">
        <p class="favourite_map_name"><a id="favourite-${escape(mapData.id)}" href="#">${escape(mapData.name)}</a></p>
        <p>${escape(mapData.description)}</p>
        <p><button id="remove_${escape(mapData.id)}" type="submit">Remove</button></p>
      </div>
    `);
    return $map;
  };
    //this appends map items to the maps_list element in index.ejs.
  const renderFavouritesMaps = function(arrMapData) {
    $('.map_favourite_element_wrapper').remove();
    if (arrMapData.maps) {
      for (let mapData of arrMapData.maps) {
        const $map = createFavouritesMapElement(mapData);
        $('.favourites_list').prepend($map);
      }
    }
    return;
  };
  //this request the data from /maps GET route and renders all map items
  const loadFavouritesMaps = function() {
    $.ajax('/favourites', { method: 'GET' })
      .then(function(mapsText) {
        renderFavouritesMaps(mapsText);
      })
      .catch(err => {
        console.log("error:", err.message);
      });
  };
  //******** End Favourites Map List Render Functions ***********/
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
  };

  $(function() {
    let  request = null;

    $('.favourites_list').on('click', function(event) {
      event.preventDefault();
      event.target.id
      getMap(event.target.id.split('-')[1]);
    });

  });

  loadFavouritesMaps();
//});
