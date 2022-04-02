const Twitter = require('twitter');
require('dotenv/config');

const apiKey = process.env.apiKey;
const apiKeySecretKey = process.env.apiKeySecretKey;
const accessToken = process.env.accessToken;
const accessTokenSecret = process.env.accessTokenSecret;

let client = new Twitter({
    consumer_key: apiKey,
    consumer_secret: apiKeySecretKey,
    access_token_key: accessToken,
    access_token_secret: accessTokenSecret
});

let params = { twitter_name: 'certikorg' };
client.get('/tweets/counts/recent?query=', params, function (error, tweets, response) {
    if (!error) {
        console.log(tweets);
    }
});