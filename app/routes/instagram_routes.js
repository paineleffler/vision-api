const Vision = require('@google-cloud/vision');
var InstagramPosts = require('instagram-screen-scrape').InstagramPosts;

//var cors = require('cors')

const vision = Vision();
var ObjectID = require('mongodb').ObjectID;
// var corsOptions = { origin: 'https://domain.calling.api.com'}
// add this to routes : cors(corsOptions)

module.exports = function(app, db) {

  app.get('/instagram/users', (req, res) => {
    const username = req.query.id;

    var streamOfPosts = new InstagramPosts({
      username: username
    });

    var response = []

    streamOfPosts.on('data', (post) => {
      response.push({ instaID: `${post.username}-${post.id}`, url: post.media })
    });

    streamOfPosts.on('end', () => {
      res.send(response)
    });
  });

  app.post('/instagram/results', (req, res) => {
    const url = req.body.url;
    const instaID = req.body.instaID;
    if (url === undefined && instaID == undefined) {
      res.status(400).end();
      return;
    }
    const details = { 'instaID': instaID};

    db.collection('instagram-media').findOne(details, (err, item) => {
      // backend error
      if (err) {
        res.send({'error':'An error has occurred with finding your media.'});
      } 
      // found
      else if (item){
        console.log('Found your media in database.')
        res.send(item);
      } 
      // not found
      else {
        console.log("Not in DB, sending to GV API.")
        vision.labelDetection({ source: { imageUri: url } })
        .then((results) => {
          console.log("Got a result for: ", url)
          const tweet_result = {
            instaID: instaID,
            url: url,
            results: results,
            time: new Date()
          };
          res.send(tweet_result)
          db.collection('instagram-media').insert(tweet_result, (err, item) => {
            if (err) {
              res.send({ 'error': 'An error has occurred with creating your media results.' });
            }
          });
        })
        .catch((err) => {
          console.error('ERROR:', err);
        });
      }
    });
  });
};
