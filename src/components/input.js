import React, { useState } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import '../styles/inputPage.css';

// require('dotenv').config();


function InputPage({ onPageChange }) {
  const [cityName, setCityName] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (value) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/find?q=${encodeURIComponent(value)}&type=like&sort=population&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      );
      const cities = response.data.list;
      const suggestions = cities.map((city) => city.name);
      setSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
    }
  };

  const handleSuggestionsFetchRequested = ({ value }) => {
    fetchSuggestions(value);
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const handleSuggestionSelected = (_, { suggestion }) => {
    setCityName(suggestion);
  };

  const handleChange = (_, { newValue }) => {
    setCityName(newValue);
  };

  const getSuggestionValue = (suggestion) => suggestion;
  const renderSuggestion = (suggestion) => <div>{suggestion}</div>;

  const handleNextPage = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      );
      const weatherData = response.data;
      onPageChange('output', weatherData.name);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Handle error state or display an error message
      if (error.response && error.response.data && error.response.data.message) {
        alert('Please enter a valid city name');
      } else {
        alert('Unable to fetch weather data at this time');
      }
    }
  };

  const handleLocationClick = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
          );
          const weatherData = response.data;
          onPageChange('output', weatherData.name);
        } catch (error) {
          console.error('Error fetching weather data:', error);
          alert('Unable to fetch weather data at this time');
        }
      }, (error) => {
        if (error.code === 1) {
          alert('You denied access to your location. To enable location access, please go to your browser settings and allow location access for this website.');
        } else {
          console.error('Error getting location:', error);
        }
      });
    } else {
      alert('Browser does not support geolocation');
    }
  };

  const inputProps = {
    placeholder: 'Enter city name',
    value: cityName,
    onChange: handleChange,
  };

  return (
    <div className="input-page ">
      <div className="wrapper drop-shadow-2xl ">
        <header>
          <i className="bx bx-left-arrow-alt"></i>Weather App
        </header>
        <section className="input-part">
          <p className="info-txt"></p>
          <div className="content cursor-pointer">
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
              onSuggestionsClearRequested={handleSuggestionsClearRequested}
              onSuggestionSelected={handleSuggestionSelected}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              shouldRenderSuggestions={() => true} // Always render suggestions
            />
            <button className="mt-4" onClick={handleNextPage}>
              Get Weather
            </button>
            <div className="separator"></div>
            <button onClick={handleLocationClick}>Get Device Location</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default InputPage;