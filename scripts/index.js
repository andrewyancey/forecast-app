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