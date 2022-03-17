/*
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  //this will reroute if the cookie hasn't
  //been set (user not logged in).
  router.use((req, res, next) => {
    if (!req.cookies) {
      res.redirect('/login');
      return;
    } else if (!req.cookies.user_id) {
      res.redirect('/login');
      return;
    }
    next();
  });
  // GET maps/contributors   ---  Get a map by Contributors
  router.get("/", (req, res) => {

    db.query(`
      SELECT maps.id as id,  maps.name AS name, maps.description AS description, maps.owner_id
      FROM favourite_maps
      JOIN maps ON maps.id = favourite_maps.map_id
      WHERE maps.active = true AND favourite_maps.user_id = $1
      ORDER BY id
      LIMIT 15;`, [req.cookies.user_id]
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
  // POST maps/   ---  Save a new map
  router.post("/new", (req, res) => {
    const str = `
    INSERT INTO favourite_maps (user_id, map_id) VALUES ( $1, $2) RETURNING *;`;
    const { user_id, map_id } = req.body;

    const queryParams = [user_id, map_id];
    console.log("new Fav queryParams:",queryParams);
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
