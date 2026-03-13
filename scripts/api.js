

export async function getWeather(location, currentWeatherOptions) {
    if(!currentWeatherOptions) throw new Error("getWeather requires currentWeatherOptions");
    
    const url = buildWeatherURL(location, currentWeatherOptions);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("failed to fetch weather");
    }

    const data = await response.json();
    const current = data.current;
    const weather = {};

    Object.entries(currentWeatherOptions).forEach(([apiField, appField]) => {
        weather[appField] = current[apiField];
    });

    return weather;
}

function buildWeatherURL(location, currentWeatherOptions) {
    const url = new URL("https://api.open-meteo.com/v1/forecast");

    url.search = new URLSearchParams({
        latitude: location.lat,
        longitude: location.long,
        current: Object.keys(currentWeatherOptions).join(","),
        temperature_unit: "fahrenheit",
        wind_speed_unit: "kn",
        precipitation_unit: "inch"
    });

    return url;
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

