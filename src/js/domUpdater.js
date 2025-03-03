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

// Display the week weather 
function displayWeekWeather(weekWeatherData, translations) {
    let weekDetails = document.querySelector(".week-details");
    weekDetails.innerHTML = "";
    weekWeatherData.forEach((value, key) => {
        let div = document.createElement("div");
        div.className = `day-${key} day`;
        div.setAttribute("day-num", key);
        weekDetails.appendChild(div);
        div.innerHTML = createDayNode(value, translations);
    })

}

function createDayNode(targetDayData, translations) {
    let day = new Date(targetDayData.dt_txt);
    let dayName = day.toLocaleDateString(`${translations.shortLang}`, { weekday: 'long' });
    return `
        <div class="d-flex flex-column align-items-center">
            <div class="day-name">${dayName}</div>
            <img src="https://openweathermap.org/img/wn/${targetDayData.weather[0].icon}@2x.png" alt="">
            <div class="hot-degree">${Math.floor(targetDayData.main.feels_like)}</div>
        </div>
    `
}

export { displayCurrentWeather, displayWeekWeather };
