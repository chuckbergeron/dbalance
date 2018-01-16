const addresses = require('./addresses/addresses.service.js');
module.exports = function (app) {
  app.configure(addresses);
};

