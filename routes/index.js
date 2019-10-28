'use strict'
const express = require('express');
const router = express.Router();

const ctrlContent = require('../routes/content');
const ctrlToken = require('../routes/token');

// GET home page
router.get('/', (req, res) => {
  res.render('index', { title: 'OvalCMS' });
});

// content
router.get('/content/:pageId', ctrlContent.contentGet);

// token
router.post('/token', ctrlToken.tokenPost);
router.delete('/token/:tokenId', ctrlToken.tokenDelete);

module.exports = router;
