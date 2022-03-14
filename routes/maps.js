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
  // router.post("/", (req, res) => {
  //   console.log("req", req.body);
  //   db.query(`
  //   INSERT INTO maps (owner_id, name, description, coord_x, coord_y, zoom) VALUES
  //   1,
  //   'NewMapName',
  //   'This is the description of a new map name',
  //   45.42135855590803,
  //   -75.69668268181056,
  //   13;`
  //   )
  //     .then(data => {
  //       const maps = data.rows;
  //       res.json({ maps });
  //     })
  //     .catch(err => {
  //       res
  //         .status(500)
  //         .json({ error: err.message });
  //     });
  // });
  return router;
};

// POST maps/   ---
// module.exports = (db) => {
//   router.post("/", (req, res) => {
//     console.log("req", req);
//     db.query(`
//     INSERT INTO maps (owner_id, name, description, coord_x, coord_y, zoom) VALUES
//     1,
//     'NewMapName',
//     'This is the description of a new map name',
//     45.42135855590803,
//     -75.69668268181056,
//     13;`
//     )
//       .then(data => {
//         const maps = data.rows;
//         res.json({ maps });
//       })
//       .catch(err => {
//         res
//           .status(500)
//           .json({ error: err.message });
//       });
//   });
//   return router;
// };


