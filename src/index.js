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
search("Madrid");

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
  let temperature = Math.round(response.data.main.temp);
  tempElement.innerHTML = temperature;
  let maxTempElement = document.querySelector("#current-max-temp");
  let maxTemp = Math.round(response.data.main.temp_max);
  maxTempElement.innerHTML = maxTemp;
  let minTempElement = document.querySelector("#current-min-temp");
  let minTemp = Math.round(response.data.main.temp_min);
  minTempElement.innerHTML = minTemp;
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
}
