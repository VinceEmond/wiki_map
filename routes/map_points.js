
/****************************/
/*    map_points ROUTES     */
/****************************/

const express = require('express');
const router  = express.Router();



module.exports = (db) => {

  // GET map_points   ---   Browse all map points for 1 map
  router.get("/", (req, res) => {

    // Value of which map to get points for
    const {map_id} = req.query;

    /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    /*   NOTE: req.query will be undefined when accessing via direct url  */
    /*   This subsquently breaks the JSON query */
    /*   and will not populate the /map_points */
    /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/

    // console.log("req.query.map_id", req.query.map_id);

    const queryStr = `
      SELECT *
      FROM map_points
      WHERE map_id = $1;`;

    // console.log('map_id', map_id);
    const queryParams = [req.query.map_id];

    db.query(queryStr, queryParams)
      .then(response => {
        const mapPoints = response.rows;
        res.json({ mapPoints });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  // POST map_points/   ---   Add a new map_point
  router.post("/", (req,res) => {
    const {
      map_id,
      owner_id,
      name,
      description,
      coord_x,
      coord_y,
      zoom,
      image
    } = req.body;

    const queryStr = `
      INSERT INTO map_points (map_id, owner_id, name, coord_x, coord_y, zoom, description, image) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      )
      returning *;`;

    const queryParams = [map_id, owner_id, name, coord_x, coord_y, zoom, description, image];

    db.query(queryStr, queryParams)
      .then(response => {
        const mapPoints = response.rows;
        console.log('response.rows', response.rows[0]);
        // console.log('New Map Point ID', response.rows[0]);
        // res.json({ mapPoints });
        res.json({ newMapPoint: response.rows[0]});
        // return response.rows[0];
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  });

  return router;
};

