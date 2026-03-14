import React, { useState } from "react";
import axios from "axios";
import "./Weather.css";

function Weather() {

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");

  const API_KEY = "d3fac8eb9c4d9d2f03c0f43fbfb722a5";

  const fetchWeather = async () => {

    if (!city) {
      setError("Please enter a city name");
      return;
    }
    try {

      setError("");
      /* AJAX REQUEST (Current Weather) */

      const request = new XMLHttpRequest();

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

      request.open("GET", url, true);

      request.onload = function () {

        if (request.status === 200) {

          const data = JSON.parse(request.responseText);
          setWeather(data);

        } else {

          setError("City not found");
          setWeather(null);

        }

      };

      request.onerror = function () {
        setError("Network error");
      };

      request.send();


      const current = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      const forecastData = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      setWeather(current.data);

      // get first forecast entry for each day
      const dailyForecast = [];
      const usedDates = [];

      forecastData.data.list.forEach((item) => {

        const date = item.dt_txt.split(" ")[0];

        if (!usedDates.includes(date)) {
          usedDates.push(date);
          dailyForecast.push(item);
        }

      });

      // store today + next 5 days
      setForecast(dailyForecast.slice(0,6));

    } catch (err) {

      setError("City not found or API error");
      setWeather(null);
      setForecast([]);

    }
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

          <h3>Next 5 Days Weather Forecast</h3>
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
