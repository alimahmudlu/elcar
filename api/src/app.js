const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');
const cookieParser = require('cookie-parser')

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const casl = require('feathers-casl');
const cronJobs = require('./cron-jobs');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

const mongoose = require('./mongoose');

const authentication = require('./authentication');

const app = express(feathers());

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet({
    contentSecurityPolicy: true,
    crossOriginResourcePolicy: false,
}));

app.use(compress());

app.use(cors({
    origin: process.env.ORIGINS.split(', '),
    credentials: true
}));

app.use(cookieParser())

global.currentLanguage = 'az';

const languageMiddleware = (req, res, next) => {
    global.currentLanguage = req.headers['content-language'];
    next();
}

app.use(languageMiddleware);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

app.configure(mongoose);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);
app.configure(casl());
app.configure(cronJobs);

// Configure a middleware for 404s and the error handler
app.use(express.notFound({verbose: true}));
app.use(express.errorHandler({logger}));

app.hooks(appHooks);

global.parseCookie = str => str?.split(';').map(v => v.split('=')).reduce((acc, v) => {
    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
    return acc;
}, {});

module.exports = app;
