const request = require("request");

// Challenge: Add new data to forecast
// update forecast string to include new data
// commit changes, push to github and heroku

const forecast = (longitude, latitude, callback) => {
  const url =
    "http://api.weatherstack.com/current?access_key=34b7991d1c4b4dad71c71112f1515710&query= " +
    latitude +
    "," +
    longitude +
    "&units=f"; // added units query by adding &units=f

  // request({ url: url, json: true }, (error, response) => { //using the short hand below & destructuring
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      //low-level error - this is when the error exists but response does not
      callback("Unable to connect to weather services", undefined);
    } else if (body.error) {
      callback(
        "Unable to find location, please try another search term.",
        undefined
      );
    } else {
      // this is what will be returned from forecast function
      callback(
        undefined,
        `${body.current.weather_descriptions[0]}. It is currently ${body.current.temperature} degrees, it feels like ${body.current.feelslike} degrees out. The humidity is ${body.current.humidity}%.`
      );
    }
  });
};

module.exports = forecast;
