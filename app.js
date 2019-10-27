'use strict'
// imports
const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');

// Bring in the routes for the API (delete the default routes)
const routesApi = require('./routes/index');

// log requests to the console
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.ovalcms.com');
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4201');
  }

  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// Use the API routes when path starts with /rest
app.use('/', routesApi);

module.exports = app;
