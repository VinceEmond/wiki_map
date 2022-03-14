// Client facing scripts here


$(document).ready(function() {

  //this escapes the content
  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  //Create element for Single Map point
  const createMapPointElement = function(mapPointData) {
    const {name, description} = mapPointData;

    const $mapPoint = $(`
      <p class="name">Map Point Title: ${escape(name)}</p>
      <p>${escape(description)}</p>
    `);
    return $mapPoint;
  };

  //Loops through all Map_points and appends to .ejs template
  const renderMapPointsList = function(dataObj) {
    const mapPointsArr = dataObj.mapPoints;
    for (let mapPoint of mapPointsArr) {
      const $mapPoint = createMapPointElement(mapPoint);
      $('.map_points_list').append($mapPoint);
    }
    return;
  };

  //this request the data from /maps GET route and renders all map items
  const loadMapPoints = function() {
    console.log('Made it to top of loadMapPoints');
    $.ajax('/map_points', { method: 'GET' })
      .then((mapPointsObj) => {
        renderMapPointsList(mapPointsObj);
      })
      .catch(err => {
        console.log('Load Map Points Error', err);
        // res.status(500)
        //   .json({ error: err.message });
      });
  };

  const $mapPointsList = $('.map_points_list');

  $mapPointsList.on('click', function() {
    console.log("Attemp");
  });

  loadMapPoints();

  console.log('map_points.js file loaded!');
});
