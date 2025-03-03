import { getGeocoding, fetchTodayWeather, fetchWeeklyWeather, fetchTranslation, fetchLocationByIP } from "./fetchData.js";
import { displayCurrentWeather, displayWeekWeather } from "./domUpdater.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
let input = document.querySelector(".input");
let SearchBtn = document.querySelector(".search-btn");
let weatherData = {};
let currentLang = window.localStorage.lang || "en";

window.onload = async function () {
    document.querySelector(".full-loading").classList.remove("active")
    loadTranslate(currentLang);
    toggleLanguageClass(currentLang);
    if (window.localStorage.weatherData) {
        let getOldDayWeather = JSON.parse(window.localStorage.weatherData).currentWeather;
        let getTodayWeather = await fetchTodayWeather(getOldDayWeather.coord.lat, getOldDayWeather.coord.lon, window.localStorage.lang || "en")
        let getThisWeekWeather = await fetchWeeklyWeather(getOldDayWeather.coord.lat, getOldDayWeather.coord.lon, window.localStorage.lang || "en");
        let translate = await fetchTranslation(currentLang);
        updateWeatherUI(getTodayWeather, getThisWeekWeather, translate);
    } else {
        getUserLocation();
    }
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(position);
                const { latitude, longitude } = position.coords;
                getWeatherData("rabat", latitude, longitude);
            },
            (error) => {
                console.warn("Geolocation denied. Trying IP lookup...");
                getLocationByIP(); // fallback to IP
            }
        );
    } else {
        console.warn("Geolocation not supported. Trying IP lookup...");
        getLocationByIP();
    }
}


async function getLocationByIP() {
    try {
        let locationByIp = await fetchLocationByIP()
        getWeatherData(locationByIp.city);
    } catch (error) {
        console.error("IP location error:", error);
        alert("Unable to get your location. Please search manually.");
    }
}

// if search btn is pressed
SearchBtn.onclick = async function (e) {
    e.preventDefault();
    if (input.value !== "") {
        document.querySelector(".search-bar .error").innerHTML = "";
        try {
            getWeatherData(input.value);
        } catch (error) {
            document.querySelector(".search-bar .error").innerHTML = "* There was an error fetching the weather data.";
            throw new Error(`The Error : ${error}`)
        } finally {
            input.value = "";
        }
    }
}

async function getWeatherData(locationName, lat, lon) {
    let geocoding = await getGeocoding(locationName);
    let latitude = lat || geocoding[0].lat;
    let longitude = lon || geocoding[0].lon;
    console.log(latitude);
    console.log(longitude);
    if (geocoding.length !== 0) {
        // wait to fetch data from two functions and return it
        [weatherData.currentWeather, weatherData.weekWeather] = await Promise.all([
            fetchTodayWeather(latitude, longitude, currentLang),
            fetchWeeklyWeather(latitude, longitude, currentLang)
        ]);
        let translate = await fetchTranslation(currentLang);
        window.localStorage.setItem("weatherData", JSON.stringify(weatherData));
        updateWeatherUI(weatherData.currentWeather, weatherData.weekWeather, translate);
    }
}

// if select another languge
document.querySelectorAll(".dropdown-item").forEach((ele) => {
    ele.addEventListener("click", async (e) => {
        e.preventDefault();
        let selectLang = e.target.getAttribute("translate-lang");
        window.localStorage.setItem("lang", selectLang);
        currentLang = selectLang;
        let translate = await fetchTranslation(currentLang);
        let todayWeather = JSON.parse(window.localStorage.weatherData).currentWeather;
        let weeklyWeather = JSON.parse(window.localStorage.weatherData).weekWeather;
        updateWeatherUI(todayWeather, weeklyWeather, translate);
        toggleLanguageClass(selectLang);
        loadTranslate(selectLang);
    })
})

// if preed in any day in week bar in bottom display it in current day 
let weekDetails = document.querySelector(".week-details");
weekDetails.addEventListener("click", async (event) => {
    let parentWithClass = event.target.closest(".day")
    if (parentWithClass) {
        let getWeekWeather = JSON.parse(window.localStorage.weatherData).weekWeather;
        let dayNumber = parentWithClass.getAttribute("day-num");
        let uniqueDays = getUniqueDaysWeather(getWeekWeather)
        let translate = await fetchTranslation(currentLang);
        updateWeatherUI(uniqueDays.get(+dayNumber), getWeekWeather, translate)
    }
});

function updateWeatherUI(currentWeather, weekWeather, translate) {
    displayCurrentWeather(currentWeather, translate);
    displayWeekWeather(getUniqueDaysWeather(weekWeather), translate);
}

function getUniqueDaysWeather(weekWeather) {
    let uniqueDays = new Map();
    weekWeather.list.forEach((obj) => {
        let date = new Date(obj.dt_txt);
        uniqueDays.set(date.getDay() % 7, obj);
    })
    return uniqueDays;
}

// load translate languge from fecthdata file 
async function loadTranslate(lang) {
    let translate = await fetchTranslation(lang);
    applyTranslations(translate);
}
// apply the translation on page
function applyTranslations(translations) {
    input.placeholder = translations.search_placeholder;
    SearchBtn.innerHTML = translations.search_button
    document.querySelector(".slectlang-menu").innerText = translations.lang;
}
// if change the lang change the direction of page
function toggleLanguageClass(selectLang) {
    document.querySelector(".hero-area").classList.toggle("ltr", selectLang === "en");
    document.querySelector(".hero-area").classList.toggle("rtl", selectLang !== "en");
}
