/* MAP_POINTS_ROUTES BY VINCE EMOND */

/****************************/
/*     MAP POINTS ROUTES    */
/****************************/

const express = require('express');
const router  = express.Router();

module.exports = (db) => {


  // GET:BROWSE - MAP POINTS --- RETREIVE ALL MAP POINTS FOR 1 MAP
  router.get("/", (req, res) => {
    const {map_id} = req.query;
    const queryParams = [map_id];
    const queryStr = `
      SELECT *
      FROM map_points
      WHERE map_id = $1
      AND active IS true;
    `;

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


  // GET:READ - MAP POINT --- RETRIEVE SPECIFIC MAP POINT BY ID
  router.get("/:id", (req, res) => {
    const {id} = req.params;
    const queryParams = [id];
    const queryStr = `
      SELECT *
      FROM map_points
      WHERE map_points.id = $1
    `;

    db.query(queryStr,queryParams)
      .then(response => {
        const mapPoint = response.rows[0];
        res.json({ mapPoint });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  // POST:EDIT - MAP POINT --- EDIT/UPDATE DATA FOR SPECIFIC MAP POINT
  router.post("/:id", (req,res) => {
    const {id} = req.params;
    const {name, description, image} = req.body;
    const queryParams = [name, description, image, id];
    const queryStr = `
      UPDATE map_points
      SET name = $1,
      description = $2,
      image = $3
      WHERE map_points.id = $4
      RETURNING *;
    `;

    db.query(queryStr, queryParams)
      .then(response => {
        const updatedMapPoint = response.rows[0];
        res.json({ updatedMapPoint });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  // POST:ADD - MAP POINT --- ADD/CREATE A NEW MAP POINT
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
    const queryParams = [map_id, owner_id, name, coord_x, coord_y, zoom, description, image];
    const queryStr = `
      INSERT INTO map_points (map_id, owner_id, name, coord_x, coord_y, zoom, description, image) VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    db.query(queryStr, queryParams)
      .then(response => {
        res.json({ newMapPoint: response.rows[0]});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  // POST:DELETE - MAP POINT --- SET EXISTING MAP POINT TO INACTIVE IN DB
  router.post('/:id/delete', (req, res) => {
    const map_point_id = req.body.map_point_id;
    const queryParams = [map_point_id];
    const queryStr = `
      UPDATE map_points
      SET active = false
      WHERE map_points.id = $1
      RETURNING *;
    `;

    db.query(queryStr, queryParams)
      .then((response) => {
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

/* MAP_POINTS_ROUTES BY VINCE EMOND */
