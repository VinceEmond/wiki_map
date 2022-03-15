/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();


// GET maps/   ---   Browse all maps Limit to 10
module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`
      SELECT *
      FROM maps
      LIMIT 10;`
    )
      .then(data => {
        const maps = data.rows;
        res.json({ maps });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  router.post("/", (req, res) => {
    console.log("req", req.body.map_name);
    const str = `
    INSERT INTO maps (owner_id, name, description, coord_x, coord_y, zoom) VALUES
    (1,
    $1,
    $2,
    45.42135855590803,
    -75.69668268181056,
    13);`;
    console.log('queryStr:',str);
    db.query(str,[req.body.map_name, req.body.map_desc])
      .then(res => {
        console.log("success1");
      })
      .catch(err => {
        console.log("err:", err.message); res.json({ error: err.message });
      });

  });
  return router;
};

