
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
    // const map_id = 1;

    /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    /*   NOTE: req.query will be undefined when accessing via direct url such as localhost/map_points
    /*   This subsquently breaks the JSON query */
    /*   and will not populate the /map_points */
    /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    /*  This route needs to be moved into GET /maps/:id/map_points
    /*  which will allow us to access the map id from req.params
    /*  in order to specify which map_points we want to obtain
    /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/

    // console.log("req.query.map_id", req.query.map_id);

    const queryStr = `
      SELECT *
      FROM map_points
      WHERE map_id = $1
      AND active IS true;`;

    // console.log('map_id', map_id);
    const queryParams = [map_id];

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

  // GET map_points/:id   ---   Read details for an existing map_point
  router.get("/:id", (req, res) => {

    // Value of which map to get points for
    // const {map_id} = req.query;
    // console.log('map_id', map_id);
    // const queryParams = [req.query.map_id];
    // console.log('Req Params', req.params);

    const {id} = req.params;
    const map_id = 1;  //  SEE LARGE NOTE BELLOW
    const queryParams = [id, map_id];

    /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    /*  NOTE: Currently hardcoded to only show map_points for one map
    /*  This route needs to be moved into GET /maps/:id/map_points/:id
    /*  which will allow us to access the map id from req.params
    /*  in order to specify which map_points we want to obtain
    /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/

    const queryStr = `
      SELECT *
      FROM map_points
      WHERE map_points.id = $1
      AND map_id = $2;`;

    db.query(queryStr,queryParams)
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
        res.json({ newMapPoint: response.rows[0]});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // POST map_points/:id/delete   ---   Read details for an existing map_point
  router.post('/:id/delete', (req, res) => {

    const map_point_id = 1;
    const map_id = 1;

    const queryStr = `
    UPDATE map_points
    SET active = false
    WHERE map_points.map_id = $1
    AND map_points.id = $2;
    `;

    const queryParams = [map_id,map_point_id];

    db.query(queryStr, queryParams)
      .then((response) => {
        console.log('Set the map_point to inactive');
        res.json({});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  return router;
};

