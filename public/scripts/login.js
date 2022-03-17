  //********* Login Render Functions **********/
  const login = function () {
    let queryObj = {
      id: currentUserId
    };
    //get the user data
    request = $.ajax({ url: "/users/" + queryObj.id, method: "GET", data: queryObj});

    // Callback handler that will be called on success
    request.done(function(response, status, jqXHR) {
      console.log("User GET successful. User:", response.user);
      const {
        id,
        name,
      } = response.user;
      //*****Open the Selected Map *******/
      currentMapId = id;
      $("#login_btn").text(name);

      //set the cookie
      request = $.ajax({ url: "/login/" + currentUserId, method: "GET", data: queryObj});
      // Callback handler that will be called on success
      request.done(function(response, status, jqXHR) {
        console.log("Login GET successful.");
      });
    });
      // Callback handler that will be called on failure
    request.fail(function(jqXHR, status, error) {
      //if there was a failure
      console.error("The user login failed. Error: " + status, error);
    });
  };


  $(function() {
    let  request = null;
    //****** ROUTE: GET login/:id ************/
    //this is the map selection form the maps list.
    //it fires when a map link is clicked and then gets the details of the map
    //and renders it.
    $('#login_btn').on('click', function(event) {
      event.preventDefault();
      login();

    });
  });

  //initial login
  login();

  // END //

