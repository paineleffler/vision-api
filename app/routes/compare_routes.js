module.exports = function(app, db) {
  app.get('/labels', (req, res) => {
    const username = req.query.id;
    const platform = req.query.platform;

    if (username === undefined) {
      res.status(400).end();
      return;
    }

    const details = { 
      'username': username,
      'platform': platform
    };

    db.collection('media').find(details).toArray((error, documents) => {
      var response = []
      for (var i = 0; i < documents.length; i++) {
        var labels = documents[i].results[0].labelAnnotations
       for (var j = 0; j < labels.length; j++) {
        if (labels[j].score > .8 && !isUselessWord(labels[j].description))
          response.push(labels[j].description)
       }
      }
      var tallied = {}
      for (var i = 0; i < response.length; i++) {
        if (tallied[response[i]]) {
          tallied[response[i]]++
        } else {
          tallied[response[i]] = 1
        }
      }
      res.send(tallied)
    })
  });
} 

function isUselessWord(word) {
  if (word.toLowerCase().search(/(product|photography|photograph|sky|profession|official|fun|event|snapshot|room|logo|brand|fiction|graphics|audio|circle|purple|photo caption|number|line|angle|color|white|red|yellow|blue|black|screenshot|text|label|girl|woman|man|boy|mammal|animal|material|font|area|advertising|advertisment)/) !== -1) {
    return true;
  }
  else {
    return false;
  }
}