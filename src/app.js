const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('winston');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');


/// db

const Sequelize = require('sequelize');
const sequelize = new Sequelize('dbalance_development', 'chuckbergeron', '', {
    host: 'localhost',
    dialect: 'postgres'
  }
);

const Message = sequelize.define('message', {
  text: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true
});
const service = require('feathers-sequelize');

/// db

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

const app = express(feathers());

// Load app configuration
app.configure(configuration());
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);



// // Create an in-memory Feathers service with a default page size of 2 items
// // and a maximum size of 4
// app.use('/messages', service({
//   Model: Message,
//   paginate: {
//     default: 2,
//     max: 4
//   }
// }));

// Message.sync({ force: true }).then(() => {
//   // Create a dummy Message
//   app.service('messages').create({
//     text: 'Message created on server'
//   }).then(message => console.log('Created message', message));
// });


// async function createAndFind() {
//   // Stores a reference to the messages service so we don't have to call it all the time
//   const messages = app.service('messages');

//   for(let counter = 0; counter < 100; counter++) {
//     await messages.create({
//       counter,
//       text: `Message number ${counter}`
//     });
//   }

//   // We show 10 entries by default. By skipping 10 we go to page 2
//   const page2 = await messages.find({
//     query: { $skip: 10 }
//   });

//   console.log('Page number 2', page2);

//   // Show 20 items per page
//   const largePage = await messages.find({
//     query: { $limit: 20 }
//   });

//   console.log('20 items', largePage);

//   // Find the first 10 items with counter greater 50 and less than 70
//   const counterList = await messages.find({
//     query: {
//       counter: { $gt: 50, $lt: 70 }
//     }
//   });

//   console.log('Counter greater 50 and less than 70', counterList);

//   // Find all entries with text "Message number 20"
//   const message20 = await messages.find({
//     query: {
//       message: 'Message number 20'
//     }
//   });

//   console.log('Entries with text "Message number 20"', message20);
// }

// createAndFind();







module.exports = app;
