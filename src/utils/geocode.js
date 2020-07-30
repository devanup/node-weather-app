const request = require("request");

// getting the lat and long to get the weather
const geocode = (address, callback) => {
  const url =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    encodeURIComponent(address) +
    ".json?access_token=pk.eyJ1IjoiZGV2YW51cCIsImEiOiJja2JxbmtpMTEwazgwMnBrYWhxMWR4bXZ5In0.MsO6GWrEPYK7fP5zyCK25Q&limit=1"; // if we don't use the encodeURIComponent the program will crash if used searches for addresses with special characters, it makes the url safe

  // request({ url: url, json: true }, (error, response) => { // using short hand & destructuring
  request({ url, json: true }, (error, { body }) => {
    //options like url and stuff, function to run once we have the response of some sort

    if (error) {
      callback("Unable to connect to location services", undefined); // data = undefined
    } else if (body.features.length === 0) {
      callback(
        "Unable to find location, please try another search term.",
        undefined
      );
    } else {
      // this is what will be returned from geocode function
      callback(undefined, {
        // error = undefined
        latitude: body.features[0].center[1],
        longitude: body.features[0].center[0],
        location: body.features[0].place_name,
      });
    }
  });
};

module.exports = geocode;
/**
 * create a request constant variable to require request
 * create a function to get the lat and long. the function takes in two arguments address and callback function
 * inside the function created:- {
 * create a variable that stores the api URL which has address concatenated
 * setup the request method. the request method takes in two arguments - url, json & error, body
 * inside the request method created:-{
 * check for errors. If any errors return the error message and set the data value to undefined. If  no errors set the error value to undefined and return the data
 * }
 * }
 * export modules
 */
