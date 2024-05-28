const API_KEY = '9fbf795a2a2c42789a4183453242805';

async function fetchWeather(location) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&aqi=no`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

function processWeatherData(data) {
    return {
        location: data.location.name,
        temperature: data.current.temp_c,
        temperature_f: data.current.temp_f,
        description: data.current.condition.text,
        icon: data.current.condition.icon
    };
}

document.getElementById('locationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const location = document.getElementById('locationInput').value;
    displayLoading();
    try {
        const weatherData = await fetchWeather(location);
        const processedData = processWeatherData(weatherData);
        displayWeather(processedData);
    } catch (error) {
        displayError(error.message);
    }
});

function displayLoading() {
    const weatherDiv = document.getElementById('weatherInfo');
    weatherDiv.innerHTML = '<p>Loading...</p>';
}

function displayError(message) {
    const weatherDiv = document.getElementById('weatherInfo');
    weatherDiv.innerHTML = `<p>Error: ${message}</p>`;
}

function displayWeather(data) {
    const weatherDiv = document.getElementById('weatherInfo');
    weatherDiv.innerHTML = `
        <h2>${data.location}</h2>
        <p>Temperature: <span id="temperature">${data.temperature}°C</span></p>
        <p>Description: ${data.description}</p>
        <img src="${data.icon}" alt="${data.description}">
        <button id="toggleTemp">Toggle to °F</button>
    `;

    document.getElementById('toggleTemp').addEventListener('click', () => {
        toggleTemperature(data.temperature, data.temperature_f);
    });
}

function toggleTemperature(tempC, tempF) {
    const tempSpan = document.getElementById('temperature');
    const currentUnit = tempSpan.innerText.includes('°C') ? 'C' : 'F';

    if (currentUnit === 'C') {
        tempSpan.innerText = `${tempF}°F`;
        document.getElementById('toggleTemp').innerText = 'Toggle to °C';
    } else {
        tempSpan.innerText = `${tempC}°C`;
        document.getElementById('toggleTemp').innerText = 'Toggle to °F';
    }
}
