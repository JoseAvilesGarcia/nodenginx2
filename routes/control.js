'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/app2/control', function (req, res) {
    res.render('control', { title: 'Express',req,res });
});

module.exports = router;