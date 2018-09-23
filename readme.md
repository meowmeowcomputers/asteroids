Run npm install to install the packages in package.json.  
Launch asteroids.js using node.  
Send a POST request to http://localhost:3050/  
Use this format for the POST body:  
{  
	"dateStart": "2019-01-01",  
	"dateEnd": "2019-01-07",  
	"within": {  
    	"value": 10000000,  
    	"units": "miles"  
	}  
}  
If there are asteroids in range of your specified distance, you'll get an array of them.  
If there are no asteroids in range of your specifed distance, youll get an object containing an empty array:  
{  
  "asteroids":  
}  
If not formatted correctly, app will send a message "Sorry, there was an error".  
