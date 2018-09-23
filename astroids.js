const express = require("express");
const parser = require("body-parser");
const app = express();
const axios = require("axios")
const buildUrl = require("build-url")
const moment = require("moment")

app.use( parser.json() );

function findInRange(distance, astroids){
  // console.log(astroids)
  let inRange = {astroids:[]}
  for (let key of Object.keys(astroids)) {
      for(let i=0;i<astroids[key].length;i++){
        let missDistance = parseFloat(astroids[key][i].close_approach_data[0].miss_distance.miles)
        if(distance>missDistance){
          inRange.astroids.push(astroids[key][i])
        }
      }
  }
  return inRange
}


function parseURL(json){
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

app.post('/',(req,res)=>{
  let distance = req.body.within.value
  console.log('Distance: '+distance)
  let urlToNasa = parseURL(req.body)
  axios.get(urlToNasa)
    .then((response)=>{
      let astroids = response.data.near_earth_objects
      let inRange = findInRange(distance, astroids)
      return inRange
    })
    .then((inRange)=>{
      res.send(inRange)
    })
    .catch((err)=>{
      res.send("Sorry, there was an error")
    })
})



app.listen(3050)
