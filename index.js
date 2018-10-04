const express = require('express');
const hbs = require('hbs');
const axios = require('axios');
const bodyParser = require('body-parser');

var app = express();

var latitude, longitude, summary, temp, atom, imgURL, humidity, feelsLike, windSpeed, visibility;
var currentTime, dateTime, timeZone, dtzHours, dtzDays;
var tempHigh, tempLow;
var hours, hours_temp = [];
var day, day_high = [], day_low = [];
var day_atom = [], hours_atom = [];
var date, hoursData=[], dataHourly = [], dataWeekly = [], daysData=[], imgURLweekly = [], imgURLhourly = [];


const api_key =  '*****************************';
const darksky_key = '**************************';

app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.static(__dirname + 'public/images'));
app.use(bodyParser.urlencoded({ extended: true }));

hbs.registerPartials(__dirname + '/views/partialViews');

app.post('/', (req,res) => {
  let address = req.body.address;
  console.log('location: ' +address);

  axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=<'+ address +'>&key=' + api_key)
  .then(function (response) {
     latitude = response.data.results[0].geometry.location.lat;
     longitude = response.data.results[0].geometry.location.lng;
     getWeather(latitude, longitude);
    })
    .catch(function (error) {
      console.log(error);
  });

});

function getWeather(latitude, longitude){
  axios.get('https://api.darksky.net/forecast/'+ darksky_key +'/'+latitude+ ','+ longitude)
 .then(function (response) {
   
  temp = response.data.currently.temperature;
  feelsLike = response.data.currently.apparentTemperature; 
  humidity = Math.round((response.data.currently.humidity)* 100)/100;
  windSpeed = response.data.currently.windSpeed;
  summary = response.data.hourly.summary;   
  atom = response.data.currently.icon;
  visibility = response.data.currently.visibility;
  timeZone = response.data.timezone;
  tempHigh = response.data.daily.data[0].temperatureHigh;
  tempLow = response.data.daily.data[0].temperatureLow;

  currentTime = new Date();
  dateTime = currentTime.toLocaleString('en-US', {timeZone: timeZone}); 

  for(hours = 0; hours < 12; hours++ ){
    hours_temp.push(response.data.hourly.data[hours].temperature);
    hours_atom.push(response.data.hourly.data[hours].icon);
  }
   Date.prototype.addHours = function(hours){
    dateHours.setHours(dateHours.getHours() + hours);
    dtzHours = dateHours.toLocaleTimeString('en-US', {timeZone: timeZone,   hour: 'numeric', hour12: true });
    return dtzHours;
  }   
    for(var i=0; i<12; i++){
      dateHours = new Date();
      hoursData.push(dateHours.addHours(i));    
    }
    dataHourly = [];
    for(var i = 0; i < hoursData.length; i++){
      if( hours_atom[i] === "clear-day") { imgURLhourly.push('/imgaes/sunny.png'); }
      else if(hours_atom[i] === "partly-cloudy-day"){ imgURLhourly.push('/imgaes/partly_cloudy.png'); } 
      else if(hours_atom[i] === "partly-cloudy-night"){ imgURLhourly.push('/imgaes/partly_cloudy_night.png'); } 
      else if(hours_atom[i] === "cloudy") { imgURLhourly.push('/imgaes/cloud.png'); }
      else if(hours_atom[i] === "rain") { imgURLhourly.push('/imgaes/rain.png'); }
      else if(hours_atom[i] === "snow") { imgURLhourly.push('/imgaes/snowflake.png'); }
      else if(hours_atom[i] === "clear-night") { imgURLhourly.push('/imgaes/moon.png'); }
      else if(hours_atom[i] === "wind") { imgURLhourly.push('/imgaes/wind.png'); }
      else { imgURLhourly.push('');}
      dataHourly.push({
        hours: hoursData[i],
        hours_atom: hours_atom[i],
        imgURLhourly: imgURLhourly[i],
        htemp: hours_temp[i]
    });
    }     
  for(day = 1; day <= 7; day++){
    day_atom.push(response.data.daily.data[day].icon);
    day_high.push(response.data.daily.data[day].temperatureHigh);
    day_low.push(response.data.daily.data[day].temperatureLow);
  }
  Date.prototype.addDays = function(days){
  date.setDate(date.getDate() + days);
  dtzDays = date.toLocaleDateString('en-US', {timeZone: timeZone});
  return dtzDays;
  }
  for(var i=1; i<=7; i++){
    date = new Date();
    daysData.push(date.addDays(i));    
  }
  dataWeekly = [];

  for(var i = 0; i < daysData.length; i++){
  if( day_atom[i] === "clear-day") { imgURLweekly.push('/imgaes/sunny.png'); }
  else if(day_atom[i] === "partly-cloudy-day"){ imgURLweekly.push('/imgaes/partly_cloudy.png'); } 
  else if(day_atom[i] === "partly-cloudy-night"){ imgURLweekly.push('/imgaes/partly_cloudy_night.png'); } 
  else if( day_atom[i] === "cloudy") { imgURLweekly.push('/imgaes/cloud.png'); }
  else if( day_atom[i] === "rain") { imgURLweekly.push('/imgaes/rain.png'); }
  else if( day_atom[i] === "snow") { imgURLweekly.push('/imgaes/snowflake.png'); }
  else if( day_atom[i] === "clear-night") { imgURLweekly.push('/imgaes/moon.png'); }
  else if( day_atom[i] === "wind") { imgURLweekly.push('/imgaes/wind.png'); }
  else { imgURLweekly.push('');}
  dataWeekly.push({
    days: daysData[i],
    day_atom: day_atom[i],
    imgURLweekly: imgURLweekly[i],
    day_high: day_high[i],
    day_low: day_low[i]
  });
  }  

 if( atom === "clear-day") { imgURL = '/imgaes/sunny.png'; }
 else if(atom === "partly-cloudy-day"){ imgURL = '/imgaes/partly_cloudy.png'; } 
 else if(atom === "partly-cloudy-night"){ imgURL = '/imgaes/partly_cloudy_night.png'; } 
 else if( atom === "cloudy") { imgURL = '/imgaes/cloud.png'; }
 else if( atom === "rain") { imgURL = '/imgaes/rain.png'; }
 else if( atom === "snow") { imgURL = '/imgaes/snowflake.png'; }
 else if( atom === "clear-night") { imgURL = '/imgaes/moon.png'; }
 else if( atom === "wind") { imgURL = '/imgaes/wind.png'; }
 else { imgURL = '';}  
 })
 .catch(function (error) {
   console.log(error);
 });
}
  app.get('/', (req, res)=>{
  res.render('home.hbs',{
    pageTitle:'Weather Test App',
    latitude: latitude,
    longitude: longitude,  
    summary: summary,
    temp: temp,
    atom: atom,
    imgURL: imgURL,
    feelsLike: feelsLike,
    humidity: humidity,
    windSpeed: windSpeed,
    visibility: visibility,
    dateTime: dateTime,
    tempHigh: tempHigh,
    tempLow: tempLow,
    dataHourly: dataHourly
  });
});

app.get('/weekly',(req,res) => {
  res.render('weekly.hbs',{
    pageTitle: 'Weekly Weather Forecast', 
    dataWeekly: dataWeekly    
  });
});

app.listen(3000, ()=>{
  console.log('Server is up on port 3000');
});

