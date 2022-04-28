import React, { useState, useEffect } from "react";
import "./App.css";
import { MdOutlineSearch } from "react-icons/md";
const uzbCities = [
  {
    name: "Tashkent",
    value: "tashkent",
  },
  {
    name: "Samarqand",
    value: "samarqand",
  },
  {
    name: "Termiz",
    value: "termiz",
  },
  {
    name: "Namangan",
    value: "namangan",
  },
];
const arrmonth = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const arrweekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function getFormattedTime(weather) {
  const date = new Date(weather?.dt);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const weekday = arrweekdays[date.getDay()];
  const day = date.getDay();
  const month = arrmonth[date.getMonth()];
  // return `${date}`
  const data = `${hours}:${minutes} - ${weekday} , ${day} ${month}`;
  return data;
}
const getFetchData = (url) => {
  return fetch(url)
    .then((res) => {
      return res.json();
    })
    .catch((error) => console.log(error));
};
const App = () => {
  const [weather, setWeather] = useState();
  const [location, setLocation] = useState("London");
  const [photo, setPhoto] = useState([]);
  const fetchWeatherData = () => {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=4818f25142e317eb003077a007fb52dc&units=metric`
    )
      .then((res) => {
        return res.json();
      })
      .then((obj) => {
        if (obj.cod == "404") {
          return;
        }
        console.log("obj", obj);
        setWeather(obj);
      })
      .catch((error) => console.log(error));
  };
  const fetchPhotoData = () => {
    const randomPhotoFetchUrl = `https://api.unsplash.com/search/photos?query=weather is ${weather?.weather[0].main}&client_id=xaLPn7dqjV-hyOhmhH8KYnNV40Kl8OPmbIfO3V7C2qs&orientation=landscape`;
    getFetchData(randomPhotoFetchUrl)
      .then((data) => {
        let number = parseInt(Math.random() * 10);
        setPhoto(data?.results[number].urls.regular);
        // console.log(data?.results[number]?.urls?.small);
      })
      .catch((error) => console.log(error));
  };

  function getInfo(e) {
    e.preventDefault();
    fetchWeatherData();
    fetchPhotoData();
  }

  useEffect(() => {
    fetchWeatherData();
    fetchPhotoData();
  }, []);

  return (
    <>
      <div className="bgItem">
        <div
          className="container "
          style={{
            backgroundImage: `url(
              ${photo}
            )`,
          }}
        >
          <div className="leftSide">
            <p>the.weather</p>
            <div className="flex mainDetails">
              <h1>{weather?.main?.temp}º</h1>
              <div>
                <h1>{weather?.name}</h1>
                <p>{getFormattedTime(weather)}</p>
              </div>
              <div>
                <img
                  src={`http://openweathermap.org/img/wn/${weather?.weather?.[0]?.icon}.png`}
                  alt="icon"
                />
                <p>{weather?.weather[0].main}</p>
              </div>
            </div>
          </div>
          <div className="rightSide">
            <form className="border-b" onSubmit={getInfo}>
              <input
                type="text"
                id="input"
                value={location}
                onChange={(e) => {
                  console.log(e);
                  setLocation(e.target.value);
                }}
                placeholder="Another location"
              />
              <button>{<MdOutlineSearch />}</button>
            </form>
            <ul className="lastLocation border-b">
              {uzbCities.map((city) => (
                <li key={city.value} onClick={() => setLocation(city.value)}>
                  {city.name}
                </li>
              ))}
            </ul>

            <p style={{ color: "white" }}>Weather details</p>
            <table className="details border-b">
              <tr>
                <td>Cloudy</td>
                <td>{weather?.clouds.all}%</td>
              </tr>
              <tr>
                <td>Humidity</td>
                <td>{weather?.main.humidity}%</td>
              </tr>
              <tr>
                <td>Wind</td>
                <td>{weather?.wind.speed}km/h</td>
              </tr>
              <tr>
                <td>Rain</td>
                <td>{(weather?.rain && weather?.rain["1h"]) || 0}mm</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
