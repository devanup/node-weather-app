const express = require("express");
const path = require("path");
const hbs = require("hbs"); // to work with partials
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

// configuring express to serve the directory for the file we'll be serving
console.log(path.join(__dirname)); // dirname points to the source directory but in our case we need it to point to the public directory
console.log(path.join(__dirname, "../public")); // points to the web server folder

// variable to store our express application
const app = express();
const port = process.env.PORT || 3000; //extracted the value heroku provides, if port not provided use the default fallback value of 3000

// defining paths for express configuration
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views"); // __dirname gives the absolute path to the folder this file is in
const partialsPath = path.join(__dirname, "../templates/partials");

//telling express which template engine we're using / setting up handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath); // pointing express to our custom directory
hbs.registerPartials(partialsPath);

// setting up directory to serve
// here we're using this to customize our server to serve up the folders
//  static takes the path to the folder we want to serve up
app.use(express.static(publicDirectoryPath));

//we're now going to tell our application what to do:
// app.get lets us configure what the server should do when someone tries to get the resource at a specific url
app.get("", (req, res) => {
  // we'll be using render to render one of our views. since we configured node to use hbs view engine so we can render one of the handlebar templates
  res.render("index", {
    heading: "Weather Page",
    pageTitle: "Weather today",
    name: "Anup",
  }); // second argument is an object which contains all of the value we want the view to be able to access
});

app.get("/about", (req, res) => {
  res.render("about", {
    heading: "About Page",
    pageTitle: "About",
    name: "Anup",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    heading: "Help Page",
    pageTitle: "Help",
    message: "So you need help huh?",
    name: "Anup",
  });
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    // making search required
    // run the following only when there is no search term
    return res.send({
      error: "Provide a search term to proceed",
    });
  }
  console.log(req.query); // req.query is how we will be able to access the values passed along with the request
  res.send({ products: [] });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    errorMsg: "Help article not found",
    pageTitle: "Page not found",
    name: "Anup",
  });
});

app.get("/weather", (req, res) => {
  // making address required
  if (!req.query.address) {
    // run the following only when there is no address
    // return to stop the program if there is no search term, that way the app won't have an error
    return res.send({ error: "A valid address is required!" });
  }
  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      // assigning default value
      if (error) {
        return res.send({ error });
      }
      forecast(longitude, latitude, (error, forecastData) => {
        if (error) {
          res.send({ error });
        }
        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

//404 handler below
// this always comes last because it has to do with how express is going to end up matching the incoming request with the correct route handler
// so anything that is not the above mentioned path is considered to be a match, basically any broken link
app.get("*", (req, res) => {
  res.render("404", {
    errorMsg: "The page you're looking for isn't available",
    pageTitle: "Page not found",
    errorCode: 404,
    name: "Anup",
  });
}); // '*' means match anything that hasn't been matched so far
/*
// we can delete this request since we have app.use to redirect to index.html
app.get("", (req, res) => {
  // we process the request using the handler
  res.send("<h1>Today's weather</h1>"); // .send method allows us to send something back to the requester
}); // takes in 2 arguments: route & function - where we describe what we wanna do when someone visits that route. The function gets called with 2 important objects. One is the incoming request to the sever and the other response which contains a bunch of methods that allow us to customize what we're gonna send back to the requester
*/

//we need to start the server up to view the app on the browser
app.listen(port, () => {
  console.log("The server is up on port " + port);
}); // port 3000 is a common local development port. Default ports varies, ex for an http based website it is port 80. It is gonna stay up and running until we stop it
