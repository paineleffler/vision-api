const mediaRoutes = require('./media_routes');

module.exports = function(app, db) {
  mediaRoutes(app, db);
};
