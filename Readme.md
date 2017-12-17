# Vision-API

This is an API wrapper for my final project for Digital Archeology. The [Vision-UI](https://github.com/paineleffler/vision-ui) interacts with this API via axios requests. The API wrapper routes are explained below.

## Project Background : Social Media Image Analysis

The purpose of this project was to create a tool that could quickly analyze images of a public social media account. Since looking through hundreds of images is time consuming and subjective to opinions, each of the images from a social media account were processed with Google [Cloud's Vision API](https://cloud.google.com/vision/). From the responses, labels are accumulated, filtered, and tracked to build textual data that can represent a person's interests, activities, or hobbies. Individuals' online personas can also be compared to determine if people share common interests. This project idea can be used in many different applications: suggestion algorithms for friends or pages, dating app matching, job recruiting, and even social media marketing analysis.

## Usage

GET `/labels?id=username&platform=<twitter|instagram>`

This returns labels and counts from images of username and platform. The labels are pulled from results stored in my MongoDB database. The labels are filtered if they have a confidence score under .8 or if they are considered a 'useless' word. These words are a custom list that were deemed uninteresting. Examples: color, product, angle, line... etc. These words commonly come back as results and they have little classification ability. Platform can be left out to include labels from all social medias.

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

This route checks the MongoDB to see if the URL has been processed, if not it will send the url to Google Vision's API then store and return the results. This requires you to send a encoded body with the following REQUIRED contents.

```
  username:franklindacorgi
  url:https://.........jpg
  platform:instagram
```

## Setup

Fill out all the fields in .env. These are needed for the MongoDB connection and Twitter API.

`cp .env.example .env`

`vim .env`



## Run the API

Install dependencies and start.

```
  yarn
  yarn start
```

## Known Issue during development 

This rarely happens, but it happens because the node process on port :5000 is still running, so you need to terminate it.

```
  yarn run v1.2.1
  $ node server.js
  events.js:182
        throw er; // Unhandled 'error' event
        ^

  Error: listen EADDRINUSE :::5000
```

To fix this run:

`lsof -i :5000`

`kill -9 <PID>` with <PID> being the Process ID given from the previous command.
