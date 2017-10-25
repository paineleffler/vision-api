const twitterRoutes = require('./twitter_routes');

module.exports = function(app, db) {
  twitterRoutes(app, db);
};
