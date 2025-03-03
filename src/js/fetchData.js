let personalApiKey = import.meta.env.VITE_API_KEY
let ip_access_key = import.meta.env.VITE_API_IP_KEY
console.log(ip_access_key);

// get the geoCoding of the target place by city or country name 
async function getGeocoding(targePlace) {
    toggleLoader(true);
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
        toggleLoader(false)
    }

}

// get The current weather of the current day
async function fetchTodayWeather(lat, lon, lang) {
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
async function fetchWeeklyWeather(lat, lon, lang) {
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
async function fetchTranslation(lang) {
    toggleLoader(true);
    setTimeout(() => {
        toggleLoader(false)
    }, 1000);
    try {
        let response = await fetch(`/translation/${lang}.json`)
        if (!response.ok) {
            throw new Error(`HTTP error 4! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`the error 4-2 : ${error}`)
    }
}

async function fetchLocationByIP() {
    try {
        let response = await fetch(`https://ipapi.co/json/?access_key=${ip_access_key}`)
        if (!response.ok) throw new Error(`HTTP ERROR 5! status : ${response.status}`);
        return await response.json();
    } catch (error) {
        throw new Error(`the error 5-2 : ${error}`)
    }
}

function toggleLoader(show) {
    const loader = document.querySelector(".full-loading");
    show ? loader.classList.add("active") : loader.classList.remove("active");
}

export { getGeocoding, fetchTodayWeather, fetchWeeklyWeather, fetchTranslation, fetchLocationByIP }
