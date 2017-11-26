module.exports = function(app, db) {
  app.get('/analytics/users', (req, res) => {
    let response = { numUsers: 0 }
    db.collection('media').distinct('username', (error, documents) => {
      response.numUsers = documents.length
      res.send(response)
    })
  });
  app.get('/analytics/urls', (req, res) => {
    let response = { numUrls: 0 }
    db.collection('media').distinct('url', (error, documents) => {
      response.numUrls = documents.length
      res.send(response)
    })
  });
  app.get('/analytics/labels', (req, res) => {
    let response = { numLabels: 0 }
    db.collection('media').find({}).toArray((error, documents) => {
      var labelSet = new Set();
      for (var u in documents){
        for (var l in documents[u].results[0].labelAnnotations){
          labelSet.add(documents[u].results[0].labelAnnotations[l].description)
        }
      }
      response.numLabels = labelSet.size
      res.send(response)
    })
  });
} 