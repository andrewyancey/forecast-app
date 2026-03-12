export async function getWeather(location) {
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

export async function getCoords(zip) {
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