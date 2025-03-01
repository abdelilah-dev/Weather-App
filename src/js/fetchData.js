let personalApiKey = import.meta.env.VITE_API_KEY

async function getGeocoding(targePlace) {
    document.querySelector(".loading").classList.add("active")
    try {
        let response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${targePlace}&limit=5&appid=${personalApiKey}`);
        if (!response.ok) {
            throw new Error(`HTTP error 1! status: ${response.status}`);
        }
        let data = await response.json();
        if (data.length === 0) {
            document.querySelector(".search-bar .error").innerHTML = "* the country, city is not valid ..."
        } else {
            currentWeatherData(data[0].lat, data[0].lon);
            getWeekWeatherdata(data[0].lat, data[0].lon);
        }
        return data;
    } catch (error) {
        throw new Error(`the error 1-2 : ${error}`);
    } finally {
        document.querySelector(".loading").classList.remove("active")
    }

}

async function currentWeatherData(lat, lon) {
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ar&appid=${personalApiKey}`);
        if (!response.ok) {
            throw new Error(`HTTP error 2! status: ${response.status}`);
        }
        let data = await response.json();
        window.localStorage.setItem("currentWeather", JSON.stringify(data));
        return data;
    } catch (error) {
        throw new Error(`the error 2-2 : ${error}`);
    }
}

async function getWeekWeatherdata(lat, lon) {
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat.toFixed(2)}&lon=${lon.toFixed(2)}&units=metric&lang=ar&appid=${personalApiKey}`);
        if (!response.ok) {
            throw new Error(`HTTP error 3! status: ${response.status}`);
        }
        let data = await response.json();
        window.localStorage.setItem("weekWeather", JSON.stringify(data));
        return data;
    } catch (error) {
        throw new Error(`the error 3-2 : ${error}`);
    }
}

export { getGeocoding, currentWeatherData, getWeekWeatherdata }
