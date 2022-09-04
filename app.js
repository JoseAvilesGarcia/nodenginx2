'use strict';
if (!process.env.NODE_ENV) {
    require('dotenv').config({
        path: `.env`,
    });
}
var debug = require('debug')('my express app');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const uuid = require('uuid');
const { createClient } = require("redis")
const session = require('express-session');
let redisStore = require('connect-redis')(session);
const scanDirs = require('./utils/CargaRutas');
const compression = require('compression');

const privateKey = fs.readFileSync('./cert/selfsigned.key', 'utf8');
const certificate = fs.readFileSync('./cert/selfsigned.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const conexionredis = `redis://default:${process.env.REDIS_PW}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
let redisClient = createClient({ url: conexionredis, legacyMode: true })
redisClient.connect().catch(console.error)

const os = require('os');




var app = express();

app.use(
    session({
        name: 'sessionUUID',
        genid(req) {
            return uuid.v4();
        },
        secret: process.env.SESSIONPWD,
        resave: true,
        saveUninitialized: true,
        maxAge: 1200,

        cookie: {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        },

        store: new redisStore({ client: redisClient, ttl: 1200, prefix: 'Pruebas_app:' }),
    }),
);




app.use('/app2', express.static('./public'));




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


scanDirs('./routes/').forEach((p) => app.use(require(p.path)));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    res.header({ 'content-type': 'text/html; charset=utf-8' })
    next();
});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


https.createServer(credentials, app).listen(process.env.EXPRESSPORT, '0.0.0.0', () => {
    debug(`Express server listening on port ${process.env.EXPRESSPORT}`);
});

module.exports = app;