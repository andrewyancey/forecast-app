import * as api from "./api.js";

// used to decide which values to pull from the API, and which ID they are mapped to
const currentWeatherOptions = {
    temperature_2m: "temp",
    relative_humidity_2m: "humidity",
    precipitation: "precipitation",
    surface_pressure: "pressure"
}

async function formSubmit(event) {
    event.preventDefault();

    var zip = event.currentTarget.querySelector("#zip").value;
    if (zip.length !== 5) {
        alert(`you have entered an incompatible zip code: ${zip}`);
    }
    else {
        var location = await api.getCoords(zip);
        var weather = await api.getWeather(location, currentWeatherOptions);
        showData(weather, location);
    }
}

function showData(weather, location) {
    document.querySelector(".content-area").style.display = "flex";
    fillData(weather);
    fillData(location);
}

function fillData(data) {
    Object.entries(data).forEach(([key, value]) => {
        const el = document.getElementById(key);
        if (el) el.textContent = value;
    })
}

function addHandlers() {
    document.getElementById("input-form").addEventListener("submit", formSubmit);
}

addHandlers();