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
      SELECT * from
        ( SELECT maps.id as id,  maps.name AS name, maps.description AS description, maps.owner_id
          FROM maps
          JOIN map_points ON map_points.map_id = maps.id
          WHERE map_points.owner_id = $1 and map_points.active = true and maps.active = true
          GROUP BY maps.id
          UNION
          SELECT maps.id as id,  maps.name AS name, maps.description AS description, maps.owner_id
          FROM maps
          WHERE maps.owner_id = $1
          AND maps.active = true
        ) contrib
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
  return router;
};
