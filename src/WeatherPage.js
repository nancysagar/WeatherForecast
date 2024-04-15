import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherPage.css';

function WeatherPage() {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState('');

  useEffect(() => {
    // Retrieve cityName from local storage
    const storedCityName = localStorage.getItem('selectedCity');
    if (storedCityName) {
      setCityName(storedCityName);
    }
  }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const cityName1='Shīnḏanḏ'
        const apiKey = 'c5ff21d89c1c4e39378969a990052fa2'; // Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`);
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    if (cityName) {
      fetchWeatherData();
    }
  }, [cityName]);

  if (!weatherData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="weather-container">
      <h2 className="city-name">Weather for {cityName}</h2>
      <p className="temperature">Temperature: {weatherData.main.temp} °C</p>
      <p className="description">Description: {weatherData.weather[0].description}</p>
      <p className="humidity">Humidity: {weatherData.main.humidity}%</p>
      <p className="wind-speed">Wind Speed: {weatherData.wind.speed} m/s</p>
      <p className="pressure">Pressure: {weatherData.main.pressure} hPa</p>
    </div>
    
  );
}

export default WeatherPage;
