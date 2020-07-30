// FOR TESTING PURPOSE:
// console.log("Client side JS working!");

// fetch("http://puzzle.mead.io/puzzle").then((response) => {
//   // fetch data from that url and then run the function

//   response.json().then((data) => {
//     //the json data has arrived and has been parsed
//     console.log(data);
//   });
// });

const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const message1 = document.querySelector("#message1");
const message2 = document.querySelector("#message2");
const fail = document.querySelector("#fail");

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const location = search.value;

  if (location === "") {
    console.log("You must enter a valid address!");
    fail.style.display = "block";
    fail.textContent = "You must enter a valid address!";
  }
  message1.textContent = "";
  message2.textContent = "Loading data...";
  fetch(
    "http://localhost:3000/weather?address=" + encodeURIComponent(location)
  ).then((response) => {
    // fetch data from that url and then run the function

    response.json().then((data) => {
      //the json data has arrived and has been parsed
      if (data.error) {
        // console.log(data.error);
        fail.style.display = "block";
        fail.textContent = "Data could not be fetched. Try again.";
      } else {
        // console.log(data.location);
        // console.log(data.forecast);

        message1.textContent = data.location;
        message2.textContent = data.forecast;

        fail.style.display = "none";
      }
    });
  });

  //   console.log(location);
});
/**
 * select elements from html file and store them in variables
 */
