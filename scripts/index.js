import * as api from "./api.js";

async function formSubmit(event) {
    event.preventDefault();

    var zip = event.currentTarget.querySelector("#zip").value;
    if (zip.length !== 5) {
        alert(`you have entered an incompatible zip code: ${zip}`);
    }
    else {
        var location = await api.getCoords(zip);
        var weather = await api.getWeather(location);
        showData(weather, location);
    }
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