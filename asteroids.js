/*jshint esversion: 6 */

const express = require("express");
const parser = require("body-parser");
const app = express();
const axios = require("axios");
const buildUrl = require("build-url");
const moment = require("moment");

app.use( parser.json() );

function findInRange(distance, asteroids){
  // Function that iterates over the list of asteroids and returns
  // the asteroids within the distance specified
  let inRange = {asteroids:[]};
  for (let key of Object.keys(asteroids)) {
      for(let i=0;i<asteroids[key].length;i++){
        let missDistance = parseFloat(asteroids[key][i].close_approach_data[0].miss_distance.miles);
        if(distance>missDistance){
          inRange.asteroids.push(asteroids[key][i]);
        }
      }
  }
  return inRange;
}


function parseURL(json){
  // Function that builds the url based off of the properties provided in the POST call
  let url = buildUrl('https://api.nasa.gov/neo/rest/v1/feed', {
  queryParams: {
    start_date: moment(json.dateStart).format('YYYY-MM-DD'),
    end_date: moment(json.dateEnd).format('YYYY-MM-DD'),
    api_key: 'DEMO_KEY'
    //YYYY-MM-DD
  }

  });
  return url;
}

app.post('/',(req,res,next)=>{
  try {
    let distance = req.body.within.value;
    let urlToNasa = parseURL(req.body);
    axios.get(urlToNasa)
      .then((response)=>{
        let asteroids = response.data.near_earth_objects;
        let inRange = findInRange(distance, asteroids);
        return inRange;
      })
      .then((inRange)=>{
        res.send(inRange);
      })
      .catch((err)=>{
        res.send("Sorry, there was an error.");
      });
  }
  catch (err) {
    res.send("Sorry, there was an error. Please check to make sure the body you sent is in JSON format.");
  }

})

app.listen(3050);
