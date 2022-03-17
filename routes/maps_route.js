/*
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  //this will reroute if the cookie hasn't
  //been set (user not logged in).
  router.use((req, res, next) => {
    console.log("I hit the cookie checker in the maps js");
    if (!req.cookies) {
      res.redirect('/login');
      return;
    } else if (!req.cookies.user_id) {
      res.redirect('/login');
      return;
    }
    next();
  });

  // GET maps/   ---   Browse all maps Limit to 10
  router.get("/", (req, res) => {

    db.query(`
      SELECT *
      FROM maps
      WHERE active = true
      LIMIT 15;`
    )
      .then(data => {
        const maps = data.rows;
        res.json({ maps });
      })
      .catch(err => {
        console.log("error:", err.message);
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  // GET maps/:id   ---  Get a map by id
  router.get("/:id", (req, res) => {

    db.query(`
      SELECT *
      FROM maps
      WHERE active = true
      AND id = $1;`
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

  // POST maps/   ---  Save a new map
  router.post("/", (req, res) => {
    const str = `
    INSERT INTO maps (owner_id, name, description, coord_x, coord_y, zoom) VALUES
    ($1,
    $2,
    $3,
    $4,
    $5,
    $6) RETURNING *;`;
    const { owner_id, name, desc, mapCoordX, mapCoordY, zoom } = req.body;

    const queryParams = [owner_id, name, desc, mapCoordX, mapCoordY, zoom];
    console.log("queryParams:",queryParams);
    return db.query(str, queryParams)
      .then(result => {
        console.log("maps.results",result.rows[0]);
        res.json({ map: result.rows[0] });
      })
      .catch(err => {
        console.log("err:", err.message);
        res.json({ error: err.message });
      });

  });
  return router;
};

