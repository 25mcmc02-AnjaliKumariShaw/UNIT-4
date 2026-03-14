import React, { useState } from "react";
import "./Weather.css";

function Weather() {

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");

  const API_KEY = "d3fac8eb9c4d9d2f03c0f43fbfb722a5";

  const fetchWeather = () => {

    if (!city) {
      setError("Please enter a city name");
      return;
    }

    setError("");

    /* =========================
       AJAX REQUEST (CURRENT WEATHER)
    ========================= */

    const currentRequest = new XMLHttpRequest();

    const currentURL =
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    currentRequest.open("GET", currentURL, true);

    currentRequest.onload = function () {

      if (currentRequest.status === 200) {

        const data = JSON.parse(currentRequest.responseText);
        setWeather(data);

      } else {

        setError("City not found");
        setWeather(null);

      }

    };

    currentRequest.onerror = function () {
      setError("Network error");
    };

    currentRequest.send();



    /* =========================
       AJAX REQUEST (FORECAST)
    ========================= */

    const forecastRequest = new XMLHttpRequest();

    const forecastURL =
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    forecastRequest.open("GET", forecastURL, true);

    forecastRequest.onload = function () {

      if (forecastRequest.status === 200) {

        const forecastData = JSON.parse(forecastRequest.responseText);

        const dailyForecast = [];
        const usedDates = [];

        forecastData.list.forEach((item) => {

          const date = item.dt_txt.split(" ")[0];

          if (!usedDates.includes(date)) {
            usedDates.push(date);
            dailyForecast.push(item);
          }

        });

        setForecast(dailyForecast.slice(0,6));

      } else {

        setError("Forecast API error");
        setForecast([]);

      }

    };

    forecastRequest.onerror = function () {
      setError("Network error");
    };

    forecastRequest.send();

  };


  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  return (
    <div style={{ textAlign: "center" }}>

      <h1>Weather App</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter City Name"
          value={city}
          onChange={(e)=>setCity(e.target.value)}
        />

        <button type="submit">Search</button>
      </form>

      {error && <p>{error}</p>}

      {/* TODAY WEATHER */}

      {weather && (
        <div className="weather-container">

          <h2>
            Today - {new Date().toLocaleDateString("en-US",{weekday:"long"})}
          </h2>

          <p>
            Date: {new Date().toLocaleDateString("en-US",{
              month:"short",
              day:"numeric",
              year:"numeric"
            })}
          </p>

          <p>Temperature: {weather.main.temp} °C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Condition: {weather.weather[0].description}</p>

        </div>
      )}

      {/* NEXT 5 DAYS FORECAST */}

      {forecast.length > 0 && (
        <div>

          <h3>Next 5 Days Forecast</h3>
          <div className="forecast-container">

          {forecast.slice(1,6).map((item,index)=>{

            const dateObj = new Date(item.dt_txt);

            const day = dateObj.toLocaleDateString("en-US",{weekday:"long"});

            const date = dateObj.toLocaleDateString("en-US",{
              month:"short",
              day:"numeric",
              year:"numeric"
            });

            return(

              <div key={index} style={{border:"1px solid gray",margin:"10px",padding:"10px"}}>

                <div className="forecast-card">
                  <div className="forecast-card-inner">

                    <h4>{day}</h4>

                    <p><strong>Date: </strong> {date}</p>
                    <p><strong>Temperature: </strong> {item.main.temp} °C</p>
                    <p><strong>Humidity: </strong> {item.main.humidity}%</p>
                    <p><strong>Condition: </strong>{item.weather[0].description}</p>

                  </div>
                </div>

              </div>

            )

          })}
          </div>

        </div>
      )}

    </div>
  );
}

export default Weather;
