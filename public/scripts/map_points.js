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
      <div class="map_points_list_wrapper">
        <p class="name">${escape(name)}</p>
        <p>${escape(description)}</p>
      </d>
    `);
    return $mapPoint;
  };

  //Loops through all Map_points and appends to .ejs template
  const renderMapPointsList = function(dataObj) {
    const mapPointsArr = dataObj.mapPoints;
    for (let mapPoint of mapPointsArr) {
      const $mapPoint = createMapPointElement(mapPoint);
      $('.map_points_list').prepend($mapPoint);
    }
    return;
  };

  //this request the data from /maps GET route and renders all map items
  const loadMapPoints = function() {
    // console.log('Made it to top of loadMapPoints');
    $.ajax('/map_points', { method: 'GET' })
      .then((mapPointsObj) => {
        $(".map_points_list_wrapper").remove();
        renderMapPointsList(mapPointsObj);
      })
      .catch(err => {
        console.log('Load Map Points Error', err);
        // res.status(500)
        //   .json({ error: err.message });
      });
  };

  const $newMapPoint = $('.new_pin_list form');


  $newMapPoint.submit(function(event) {
    event.preventDefault();

    const dataFromInputs = {
      newPinTitle: $("#ptitle").val(),
      newPinDesc: $("#pdesc").val()
    };

    $.ajax({ url: "/map_points", method: "POST", data: dataFromInputs})
      .then((response, status) =>  {
        console.log('Succesfully added new map pin!');
        loadMapPoints();
      })
      .catch((err) => {
        console.log("Error :", console.err.message);
      });



    // // Callback handler that will be called on failure
    // request.fail(function(jqXHR, status, error) {
    //   //if there was a failure
    //   console.error("The form POST failed. Error: " + status, error);
    // });


    // $.ajax('/map_points', { method: 'POST' })
    // .then((mapPointsObj) => {
    //   console.log('Created new map point!');
    //   renderMapPointsList(mapPointsObj);
    // })
    // .catch(err => {
    //   console.log('Creat New Map Points Error', err);

    // });

  });

  // $form.submit(function(event) {
  //   event.preventDefault();
  // $mapPointsList.on('click', function() {
  //   console.log("Cli");
  // });

  loadMapPoints();

});
