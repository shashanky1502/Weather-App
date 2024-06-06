import React, { useEffect, useState } from "react";
import "../styles/outputPage.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlaceIcon from "@mui/icons-material/Place";
import DeviceThermostatOutlinedIcon from "@mui/icons-material/DeviceThermostatOutlined";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import axios from "axios";
import LoadingAnimation from "./loading";

function OutputPage({ onPageChange, city }) {
  const handlePreviousPage = () => {
    onPageChange("input");
  };

  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    // Fetch weather data when component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
        );
        setWeatherData(response.data);
        fetchBackgroundImage(response.data.weather[0].main);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        // Simulate a 2-second loading time
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
      }
    };

    fetchData();
  }, [city]);

  const fetchBackgroundImage = async (weatherCondition) => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(weatherCondition)}&client_id=${process.env.REACT_APP_UNSPLASH_API_KEY}`
      );
      setBackgroundImage(response.data.urls.regular);
    } catch (error) {
      console.error("Error fetching background image:", error);
    }
  };

  const getWeatherIcon = () => {
    if (weatherData) {
      const weatherCondition = weatherData.weather[0].main.toLowerCase();
      switch (weatherCondition) {
        case "clear":
          return require("../assets/Weather-Icons/clear.svg").default;
        case "clouds":
          return require("../assets/Weather-Icons/cloud.svg").default;
        case "haze":
          return require("../assets/Weather-Icons/haze.svg").default;
        case "rain":
          return require("../assets/Weather-Icons/rain.svg").default;
        case "snow":
          return require("../assets/Weather-Icons/snow.svg").default;
        case "thunderstorm":
          return require("../assets/Weather-Icons/storm.svg").default;
        default:
          return require("../assets/Weather-Icons/clear.svg").default;
      }
    }
    return null;
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div
      className="output-page font-sans ..."
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
      }}
    >
      <div className="main_container white-box drop-shadow-2xl  ">
        <button className="Weather-App-btn " onClick={handlePreviousPage}>
          <ArrowBackIcon /> Weather App
        </button>

        <div className="weather-part flex flex-col">
          <img src={getWeatherIcon()} alt="weather-icon" className="weather-icon" />
          {weatherData && (
            <div className="temp">
              <span className="numb">{Math.floor(weatherData.main.temp - 273.15)}</span>
              <span className="deg">°</span>C
            </div>
          )}
          {weatherData && <div className="weather">{weatherData.weather[0].description}</div>}
          <div className="loaction text-2xl ...">
            <PlaceIcon />
            {weatherData && (
              <span className="city">
                {weatherData.name.length > 20
                  ? `${weatherData.name.slice(0, 17)}...`
                  : weatherData.name},{" "}
                {weatherData.sys.country}
              </span>
            )}
          </div>
          <div className="bottom-details">
            <div className="column feels">
              <i className="scale-150 -translate-y-2 ...">
                <DeviceThermostatOutlinedIcon />{" "}
              </i>
              <div className="details">
                <div className="temp">
                  <span className="numb-2">
                    {weatherData && (
                      <div>{Math.floor(weatherData.main.feels_like - 273.15)}</div>
                    )}
                  </span>
                  <span className="deg">°</span>C
                </div>
                <p>Feels like</p>
              </div>
            </div>
            <div className="column humidity">
              <i className="scale-150 -translate-y-2 ...">
                <InvertColorsIcon />
              </i>
              <div className="details">
                {weatherData && <span>{weatherData.main.humidity}%</span>}
                <p>Humidity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OutputPage;
