async function formSubmit(event) {
    event.preventDefault();

    var zip = event.currentTarget.querySelector("#zip").value;
    if (zip.length !== 5) {
        alert(`you have entered an incompatible zip code: ${zip}`);
    }
    else {
        var location = await getCoords(zip);
        var weather = await getWeather(location);
        showData(weather);
    }

}

async function getWeather(location) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.long}&current=temperature_2m&temperature_unit=fahrenheit`

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("failed to fetch weather");
    }

    const data = await response.json();
    const current = data.current;

    return {
        temp: current.temperature_2m
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
        name: location.name,
    }
}

function showData(weather)
{
    document.querySelector("#temp").textContent = weather.temp;
}

function addHandlers() {
    document.getElementById("input-form").addEventListener("submit", formSubmit);
}

addHandlers();