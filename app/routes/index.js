const mediaRoutes = require('./media_routes');
const compareRoutes = require('./compare_routes');
const analyticRoutes = require('./analytic_routes');

module.exports = function(app, db) {
  mediaRoutes(app, db);
  compareRoutes(app, db);
  analyticRoutes(app, db);
};
