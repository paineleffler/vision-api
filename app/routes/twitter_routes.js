const Vision = require('@google-cloud/vision');
const Twitter = require('twitter-js-client').Twitter;
//var cors = require('cors')

var config = {
	"consumerKey": process.env.CONSUMER_KEY,
	"consumerSecret": process.env.CONSUMER_SECRET,
	"accessToken": process.env.ACCESS_TOKEN,
	"accessTokenSecret": process.env.ACCESS_TOKEN_SECRET,
	"callBackUrl": process.env.CALLBACK_URL
}

const twitter = new Twitter(config);
const vision = Vision();
var ObjectID = require('mongodb').ObjectID;
// var corsOptions = { origin: 'https://domain.calling.api.com'}
// add this to routes : cors(corsOptions)

module.exports = function(app, db) {

  app.get('/users', (req, res) => {
    const username = req.query.id;
    twitter.getUserTimeline({ screen_name: username, count: '50'},
    function (err, response, body) {
      console.log('ERROR [%s]', err);
    }, 
    function (data) {
      var tweets = JSON.parse(data)
      var response = [];
      for (var i in tweets) {
        if (tweets[i].entities.media && tweets[i].entities.media[0].type == "photo") {
          response.push({ tweetID: tweets[i].id , url: tweets[i].entities.media[0].media_url_https })
        }
      }
      res.send(response)
    })
  });

  app.post('/results', (req, res) => {
    const url = req.body.url;
    const tweetID = req.body.tweetID;
    if (url === undefined && tweetID == undefined) {
      res.status(400).end();
      return;
    }
    const details = { 'tweetID': tweetID};

    db.collection('twitter-media').findOne(details, (err, item) => {
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
            tweetID: tweetID,
            url: url,
            results: results,
            time: new Date()
          };
          res.send(tweet_result)
          db.collection('twitter-media').insert(tweet_result, (err, item) => {
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
