// Client facing scripts here

/****************************/
/*     AFTER HTML LOADS     */
/****************************/
$(() => {


  /****************************/
  /*        VARIABLES         */
  /****************************/
  const $newMapPoint = $('.new_pin_list form');
  const $deleteMapPoint = $('#REPLACE-ME-WITH-A-TAG');


  /****************************/
  /*        FUNCTIONS         */
  /****************************/

  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  // Create element for Single Map point
  const createMapPointElement = function(mapPointData) {
    const {name, description} = mapPointData;

    const $mapPoint = $(`
      <div class="map_point_element_wrapper">
        <p class="name">${escape(name)}</p>
        <p>${escape(description)}</p>
      </d>
    `);
    return $mapPoint;
  };

  // Loops through all Map_points and appends to .ejs template
  const renderMapPointsList = function(dataObj) {
    const mapPointsArr = dataObj.mapPoints;
    for (let mapPoint of mapPointsArr) {
      const $mapPoint = createMapPointElement(mapPoint);
      $('.map_points_list').prepend($mapPoint);
      generatePin(mapPoint.coord_x, mapPoint.coord_y, mapPoint.image, mapPoint.name, mapPoint.description);
    }
    return;
  };

  const loadMapPoints = function() {
    const queryObj = {
      map_id: 1
    };

    $.ajax({url: "/map_points", method: 'GET', data: queryObj})
      .then((mapPointsObj) => {
        // Clears entire div of all existing map_points
        $(".map_point_element_wrapper").remove();
        // Render Map points with object returned from database
        renderMapPointsList(mapPointsObj);
      })
      .catch(err => {
        console.log('Load Map Points Error', err);
      });
  };


  /****************************/
  /*      EVENT LISTENERS     */
  /****************************/


  // Create a new map_point
  $newMapPoint.submit(function(event) {
    event.preventDefault();

    const currentMapId = 1;

    const dataForCall = {
      map_id: currentMapId,
      owner_id: 3,
      name: $("#ptitle").val(),
      description: $("#pdesc").val(),
      coord_x: 49.286328837515256,
      coord_y: -123.12303651918343,
      zoom: 16,
      image: 'https://lh5.googleusercontent.com/p/AF1QipO4u7FUScRtr2QGIF9nrrbr4We-JZs9P9WixOcE=w408-h271-k-no'
    };

    $.ajax({ url: "/map_points", method: "POST", data: dataForCall})
      .then((response, status) =>  {
        console.log(`Created a new map point on map_id ${currentMapId}. The new map_point's ID is: `, response.newMapPoint.id);
        loadMapPoints();
      })
      .catch((err) => {
        console.log("Error :", console.err.message);
      });
  });

  // Delete an existing map_point
  $deleteMapPoint.on('click',function(event) {
    event.preventDefault();

    const currentMapId = 1;
    const currentMapPointId = 1;

    const dataForCall = {
      map_id: currentMapId,
      map_point_id: currentMapPointId
    };

    $.ajax({ url: `map_points/${currentMapPointId}/delete`, method: "POST", data: dataForCall})
      .then((response, status) => {
        console.log(`Map ID ${currentMapId}'s map_point ${currentMapPointId} has been made inactive.`);
        loadMapPoints();
      })
      .catch((err) => {
        console.log("Error :", err.message);
      });
  });



  /****************************/
  /*     ON INITIAL LOAD      */
  /****************************/

  loadMapPoints();

});
