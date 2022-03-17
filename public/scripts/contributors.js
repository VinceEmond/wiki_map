//$(document).ready(function() {
  //********* Contributor Map List Render Functions **********/
  //this creates the HTML for a single map item
  const createContributorMapElement = function(mapData) {
  // href="/maps/${escape(mapData.id)}""
    const $map = $(`
      <div class="map_contrib_element_wrapper">
        <p class="contrib_map_name"><a id="contrib-${escape(mapData.id)}" href="#">${escape(mapData.name)}</a></p>
        <p>${escape(mapData.description)}</p>
      </div>
    `);
    return $map;
  };
    //this appends map items to the maps_list element in index.ejs.
  const renderContributorMaps = function(arrMapData) {
    $('.map_contrib_element_wrapper').remove();
    if (arrMapData.maps) {
      for (let mapData of arrMapData.maps) {
        const $map = createContributorMapElement(mapData);
        $('.contributed_maps_list').prepend($map);
      }
    }
    return;
  };
  //this request the data from /maps GET route and renders all map items
  const loadContributorMaps = function() {
    $.ajax('/contributors', { method: 'GET' })
      .then(function(mapsText) {
        renderContributorMaps(mapsText);
      })
      .catch(err => {
        console.log("error:", err.message);
      });
  };
  //******** End Contributor Map List Render Functions ***********/
  // const getMap = function(mapId) {
  //   let queryObj = {
  //         id: mapId
  //       };
  //   request = $.ajax({ url: "/maps/" + mapId, method: "GET", data: queryObj});

  //   // Callback handler that will be called on success
  //   request.done(function(response, status, jqXHR) {
  //     console.log("Map GET successful. MapID:", response.map);
  //     const {
  //       id,
  //       active,
  //       owner_id,
  //       name,
  //       description,
  //       coord_x,
  //       coord_y,
  //       zoom
  //     } = response.map;
  //     //*****Open the Selected Map *******/
  //     currentMapId = id;
  //     $("#map-name").text(name);
  //     map.remove();
  //     initMap();
  //     setView(coord_x, coord_y, zoom);
  //     loadMapPoints();
  //   });
  //   // Callback handler that will be called on failure
  //   request.fail(function(jqXHR, status, error) {
  //     //if there was a failure
  //     console.error("The form POST failed. Error: " + status, error);
  //   });
  //   // Callback handler that will be called regardless
  //   // if the request failed or succeeded
  //   request.always(function() {
  //     //$inputs.prop("disabled", false);
  //   });
  // };

  $(function() {
    let  request = null;

    $('.contributed_maps_list').on('click', function(event) {
      event.preventDefault();
      event.target.id
      getMap(event.target.id.split('-')[1]);
    });

  });

  loadContributorMaps();
//});
