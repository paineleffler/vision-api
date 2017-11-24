# Vision-API

This is an API wrapper for my final project for Digital Archeology. The Vision-UI interacts with this API via axios requests. Currently the API wrapper has the following routes:

## Usage

GET `/labels?id=username&platform=<twitter|instagram>`

This returns labels and counts from images of username and platform. The labels are pulled from results stored in my MongoDB database. The labels are filtered if they have a confidence score under .8 or if they are considered a 'useless' word. These words are a custom list that were deemed uninteresting. Examples: color, product, angle, line... etc. These words commonly come back as results and they have little classification ability.

GET `/twitter/images?id=username`

GET `/instagram/images?id=username`

These return an array of the following object corresponding with the platform twitter/instagram:

``` javascript
  {
    "username": "franklindacorgi",
    "platform": "instagram",
    "url": "https://......jpg"
  }
```

POST `/results/`

This requires you to send a encoded body with the following contents:

```
  username:franklindacorgi
  url:https://.........jpg
  platform:instagram
```
This route checks the MongoDB to see if the URL has been processed, if not it will send the url to Google Vision's API then store and return the results.

## Setup

`cp .env.example .env`

`vim .env`

Fill out all the fields in .env. These are needed for the MongoDB connection and Twitter API.

## Run the API
```
  yarn
  yarn start
```