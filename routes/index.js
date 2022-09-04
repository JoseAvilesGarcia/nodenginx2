'use strict';
var express = require('express');
var router = express.Router();
const  os  = require('os');
/* GET home page. */
router.get('/app2/', function (req, res) {
 
        req.session.appname = 'app1';
        req.session.nodo = os.hostname();


        res.render('index', { title: 'Express',req,res });

  
});

router.post('/app1/', function (req, res) {

    
    req.session.mimascota = req.body.mimascota


    res.render('index', { title: 'Express', req,res });





});



module.exports = router;
