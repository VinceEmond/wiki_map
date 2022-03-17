/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
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
  //users GET Route
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500);
      });
  });
  //users GET Route
  router.get("/:id", (req, res) => {
    console.log("req.params:",req.params);
    console.log("req.params.id:",req.params.id);
    db.query(`
      SELECT *
      FROM users
      WHERE active = true
      AND id = $1;`
    ,[req.params.id])

      .then(data => {
        const user = data.rows[0];
        res.json({ user });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
