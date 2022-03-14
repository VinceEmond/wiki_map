/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();


// GET map_points/   ---   Browse all map points for 1 map
module.exports = (db) => {
  router.get("/", (req, res) => {
    const queryStr = `
      SELECT *
      FROM map_points
      WHERE map_id = $1;`;

    const queryParams = [1];

    db.query(queryStr, queryParams)
      .then(data => {
        const mapPoints = data.rows;
        res.json({ mapPoints });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  // router.post("/", (req, res) => {
  //   console.log("req", req.body.map_name);
  //   const str = `
  //   INSERT INTO maps (owner_id, name, description, coord_x, coord_y, zoom) VALUES
  //   (1,
  //   $1,
  //   $2,
  //   45.42135855590803,
  //   -75.69668268181056,
  //   13);`;
  //   console.log('queryStr:',str);
  //   db.query(str,[req.body.map_name, req.body.map_desc])
  //     .then(res => {
  //       console.log("success1");
  //     })
  //     .catch(err => {
  //       console.log("err:", err.message); res.json({ error: err.message });
  //     });

  // });
  return router;
};

