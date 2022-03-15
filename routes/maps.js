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
  //this will reroute if the cookie hasn't
  //been set (user not logged in).
  router.use((req, res, next) => {
    if (!req.cookies) {
      res.redirect('/login');
    } else if (!req.cookies.user_id) {
      res.redirect('/login');
    }
    next();
  });
  router.get("/", (req, res) => {
    db.query(`
      SELECT *
      FROM maps
      WHERE active = true
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
  router.get("/:id", (req, res) => {
    console.log("map_id:",req.params.id);
    db.query(`
      SELECT *
      FROM maps
      WHERE active = true AND id = $1
      LIMIT 10;`
    ,[req.params.id])
      .then(data => {
        const map = data.rows[0];
        res.json({ map });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  router.post("/", (req, res) => {

    const str = `
    INSERT INTO maps (owner_id, name, description, coord_x, coord_y, zoom) VALUES
    ($1,
    $2,
    $3,
    $4,
    $5,
    $6) RETURNING *;`;

    return db.query(str,[req.body.owner_id, req.body.map_name, req.body.map_desc, req.body.mapCoordX, req.body.mapCoordY, req.body.mapZoom])
      .then(result => {
        res.json({ maps: result.rows[0] });
      })
      .catch(err => {
        console.log("err:", err.message);
        res.json({ error: err.message });
      });

  });
  return router;
};

