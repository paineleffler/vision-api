module.exports = function(app, db) {
  // /users?id=
  app.get('/users', (req, res) => {
    const username = req.query.id;

    if (username === undefined) {
      res.status(400).end();
      return;
    }

    const details = { 'username': username};

    db.collection('media').find(details).toArray((error, documents) => {
      var response = []
      for (var i = 0; i < documents.length; i++) {
        var labels = documents[i].results[0].labelAnnotations
       for (var j = 0; j < labels.length; j++) {
         response.push(labels[j].description)
       }
      }
      res.send(response)
    })
  });
}  