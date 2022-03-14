/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();



module.exports = (db) => {

  // GET map_points/   ---   Browse all map points for 1 map
  router.get("/", (req, res) => {
    const queryStr = `
      SELECT *
      FROM map_points
      WHERE map_id = $1;`;

    const queryParams = [1];

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


    const queryStr = `
      INSERT INTO map_points (map_id, owner_id, name, coord_x, coord_y, zoom, description, image) VALUES (
        1,
        3,
        $1,
        49.286328837515256,
        -123.12303651918343,
        16,
        $2,
        'https://lh5.googleusercontent.com/p/AF1QipO4u7FUScRtr2QGIF9nrrbr4We-JZs9P9WixOcE=w408-h271-k-no'
      );`;

    const queryParams = [req.body.newPinTitle, req.body.newPinDesc];
    // const queryParams = ['Test Title', 'Test Desc'];

    // console.log("Request body", req.body);


    db.query(queryStr, queryParams)
      .then(response => {
        const mapPoints = response.rows;
        res.json({ mapPoints });
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

