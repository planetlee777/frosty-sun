// state
let currCity = "London";
let units = "metric";

// Selectors
let city = document.querySelector(".weather__city");
let datetime = document.querySelector(".weather__datetime");
let weather__forecast = document.querySelector(".weather__forecast");
let weather__temperature = document.querySelector(".weather__temperature");
let weather__icon = document.querySelector(".weather__icon");
let weather__minmax = document.querySelector(".weather__minmax");
let weather__realfeel = document.querySelector(".weather__realfeel");
let weather__humidity = document.querySelector(".weather__humidity");
let weather__wind = document.querySelector(".weather__wind");
let weather__pressure = document.querySelector(".weather__pressure");

// search
document.querySelector(".weather__search").addEventListener("submit", (e) => {
  let search = document.querySelector(".weather__searchform");
  // prevent default action
  e.preventDefault();
  // change current city
  currCity = search.value;
  // get weather forecast
  getWeather();
  // clear form
  search.value = "";
});

// units
document
  .querySelector(".weather_unit_celsius")
  .addEventListener("click", () => {
    if (units !== "metric") {
      // change to metric
      units = "metric";
      // get weather forecast
      getWeather();
    }
  });

document
  .querySelector(".weather_unit_farenheit")
  .addEventListener("click", () => {
    if (units !== "imperial") {
      // change to imperial
      units = "imperial";
      // get weather forecast
      getWeather();
    }
  });

function convertTimeStamp(timestamp, timezone) {
  const convertTimezone = timezone / 3600; // convert seconds to hours

  const date = new Date(timestamp * 1000);

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: `Etc/GMT${convertTimezone >= 0 ? "-" : "+"}${Math.abs(convertTimezone)}`,
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
}

// convert country code to name
function convertCountryCode(country) {
  let regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  return regionNames.of(country);
}

function getWeather() {
  const API_KEY = "64f60853740a1ee3ba20d0fb595c97d5";

  // Fetch current weather data
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}`,
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`;
      datetime.innerHTML = convertTimeStamp(data.dt, data.timezone);
      weather__forecast.innerHTML = `<p>${data.weather[0].main}`;
      weather__temperature.innerHTML = `${data.main.temp.toFixed()}&#176`;

      // Set the current weather icon using the URL provided by OpenWeather
      weather__icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" />`;

      weather__minmax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&#176</p><p>Max: ${data.main.temp_max.toFixed()}&#176</p>`;
      weather__realfeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`;
      weather__humidity.innerHTML = `${data.main.humidity}%`;
      weather__wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph" : "m/s"}`;
      weather__pressure.innerHTML = `${data.main.pressure} hPa`;

      // Fetch forecast data for next five days
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${currCity}&appid=${API_KEY}&units=${units}`,
      )
        .then((res) => res.json())
        .then((forecastData) => {
          const forecastCards = document.querySelectorAll(".card");

          // Iterate through forecast cards and update each with forecast data
          forecastCards.forEach((card, index) => {
            const forecast = forecastData.list[index];
            const forecastIcon = forecast.weather[0].icon;
            const forecastTemp = forecast.main.temp.toFixed();
            const dayOfWeek = getNextFiveDays()[index];

            card.querySelector(".dayofweek").textContent = dayOfWeek;
            card.querySelector(".forecast__icon img").src =
              `http://openweathermap.org/img/wn/${forecastIcon}.png`;
            card.querySelector(".forecast__temp").textContent =
              `${forecastTemp}°`;
          });
        });
    });
}

// Call the function to update forecast days and temperatures on page load
window.addEventListener("load", getWeather);

// Function to update forecast cards with next five days and temperatures
function updateForecastDaysAndTemps(temps) {
  const forecastDays = getNextFiveDays();
  const dayElements = document.querySelectorAll(".dayofweek");
  const tempElements = document.querySelectorAll(".forecast__temp");

  dayElements.forEach((element, index) => {
    element.textContent = forecastDays[index];
    tempElements[index].textContent = `${temps[index]}°`; // Assuming temps is an array of temperatures
  });
}

// Call the function to update forecast days and temperatures on page load
window.addEventListener("load", getWeather);

//test
// Function to get the next five days of the week
function getNextFiveDays() {
  const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  const today = new Date().getDay(); // Get current day index
  const nextFiveDays = [];

  for (let i = 1; i <= 5; i++) {
    const nextDayIndex = (today + i) % 7; // Get index of next day, ensuring it wraps around
    nextFiveDays.push(daysOfWeek[nextDayIndex]);
  }

  return nextFiveDays;
}

// Function to update forecast cards with next five days
function updateForecastDays() {
  const forecastDays = getNextFiveDays();
  const dayElements = document.querySelectorAll(".dayofweek");

  dayElements.forEach((element, index) => {
    element.textContent = forecastDays[index];
  });
}

// Call the function to update forecast days on page load
window.addEventListener("load", updateForecastDays);
// test

window.addEventListener("load", getWeather);
