/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get('/', (req, res) => {
    const demoUserId = 1;
    // send the user to the login/:id
    res.redirect('/login/' + demoUserId);
  });

  router.get('/:id', (req, res) => {
    console.log("userLoginid:", req.params.id)
    // set the cookie
    res.cookie('user_id', req.params.id);

    // send the user to the main page
    res.redirect('/');
  });
  return router;
};

