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
    twitter.getUserTimeline({ screen_name: username, count: '100'},
    function (err, response, body) {
      console.log('ERROR [%s]', err);
    }, 
    function (data) {
      var tweets = JSON.parse(data)
      var urls = [];
      for (var i in tweets) {
        if(tweets[i].entities.media) {
          urls.push(tweets[i].entities.media[0].media_url_https)
        }
      }
      console.log(urls)
      res.send(urls)
    })
  });

  app.get('/results', (req, res) => {
    if (req.query.mid === undefined) {
      res.status(400).end();
      return;
    }
    const details = { 'mid': req.query.mid};

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
        console.log('No results found for media with that id! Generating results.....');
          vision.labelDetection({ source: { imageUri: `https://pbs.twimg.com/media/${req.query.mid}.jpg` } })
          .then((results) => {
            const url_result = {
              mid: req.query.mid,
              results: results,
              time: new Date()
            };
            db.collection('twitter-media').insert(url_result, (err, item) => {
              if (err) {
                res.send({ 'error': 'An error has occurred with creating your media results.' });
              } else {
                res.send(item);
              }
            });
        })
      }
    });
  });
};
