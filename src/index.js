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
function formatForecastDate(timestamp) {
  let forecastDate = new Date(timestamp * 1000);
  let day = forecastDate.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let date = forecastDate.getDate();
  if (date < 10) {
    date = `0${date}`;
  }
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
  let month = months[forecastDate.getMonth()];
  if (month < 10) {
    month = `0${month}`;
  }
  return days[day] + "<br/>" + date + " " + month;
}

function displayForecast(response) {
  let forecast = response.data.daily;
  forecast.splice(0, 1);
  let forecastElement = document.querySelector("#forecast-container");
  let forecastHTML = "";
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML += `
    <div class="forecast-item row">
            <div class="forecast-date col">
              <span class="forecast-day">${formatForecastDate(
                forecastDay.dt
              )}</span>
            </div>
            <div class="col">
              <img id="forecast-weather-icon" src="icons/${
                forecastDay.weather[0].icon
              }.svg" alt="${forecastDay.weather[0].description}" />
            </div>
            <div class="col">
              <span class="forecast-value">${Math.round(
                forecastDay.temp.max
              )}</span>°
              <br />
              <span class="forecast-label">max</span>
            </div>
            <div class="col">
              <span class="forecast-value">${Math.round(
                forecastDay.temp.min
              )}</span>°
              <br />
              <span class="forecast-label">min</span>
            </div>
            <div class="col">
              <span class="forecast-value">${Math.round(
                forecastDay.wind_speed
              )}</span>
              m/s
              <br />
              <span class="forecast-label">wind</span>
            </div>
            <div class="col">
              <span class="forecast-value">${forecastDay.humidity}</span>
              %
              <br />
              <span class="forecast-label">humidity</span>
            </div>
          </div>
            `;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}

let apiKey = "1266ad07b66517497b1acf79ea5a6a64";
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);
let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", askPosition);

function search(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
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
function getForecast(coordinates) {
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric`;
  axios.get(apiURL).then(displayForecast);
}
function changeCurrentIcon(icon, description) {
  let iconElement = document.querySelector("#weather-icon");
  iconElement.setAttribute("src", `icons/${icon}.svg`);
  iconElement.setAttribute("alt", description);
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
  changeCurrentIcon(
    response.data.weather[0].icon,
    response.data.weather[0].description
  );
  getForecast(response.data.coord);
}

displayForecast();
