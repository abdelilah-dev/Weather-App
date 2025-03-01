import { getGeocoding, currentWeatherData, getWeekWeatherdata } from "./fetchData.js";

let input = document.querySelector(".input");
let SearchBtn = document.querySelector(".search-btn");

window.onload = function () {
    document.querySelector(".loading").classList.remove("active")
    if (window.localStorage.currentWeather) {
        console.log(JSON.parse(window.localStorage.currentWeather));
        displayCurrentWeather(JSON.parse(window.localStorage.currentWeather))
    } else {
        // give the data from location automatique
        console.log("give data from location automatique")
    }
}

SearchBtn.onclick = async function (e) {
    e.preventDefault();
    if (input.value !== "") {
        document.querySelector(".search-bar .error").innerHTML = "";
        let data = await getGeocoding(input.value);
        if (data.length !== 0) {
            let currentPlace = await currentWeatherData(data[0].lat, data[0].lon);
            displayCurrentWeather(currentPlace);
        }
    }
}

function displayCurrentWeather(targetPlace) {
    let weatherDetails = document.querySelector(".current-weather");
    let TodayDetails = document.querySelector(".day-detail");
    let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    weatherDetails.innerHTML = `
        <img class="img" src="https://openweathermap.org/img/wn/${targetPlace.weather[0].icon}@2x.png" alt="">
        <div class="temperature">
            <span>${targetPlace.main.feels_like}<sup>°C</sup></span>
        </div>
        <div class="current-preview">
            <div class="rain">rain: %</div>
            <div class="humidity">humidity: ${targetPlace.main.humidity}%</div>
            <div class="wind">wind: ${Math.floor(targetPlace.wind.speed * 3.6)}km/h</div>
        </div>
    `
    let thisDay = new Date();
    TodayDetails.innerHTML = `
        <div class="title">Weather</div>
        <div class="current-day">${daysOfWeek[thisDay.getDay()]}</div>
        <div class="weather-desc">${targetPlace.weather[0].description}</div>
    `
}
