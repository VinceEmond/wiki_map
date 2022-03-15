// Client facing scripts here


/****************************/
/*     AFTER HTML LOADS     */
/****************************/
$(() => {


  /****************************/
  /*        VARIABLES         */
  /****************************/
  const $newMapPoint = $('.new_pin_list form');


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

  $newMapPoint.submit(function(event) {
    event.preventDefault();

    const dataFromInputs = {
      map_id: 1,
      owner_id: 3,
      name: $("#ptitle").val(),
      description: $("#pdesc").val(),
      coord_x: 49.286328837515256,
      coord_y: -123.12303651918343,
      zoom: 16,
      image: 'https://lh5.googleusercontent.com/p/AF1QipO4u7FUScRtr2QGIF9nrrbr4We-JZs9P9WixOcE=w408-h271-k-no'
    };

    $.ajax({ url: "/map_points", method: "POST", data: dataFromInputs})
      .then((response, status) =>  {
        console.log('Succesfully added new map point!');
        console.log("The new map point ID is: ", response.newMapPoint.id);
        loadMapPoints();
      })
      .catch((err) => {
        console.log("Error :", console.err.message);
      });

  });


  /****************************/
  /*     ON INITIAL LOAD      */
  /****************************/

  loadMapPoints();

});
