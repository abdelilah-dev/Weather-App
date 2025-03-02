import { getGeocoding, currentWeatherData, getWeekWeatherdata, getTranslateLang } from "./fetchData.js";


// let date = new Date("2025-03-02 15:00:00");
// console.log(date);
// console.log(date.getDay());
// console.log(date.toLocaleDateString(`en`, { weekday: 'long' }))

// let mymap = new Map([
//     ["1", { one: 1 }],
//     ["1", { one: 1 }],
//     ["1", { one: 1 }],
// ])
// console.log(mymap);
let input = document.querySelector(".input");
let SearchBtn = document.querySelector(".search-btn");
let changLangBtns = document.querySelector(".change-lang");
let weatherData = {};
let currentLang = window.localStorage.lang || "en";


window.onload = async function () {
    document.querySelector(".full-loading").classList.remove("active")
    loadTranslate(currentLang);
    toggleLanguageClass(currentLang);
    if (window.localStorage.weatherData) {
        displayCurrentWeather(JSON.parse(window.localStorage.weatherData).currentWeather, await getTranslateLang(currentLang));
    } else {
        console.log("no data to show")
    }
}

// if search btn is pressed
SearchBtn.onclick = async function (e) {
    e.preventDefault();
    if (input.value !== "") {
        document.querySelector(".search-bar .error").innerHTML = "";
        try {
            // wait to fetch data from getgeocoding and return it
            let geocoding = await getGeocoding(input.value);
            if (geocoding.length !== 0) {
                // wait to fetch data from two functions and return it
                [weatherData.currentWeather, weatherData.weekWeather] = await Promise.all([
                    currentWeatherData(geocoding[0].lat, geocoding[0].lon, currentLang),
                    getWeekWeatherdata(geocoding[0].lat, geocoding[0].lon, currentLang)
                ]);
                let translate = await getTranslateLang(currentLang);
                window.localStorage.setItem("weatherData", JSON.stringify(weatherData));
                displayCurrentWeather(weatherData.currentWeather, translate);
            }
        } catch (error) {
            document.querySelector(".search-bar .error").innerHTML = "* There was an error fetching the weather data.";
            throw new Error(`The Error : ${error}`)
        }
    }
}

// if select another languge
changLangBtns.addEventListener("click", async (e) => {
    let selectLang = e.target.getAttribute("translate-lang");
    window.localStorage.setItem("lang", selectLang);
    currentLang = selectLang;
    displayCurrentWeather(JSON.parse(window.localStorage.weatherData).currentWeather, await getTranslateLang(currentLang))
    toggleLanguageClass(selectLang);
    loadTranslate(selectLang);
})

// display the current weather of today
function displayCurrentWeather(targetPlace, translations) {
    let weatherDetails = document.querySelector(".current-weather");
    let TodayDetails = document.querySelector(".day-detail");
    weatherDetails.innerHTML = `
        <img class="img" src="https://openweathermap.org/img/wn/${targetPlace.weather[0].icon}@2x.png" alt="">
        <div class="temperature">
            <span>${Math.floor(targetPlace.main.feels_like)}<sup>°C</sup></span>
        </div>
        <div class="current-preview">
            <div class="rain">${translations.rain}: %</div>
            <div class="humidity">${translations.humidity}: ${targetPlace.main.humidity}%</div>
            <div class="wind">${translations.wind}: ${Math.floor(targetPlace.wind.speed * 3.6)}km/h</div>
        </div>
    `;
    let thisDay = new Date();
    let dayName = thisDay.toLocaleDateString(`${translations.shortLang}`, { weekday: 'long' });
    TodayDetails.innerHTML = `
        <div class="title">${translations.weather}</div>
        <div class="current-day">${dayName}</div>
        <div class="weather-desc">${targetPlace.weather[0].description}</div>
    ` ;
}

// load translate languge from fecthdata file 
async function loadTranslate(lang) {
    let translate = await getTranslateLang(lang);
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
