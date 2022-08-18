
const express = require('express');
const welcomeRouter = express.Router();

welcomeRouter.get('/', (req, res) => {
  res.send('Welcome to Jannah Service API');
});

module.exports = welcomeRouter;