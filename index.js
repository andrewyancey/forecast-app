async function formSubmit(event) {
    event.preventDefault();

    var zip = event.currentTarget.querySelector("#zip").value;
    if (zip.length !== 5) {
        alert(`you have entered an incompatible zip code: ${zip}`);
    }
    else {
        var location = await getCoords(zip);
        var weather = await getWeather(location);
        showData(weather, location);
    }

}

async function getWeather(location) {
    const url = buildWeatherURL(location);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("failed to fetch weather");
    }

    const data = await response.json();
    const current = data.current;

    return {
        temp: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        precip: current.precipitation,
        pressure: current.surface_pressure
    }
}

async function getCoords(zip) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${zip}&count=1&countrycode=us&format=json`

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("failed to fetch coordinates");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error(`No location found for ZIP code: ${zip}`);
    }

    const location = data.results[0];

    return {
        lat: location.latitude,
        long: location.longitude,
        city: location.name,
        state: location.admin1
    }
}

function buildWeatherURL(location) {
    const url = new URL("https://api.open-meteo.com/v1/forecast");

    url.search = new URLSearchParams({
        latitude: location.lat,
        longitude: location.long,
        current: "temperature_2m,relative_humidity_2m,precipitation,surface_pressure",
        temperature_unit: "fahrenheit",
        wind_speed_unit: "kn",
        precipitation_unit: "inch"
    });

    return url;
}

function showData(weather, location) {
    document.querySelector(".content-area").style.display = "flex";
    fillWeatherData(weather);
    fillLocationData(location);
}

function fillWeatherData(weather) {
    document.querySelector("#temp").textContent = weather.temp;
    document.querySelector("#humidity").textContent = weather.humidity;
    document.querySelector("#pressure").textContent = weather.pressure;
    document.querySelector("#precipitation").textContent = weather.precip;
}

function fillLocationData(location) {
    document.querySelector("#lat").textContent = location.lat;
    document.querySelector("#long").textContent = location.long;
    document.querySelector("#city").textContent = location.city;
    document.querySelector("#state").textContent = location.state;
}

function addHandlers() {
    document.getElementById("input-form").addEventListener("submit", formSubmit);
}

addHandlers();