//********* Contributor Map List Render Functions **********/
//this creates the HTML for a single map item
const createContributorMapElement = function(mapData) {
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
  //Event Handlers
$(function() {
  let  request = null;
  // Handles the contributor list item click event.
  $('.contributed_maps_list').on('click', function(event) {
    event.preventDefault();
    event.target.id;
    getMap(event.target.id.split('-')[1]);
  });

});

loadContributorMaps();
// END //
