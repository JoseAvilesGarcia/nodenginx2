'use strict';
const express = require('express');
const router = express.Router();
const compruebaUsuarios = require('../utils/compruebausuario')
/* GET users listing. */
router.get('/app2/users', function (req, res) {
    if (req.session.usuario) {
        res.redirect('/app1/control');

    } else {
        res.header({ 'content-type': 'text/html; charset=utf-8' });
         res.render('users', { title: 'users', obj:req.query });
    }

    
});
router.post('/app2/users', function (req, res) {
   
   
    if (compruebaUsuarios.getAutoriza(req.body.usuario, req.body.password)) {
        // req.session.usuario = req.body.usuario;
        req.session.usuario = req.body.usuario
        res.redirect('/app2/control');

    } else {
        res.header({ 'content-type': 'text/html; charset=utf-8' });
        res.render('users', { title: 'USuario desconocido', obj: req.body });
    }

});
module.exports = router;
