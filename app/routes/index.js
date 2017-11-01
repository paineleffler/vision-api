const twitterRoutes = require('./twitter_routes');
const instagramRoutes = require('./instagram_routes');

module.exports = function(app, db) {
  twitterRoutes(app, db);
  instagramRoutes(app, db);
};
