import * as api from "./api.js";

// used to decide which values to pull from the API, and which ID they are mapped to
const currentWeatherOptions = {
    temperature_2m: "temp",
    relative_humidity_2m: "humidity",
    precipitation: "precipitation",
    surface_pressure: "pressure",
    wind_speed_10m: "wind-speed",
    wind_direction_10m: "wind-direction",
    wind_gusts_10m: "wind-gusts",
    weather_code: "weather-code"
};
const dailyWeatherOptions = {
    weather_code: "daily-weather-code",
    temperature_2m_max: "daily-temperature-max",
    temperature_2m_min: "daily-temperature-min",
    precipitation_probability_max: "daily-precipitation-max",
    wind_speed_10m_max: "daily-wind-speed",
    wind_gusts_10m_max: "daily-wind-gusts",
    wind_direction_10m_dominant: "daily-wind-direction"
};

async function formSubmit(event) {
    event.preventDefault();

    const zip = event.currentTarget.querySelector("#zip").value.trim();
    if (!/^\d{5}$/.test(zip)) {
        alert(`you have entered an incompatible zip code: ${zip}`);
        return;
    }

    try {
        const location = await api.getCoords(zip);
        const weather = await api.getWeather(location, currentWeatherOptions, dailyWeatherOptions);
        showData(weather, location);
    }
    catch (error) {
        console.error(error);
        alert("Something went wrong retrieving data. Please contact the developer, and try again later");
    }
}

function iconFromCode(code) {
    // maps WMO weather codes to corresponding svgs
    const weatherCodeIcons = {
        0: "wi-day-sunny.svg",
        1: "wi-day-sunny.svg",
        2: "wi-day-sunny-overcast.svg",
        3: "wi-cloud.svg",
        45: "wi-day-fog.svg",
        48: "wi-day-fog.svg",
        51: "wi-day-showers.svg",
        53: "wi-day-showers.svg",
        55: "wi-day-rain.svg",
        56: "wi-day-showers.svg",
        57: "wi-day-rain.svg",
        61: "wi-day-showers.svg",
        63: "wi-day-rain.svg",
        65: "wi-day-rain.svg",
        66: "wi-day-showers.svg",
        67: "wi-day-rain.svg",
        71: "wi-day-snow.svg",
        73: "wi-day-snow.svg",
        75: "wi-day-snow.svg",
        77: "wi-day-snow.svg",
        80: "wi-day-showers.svg",
        81: "wi-day-rain.svg",
        82: "wi-day-rain.svg",
        85: "wi-day-snow.svg",
        86: "wi-day-snow.svg",
        95: "wi-day-thunderstorm.svg",
        96: "wi-day-thunderstorm.svg",
        99: "wi-day-thunderstorm.svg"
    };
    const icon = weatherCodeIcons[code];
    if (icon === undefined) throw new Error("code not found in weatherCodeIcons");
    return icon;
}

function showData(weather, location) {
    const current = weather.current;
    const daily = weather.daily;

    document.querySelector(".card-container").style.display = "flex";
    fillData(current);
    fillData(location);
    if (current["weather-code"] !== undefined) {
        const iconLocations = "./assets/svg-icons/"
        document.getElementById("weather-icon").src = iconLocations + iconFromCode(current["weather-code"]);
    }
    buildForecast(daily);
}

function buildForecast(daily) {
    const container = document.querySelector(".daily-forecast-container");

    for (let i = 0; i < daily.length; i++) {
        const dayContainer = container.querySelector(`#daily-day${i + 1}`);
        if (!dayContainer) continue;

        Object.entries(daily[i]).forEach(([key, value]) => {
            if (key === "date") {
                const dateContainer = dayContainer.querySelector(".date");
                if (!dateContainer) return;
                dateContainer.textContent = value;
            } else {
                const valueContainer = dayContainer.querySelector("." + key);
                if (!valueContainer) return;
                valueContainer.textContent = value;
            }
        })

        const weatherCode = daily[i]["daily-weather-code"];
        if (weatherCode !== undefined) {
            const iconLocations = "./assets/svg-icons/"
            dayContainer.querySelector(".icon").src = iconLocations + iconFromCode(weatherCode);
        }
    }
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
