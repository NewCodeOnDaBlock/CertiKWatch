const express = require("express");
require('dotenv/config');

const cors = require("cors");
const app = express();
const PORT = 8000;
const server = app.listen(PORT, () => console.log(`You've successfully connected to port:${PORT}`));
const io = require("socket.io")(server, { cors: true })

const needle = require("needle");
const config = require('dotenv').config();
const TOKEN = process.env.bearerToken;
console.log('TOKEN', TOKEN)


const tweetCountURL = 'https://api.twitter.com/2/tweets/counts/recent?query=from:CertiKTech&granularity=day';
const followersURL = 'https://api.twitter.com/2/users/993673575230996480/followers';
const likesURL = 'https://api.twitter.com/2/users/993673575230996480/liked_tweets';


async function fetchTweets(socket) { 
    const tweetCounter = await needle.get(tweetCountURL , {
        headers:{
            Authorization: `Bearer ${TOKEN}`
        }
    })
    tweetCounter.on('data', (data) => { 
        try {
            const json = data;
            socket.emit('tweetCount', json)
            console.log('tweetCoundt data from server:', json)
        } catch (error) {
            console.log('error fetching tweet count data')
        }
    })
}

async function fetchFollowers(socket) { 
    const followerCounter = await needle.get(followersURL, {
        headers:{
            Authorization: `Bearer ${TOKEN}`
        }
    })
    followerCounter.on('data', (data) => { 
        try{
            const json = data;
            socket.emit('followerCount', json)
        } catch (error){
            console.log('error fetching follower data')
        }
    })
}

async function fetchLikes(socket) { 
    const likeCounter = await needle.get(likesURL , {
        headers:{
            Authorization: `Bearer ${TOKEN}`
        }
    })
    likeCounter.on('data', (data) => { 
        try{
            const json = data;
            socket.emit('likeCount', json)
        } catch (error){
            console.log('error fetching likes data')
        }
    })
}


io.on('connection', async () => { 
    console.log('API socket connected on the back end')
    let currentData
        try {
            currentData = await fetchTweets(io)
            curentData = await  fetchFollowers(io)
            curentData = await  fetchLikes(io)    
        } catch (error) {
            console.error(error)
            console.log('error with api socket call!');
            process.exit(1)
        }
    })
