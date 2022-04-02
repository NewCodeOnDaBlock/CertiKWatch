import React, { useEffect, useState } from 'react';
import Heart from '../assets/images/heart-solid.svg'
import Tweet from '../assets/images/twitter-brands (2).svg'
import User from '../assets/images/user-solid.svg'
import io from 'socket.io-client';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import '../style/Dashboard.css';
import '../style/keyword.css';
import {Chart, ArcElement, CategoryScale, LinearScale, PointElement, LineController, LineElement, Filler} from 'chart.js'
import 'chart.js/auto'
Chart.register(ArcElement, CategoryScale, LinearScale, PointElement, LineController, LineElement, Filler);
const Sentiment = require('sentiment');
const sentiment = new Sentiment();



const Dashboard = (props) => {
    
    const [socket] = useState(() => io(":8000"))
    const [tweetCountError, setTweetCountError] = useState('');
    const [followCountError, setFollowCountError] = useState('');
    const [likeCountError, setLikeCountError] = useState('');
    const [tweetcount, setTweetCount] = useState('');
    const [followercount, setFollowerCount] = useState('');
    const [likecount, setLikeCount] = useState('');
    const [keywordsearch, setKeywordSearch] = useState('');
    const [searchresult, setSearchResult] = useState('');


    useEffect(() => {
        socket?.on('likeCount', (likeCount) => { 
            if (!likeCount) {
                setLikeCountError("Loading..")
            } else {
                setLikeCount(likeCount.meta.result_count.toString())
            }
        })
    }, [socket, likecount])

    useEffect(() => {
        socket?.on('tweetCount', (tweetCount) => { 
            if (!tweetCount) {
                setTweetCountError("Loading..")
            } else {
                setTweetCount(tweetCount.meta.total_tweet_count.toString());
            }
        })
    }, [socket, tweetcount])

    useEffect(() => {
        socket?.on('followerCount', (followCount) => { 
            if (!followCount) {
                setFollowCountError("Loading..")
            } else {
                setFollowerCount(followCount.meta.result_count.toString())
            }
        })
    }, [socket, followercount])


    const keywordInput = (e) => {
        e.preventDefault();
        setKeywordSearch(e.target.value);
    }
    const searchKeyword = (e) => {
        e.preventDefault();
        if (keywordsearch < 1) {
            setKeywordSearch('Error must be more than 1 character!');
        }
        const searchResult = sentiment.analyze(keywordsearch);
        setSearchResult(searchResult)
            console.log('searchresult:', searchresult);  
            console.log('searchresult score:', searchresult.score);  
            console.log('searchresult positive:', searchresult.positive);  
            console.log('searchresult negative:', searchresult.negative);  
        setKeywordSearch('');  
    }



    return (
    <div>
        <form onSubmit={searchKeyword}>
            <label>Search for keywords</label>
            <input onChange={keywordInput} value={keywordsearch} placeholder="Type keyword here..."/>
            <button>Get Analysis</button>
        </form>
        <div className='dashboard-main-container'>
            <div className='sentimate-box'>
                <h1>CertiK Setiment Analysis</h1>
                <div className='sent-analytics-conainter'>
                    <div style={{width: "150px", height: "150px"}}>
                        <Doughnut 
                            data={{
                                datasets: [
                                    {
                                        label: ["Positive", "Neutral", "Negative"],
                                        data: ['50','30','10'],
                                        backgroundColor: [
                                            '#2cc479',
                                            '#F5A623',
                                            '#5A678A',
                                        ],
                                        borderWidth: 1
                                    },
                                ],
                            }}   
                            height={200}
                            width={500}
                            options={{
                                maintainAspectRatio: false,
                            }}                     
                        />
                    </div>
                    <h3 className="doughnut-mid">90.7% Non-negativeRecognition</h3>
                    <div className="labelsent-section"> 
                        <div className="label-box-score">
                            <span />
                            <h3>Sentiment Score:</h3>
                            <h3>200</h3> 
                            <h3>{sentiment.score}</h3> 
                        </div>
                        <div className="label-box">
                            <span className="colorBoxOne"/>
                            <h3>Positive</h3>
                            <h3>75%</h3>
                            <h3>{sentiment.positive}</h3> 
                        </div>
                        <div className="label-box">
                            <span className="colorBoxTwo"/>
                            <h3>Neutral</h3>
                            <h3>12.5%</h3>
                        </div>
                        <div className="label-box">
                            <span className="colorBoxThree"/>
                            <h3>Negative</h3>
                            <h3>12.5%</h3>
                            <h3>{sentiment.negative}</h3> 
                        </div>
                    </div>
                    <div>
                        <h3 style={{marginBottom:'5px'}}>Change in Non-negative Recognition</h3>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div className="change-box">
                                <h3>1-Day Change%</h3>
                                <h3 style={{color: '#2cc479'}}>1.39%</h3>
                            </div>
                            <div className="change-box">
                                <h3>7-Day Change%</h3>
                                <h3 style={{color: '#FF445B'}}>0.25%</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="social-box">
                    <div className="title-with-select-container">
                        <h1>7 Day Twitter Account Activity</h1>
                        <div className='selectOption-container'>
                            <select>
                                <option>14 days</option>
                                <option>30 days</option>
                                <option>1 year</option>
                            </select>
                            <select>
                                <option>By day</option>
                                <option>By hour</option>
                                <option>By seconds</option>
                            </select>
                        </div>
                    </div>
                <div className="twitter-activity-container">
                    <div className="total-favs">
                        <div className="total-title">
                            <h1>Total Favorites: {likecount}</h1>
                            <img src={Heart} alt=""/>
                        </div>
                        <div style={{height: '180px', with: '180px', padding: '10px', paddingBottom: '30px'}}>
                            <Line 
                                data={{
                                datasets: [
                                    {
                                        label: '',
                                        data: [ 
                                        { x: 'Mon', y: 100 },
                                        { x: 'Tues', y: 200 },
                                        { x: 'Wed', y: 80 },
                                        { x: 'Thurs', y: 300 },
                                        { x: 'Fri', y: 500 },
                                        { x: 'Sat', y: 200 },
                                        { x: 'Sun', y: 700 },
                                    ],
                                        showLine: true,
                                        fill: true,
                                        borderColor: 'rgb(75, 192, 192)',
                                        backgroundColor: "rgb(255, 99, 132)",
                                        pointRadius: 0,
                                        borderWidth: 2,
                                        responsive:true
                                    },
                                ],
                            }}   
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    x: {
                                        type: 'category',
                                        time: {
                                            unit: 'minute',
                                            stepSize: 1,
                                        },
                                        grid: {
                                            borderColor: 'rgb(75, 192, 192)',
                                            tickColor: 'white',
                                            drawTicks: true,
                                            lineWidth: 1
                                        },
                                        distribution: 'linear',
                                    },
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }}                           
                            />
                        </div>
                    </div>
                    <div className="total-tweets">
                        <div className="total-title">
                            <h1>Daily Tweets: {tweetcount}</h1>
                            <img src={Tweet} alt=""/>
                        </div>
                        <div style={{height: '180px', with: '180px', padding: '10px', paddingBottom: '30px'}}>
                            <Line 
                                data={{
                                datasets: [
                                    {
                                        label: '',
                                        data: [ 
                                        { x: 'Mon', y: 20 },
                                        { x: 'Tues', y: 10 },
                                        { x: 'Wed', y: 40 },
                                        { x: 'Thurs', y: 20 },
                                        { x: 'Fri', y: 60 },
                                        { x: 'Sat', y: 50 },
                                        { x: 'Sun', y: 20 },
                                    ],
                                        showLine: true,
                                        fill: false,
                                        borderColor: 'rgb(75, 192, 192)',
                                        pointRadius: 0,
                                        borderWidth: 2,
                                        responsive:true
                                    },
                                    {
                                        label: '',
                                        data: [ 
                                        { x: 'Mon', y: 40 },
                                        { x: 'Tues', y: 10 },
                                        { x: 'Wed', y: 105 },
                                        { x: 'Thurs', y: 20 },
                                        { x: 'Fri', y: 100 },
                                        { x: 'Sat', y: 90 },
                                        { x: 'Sun', y: 90 },
                                    ],
                                        showLine: true,
                                        fill: false,
                                        borderColor: '#F5A623',
                                        pointBorderWidth: 1,
                                        pointHoverRadius: 5,
                                        pointRadius: 0,
                                        borderWidth: 2,
                                        responsive:true
                                    },
                                ],
                            }}   
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    x: {
                                        type: 'category',
                                        time: {
                                            unit: 'minute',
                                            stepSize: 1,
                                        },
                                        grid: {
                                            borderColor: 'rgb(75, 192, 192)',
                                            tickColor: 'white',
                                            drawTicks: true,
                                            lineWidth: 1
                                        },
                                        distribution: 'linear',
                                    },
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }}                           
                            />
                        </div>
                    </div>
                    <div className="total-follows">
                        <div className="total-title">
                            <h1>Total Follows: {followercount}</h1>
                            <img src={User} alt=""/>
                            <h3 style={{color: '#2cc479'}}>0.10%</h3>
                        </div>
                        <div style={{height: '180px', with: '180px', padding: '10px', paddingBottom: '30px'}}>
                            <Bar
                                data={{
                                datasets: [
                                    {
                                        label: '',
                                        data: [ 
                                        { x: 'Mon', y: 20 },
                                        { x: 'Tues', y: 10 },
                                        { x: 'Wed', y: 40 },
                                        { x: 'Thurs', y: 20 },
                                        { x: 'Fri', y: 60 },
                                        { x: 'Sat', y: 50 },
                                        { x: 'Sun', y: 20 },
                                    ],
                                        showLine: true,
                                        fill: false,
                                        borderColor: '#5A678A',
                                        backgroundColor: '#5A678A',
                                        pointRadius: 0,
                                        borderWidth: 2,
                                        responsive:true
                                    },
                                    {
                                        label: '',
                                        data: [ 
                                        { x: 'Mon', y: 40 },
                                        { x: 'Tues', y: 10 },
                                        { x: 'Wed', y: 105 },
                                        { x: 'Thurs', y: 20 },
                                        { x: 'Fri', y: 100 },
                                        { x: 'Sat', y: 90 },
                                        { x: 'Sun', y: 90 },
                                    ],
                                        showLine: true,
                                        fill: true,
                                        borderColor: '#5A678A',
                                        backgroundColor: '#5A678A',
                                        pointBorderWidth: 1,
                                        pointHoverRadius: 5,
                                        pointRadius: 0,
                                        borderWidth: 2,
                                        responsive:true
                                    },
                                ],
                            }}   
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    x: {
                                        type: 'category',
                                        time: {
                                            unit: 'minute',
                                            stepSize: 1,
                                        },
                                        grid: {
                                            borderColor: 'rgb(75, 192, 192)',
                                            tickColor: 'white',
                                            drawTicks: true,
                                            lineWidth: 1
                                        },
                                        distribution: 'linear',
                                    },
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }}                           
                            />
                        </div>

                    </div>

                </div>
                    <div className="keywords-title">
                        <h1>Social Keywords Aggregated By CertiK</h1>
                    </div>
                <div className="keyword-container">
                    <div className="left-of-keyword">
                        <h1 className="shib">$SHIB</h1>
                        <h1 className="moon">Moon</h1>
                        <h1 className="PCS">PancakeSwap</h1>
                        <h1 className="crypto">$CRO</h1>
                        <h1 className="ada">$ada</h1>
                        <h1 className="MANA">$MANA</h1>
                        <h1 className="HBAR">$HBAR</h1>
                    </div>
                    <div className="right-of-keyword">
                        <h1 className="algo">$Algo</h1>
                        <h1 className="community">Community</h1>
                        <h1 className="burn">Burn</h1>
                        <h1 className="rug">Rug</h1>
                        <h1 className="bnb">$BNB</h1>
                        <h1 className="sol">$SOL</h1>
                    </div>
                </div>
            </div>        
        </div>
    </div>
    )
}

export default Dashboard;