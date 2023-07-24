function showDate() {
  let currentDate = document.querySelector("#current-date");
  let now = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  let hours = now.getHours();
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let date = now.getDate();
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[now.getMonth()];
  currentDate.innerHTML = `${day} ${hours}:${minutes}, ${date} ${month}`;
}
showDate();

function displayForecast() {
  let forecastElement = document.querySelector("#forecast-container");
  let days = ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  let forecastHTML = "";
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
    <div class="forecast-item row">
            <div class="forecast-date col">
              <span class="forecast-day">${day}</span>
              <br />
              12/07
            </div>
            <div class="col">
              <img id="forecast-weather-icon" src="icons/01d.svg" alt="" />
            </div>
            <div class="col">
              <span id="forecast-max-temp" class="forecast-value">24</span>°
              <br />
              <span class="forecast-label">max</span>
            </div>
            <div class="col">
              <span id="forecast-min-temp" class="forecast-value">12</span>°
              <br />
              <span class="forecast-label">min</span>
            </div>
            <div class="col">
              <span class="forecast-value" id="forecast-wind">15</span>
              m/s
              <br />
              <span class="forecast-label">wind</span>
            </div>
            <div class="col">
              <span class="forecast-value" id="forecast-humidity">12</span>
              %
              <br />
              <span class="forecast-label">humidity</span>
            </div>
          </div>
          `;
  });

  forecastElement.innerHTML = forecastHTML;
}

let apiKey = "1266ad07b66517497b1acf79ea5a6a64";
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);
let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", askPosition);

function search(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&exclude=minutely,hourly&appid=${apiKey}`;
  axios.get(apiUrl).then(showTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}
search("Tiraspol");

function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&exclude=hourly,minutely`;
  axios.get(apiUrl).then(showTemperature);
}

function askPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}
function showTemperature(response) {
  let tempElement = document.querySelector("#current-temperature");
  celsiusTemp = response.data.main.temp;
  tempElement.innerHTML = Math.round(celsiusTemp);
  let maxTempElement = document.querySelector("#current-max-temp");
  currentCelsiusMaxTemp = response.data.main.temp_max;
  maxTempElement.innerHTML = Math.round(currentCelsiusMaxTemp);
  let minTempElement = document.querySelector("#current-min-temp");
  currentCelsiusMinTemp = response.data.main.temp_min;
  minTempElement.innerHTML = Math.round(currentCelsiusMinTemp);
  let humidityElement = document.querySelector("#current-humidity");
  let humidity = response.data.main.humidity;
  humidityElement.innerHTML = humidity;
  let windSpeedElement = document.querySelector("#current-wind-speed");
  let windSpeed = response.data.wind.speed;
  windSpeedElement.innerHTML = windSpeed;
  let descriptionElement = document.querySelector("#description");
  let description = response.data.weather[0].description;
  descriptionElement.innerHTML = description;
  if (showPosition) {
    let cityName = document.querySelector("h1");
    let currentCity = response.data.name;
    cityName.innerHTML = currentCity;
  }

  let iconElement = document.querySelector("#weather-icon");
  iconElement.setAttribute("src", `icons/${response.data.weather[0].icon}.svg`);
  iconElement.setAttribute("alt", response.data.weather[0].description);
  fahrenheit.classList.remove("clicked");
  celsius.classList.add("clicked");
}
function changeToFahrenheit(event) {
  event.preventDefault();
  fahrenheit.classList.add("clicked");
  celsius.classList.remove("clicked");
  let tempElement = document.querySelector("#current-temperature");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  tempElement.innerHTML = Math.round(fahrenheitTemp);
  let currentMaxTempElement = document.querySelector("#current-max-temp");
  let currentMaxTemp = (currentCelsiusMaxTemp * 9) / 5 + 32;
  currentMaxTempElement.innerHTML = Math.round(currentMaxTemp);
  let currentMinTempElement = document.querySelector("#current-min-temp");
  let currentMinTemp = (currentCelsiusMinTemp * 9) / 5 + 32;
  currentMinTempElement.innerHTML = Math.round(currentMinTemp);
}
function changeToCelsius(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#current-temperature");
  fahrenheit.classList.remove("clicked");
  celsius.classList.add("clicked");
  tempElement.innerHTML = Math.round(celsiusTemp);
  let currentMaxTempElement = document.querySelector("#current-max-temp");
  currentMaxTempElement.innerHTML = Math.round(currentCelsiusMaxTemp);
  let currentMinTempElement = document.querySelector("#current-min-temp");
  currentMinTempElement.innerHTML = Math.round(currentCelsiusMinTemp);
}
let celsiusTemp = null;
let currentCelsiusMaxTemp = null;
let currentCelsiusMinTemp = null;
let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", changeToCelsius);
let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", changeToFahrenheit);
displayForecast();
