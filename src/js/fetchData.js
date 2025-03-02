let personalApiKey = import.meta.env.VITE_API_KEY


// get the geoCoding of the target place by city or country name 
async function getGeocoding(targePlace) {
    document.querySelector(".loading").classList.add("active")
    try {
        let response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${targePlace}&limit=5&appid=${personalApiKey}`);
        if (!response.ok) {
            throw new Error(`HTTP error 1! status: ${response.status}`);
        }
        let Geocoding = await response.json();
        if (Geocoding.length === 0) {
            document.querySelector(".search-bar .error").innerHTML = "* the country, city is not valid ..."
        }
        return Geocoding;
    } catch (error) {
        throw new Error(`the error 1-2 : ${error}`);
    } finally {
        document.querySelector(".loading").classList.remove("active")
    }

}

// get The current weather of the current day
async function currentWeatherData(lat, lon, lang) {
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=${lang}&appid=${personalApiKey}`);
        if (!response.ok) {
            throw new Error(`HTTP error 2! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`the error 2-2 : ${error}`);
    }
}

// get the week weather
async function getWeekWeatherdata(lat, lon, lang) {
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat.toFixed(2)}&lon=${lon.toFixed(2)}&units=metric&lang=${lang}&appid=${personalApiKey}`);
        if (!response.ok) {
            throw new Error(`HTTP error 3! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`the error 3-2 : ${error}`);
    }
}

// get the translation from en.json or ar.json file and return it 
async function getTranslateLang(lang) {
    document.querySelector(".full-loading").classList.add("active")
    setTimeout(() => {
        document.querySelector(".full-loading").classList.remove("active")
    }, 1000);
    try {
        let response = await fetch(`/../public/translation/${lang}.json`)
        if (!response.ok) {
            throw new Error(`HTTP error 3! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`the error 4-2 : ${error}`)
    }
}

export { getGeocoding, currentWeatherData, getWeekWeatherdata, getTranslateLang }
