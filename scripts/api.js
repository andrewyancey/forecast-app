const WMO_WEATHER_CODES = {
    0: "Clear sky",

    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",

    45: "Fog",
    48: "Depositing rime fog",

    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",

    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",

    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",

    66: "Light freezing rain",
    67: "Heavy freezing rain",

    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",

    77: "Snow grains",

    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",

    85: "Slight snow showers",
    86: "Heavy snow showers",

    95: "Thunderstorm",

    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
};

export async function getWeather(location, currentWeatherOptions, dailyWeatherOptions) {
    if (!currentWeatherOptions) throw new Error("getWeather requires currentWeatherOptions");

    const url = buildWeatherURL(location, currentWeatherOptions, dailyWeatherOptions);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("failed to fetch weather");
    }

    const data = await response.json();
    const current = mapCurrentToOptions(data.current, currentWeatherOptions);
    const daily = convertDailytoDays(data.daily, dailyWeatherOptions);
    return { current, daily };
}

function mapCurrentToOptions(current, currentWeatherOptions) {
    const weather = {};

    Object.entries(currentWeatherOptions).forEach(([apiField, appField]) => {
        let value = current[apiField];

        if (apiField === "weather_code") {
            weather["weather-text"] = convertWeatherCode(value);
        }

        weather[appField] = value;
    });

    return weather;
}

function convertDailytoDays(daily, dailyWeatherOptions) {
    if(daily?.time === undefined) throw new Error("weather response is missing daily.time");
    
    let days = daily.time.map((date, index) => {
        const day = { date: date };

        Object.entries(dailyWeatherOptions).forEach(([apiField, appField]) => {
            let value = daily[apiField][index];

            if (apiField === "weather_code") {
                day["daily-weather-text"] = convertWeatherCode(value);
            }

            day[appField] = value;
        })
        return day;
    })
    
    return days;
}

function buildWeatherURL(location, currentWeatherOptions, dailyWeatherOptions) {
    const url = new URL("https://api.open-meteo.com/v1/forecast");

    url.search = new URLSearchParams({
        latitude: location.lat,
        longitude: location.long,
        current: Object.keys(currentWeatherOptions).join(","),
        daily: Object.keys(dailyWeatherOptions).join(","),
        temperature_unit: "fahrenheit",
        wind_speed_unit: "kn",
        precipitation_unit: "inch"
    });

    return url;
}

function convertWeatherCode(code) {
    const weatherText = WMO_WEATHER_CODES[code];

    if (weatherText === undefined) {
        throw new Error(`convertWeatherCode was passed an unspecified code ${code}`);
    }

    return weatherText;
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

