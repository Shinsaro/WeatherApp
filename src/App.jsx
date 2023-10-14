import { useState } from "react";
import { Col, Row, Container, Modal, Button } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import WeatherIconsCollection from "./collections/WeatherIconsCollection.json";
import DayOfTheWeekWeather from "./DayOfTheWeekWeather";

function App() {
  const [city, setCity] = useState("");
  const [temperature, setTemperature] = useState("");
  const [iconType, setIconType] = useState("");
  const [temperatures, setTemperatures] = useState("");
  const [days, setDays] = useState("");
  const [icons, setIcons] = useState("");
  const [unitTemperature, setUnitTemperature] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [windSpeedUnit, setWindSpeedUnit] = useState("");
  const [windDirection, setWindDirection] = useState("");
  const [windDirectionUnit, setWindDirectionUnit] = useState("");
  const today = new Date();
  const todayPlus7Days = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 7
  );
  const todayMonth = (today.getMonth() + 1).toString().padStart(2, "0");

  const [show, setShow] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleShowPanel = () => setShowPanel(false);

  function getContryLatAndLong(cityInput) {
    fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + cityInput)
      .then((response) => response.json())
      .then((jsonData) => {
        setTimeZone(jsonData.country_code);
        getWeatherInfo(
          jsonData.results[0].latitude,
          jsonData.results[0].longitude
        );
      })
      .catch((error) => {
        // handle your errors here
        console.error(error);
      });
  }
  function getWeatherInfo(latitude, longitude) {
    setTemperature("loading...");
    const weatherData = async () => {
      return await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=" +
          latitude +
          "&longitude=" +
          longitude +
          "&hourly=temperature_2m,weathercode&&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto&start_date=" +
          today.getFullYear() +
          "-" +
          todayMonth +
          "-" +
          today.getDate().toString().padStart(2, "0") +
          "&end_date=" +
          todayPlus7Days.getFullYear() +
          "-" +
          (todayPlus7Days.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          todayPlus7Days.getDate().toString().padStart(2, "0")
      )
        .then((response) => response.json())
        .then((jsonData) => {
          return jsonData;
        })
        .catch((error) => {
          console.error(error);
        });
    };
    weatherData().then((dataJSON) => {
      const iconTypeWeather =
        WeatherIconsCollection[dataJSON.current_weather.weathercode];
      const icon =
        iconTypeWeather[dataJSON.current_weather.is_day == 0 ? "night" : "day"];
      setIconType(icon);
      setTemperature(dataJSON.current_weather.temperature);
      setUnitTemperature(dataJSON.hourly_units.temperature_2m);
      setWindSpeed(dataJSON.current_weather.windspeed);
      setWindSpeedUnit(dataJSON.current_weather_units.windspeed);
      setWindDirection(dataJSON.current_weather.winddirection);
      setWindDirectionUnit(dataJSON.current_weather_units.winddirection);
      const arrayListTemperatures = dataJSON.daily.temperature_2m_max;
      const arrayListDates = dataJSON.daily.time;
      const arrayIcons = dataJSON.daily.weathercode;
      setTemperatures(arrayListTemperatures);
      setDays(arrayListDates);
      setIcons(arrayIcons);
    });
  }
  return (
    <Container className="weatherAppBody">
      <Row className="bodyWeather">
        <div className="modal show">
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Search for a City or Country</Modal.Title>
            </Modal.Header>
            <Modal.Body className="searchSection">
              <input
                type="text"
                className="cityInput"
                placeholder={"Introduce the name of the city"}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                className="cityBtn"
                onClick={() => {
                  const cityInput =
                    document.getElementsByClassName("cityInput")[0].value;
                  document.getElementsByClassName("cityName")[0].innerHTML =
                    cityInput;
                  setCity(cityInput);
                  getContryLatAndLong(cityInput);
                  handleClose();
                  handleShowPanel();
                }}
              >
                Search
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <Col className="panelLeft" xs={12} md={12} lg={12} xxl={12}>
          <Row className="city">
            <Col>
              <Icon.Search className="iconSearch" onClick={handleShow} />
            </Col>{" "}
            <Col className="cityName">{city}</Col>
            <Col className="cityMoment" hidden={showPanel}>
              NOW
            </Col>
          </Row>
          <Row>
            <Col xs={3} md={3} lg={3} xl={3} xxl={3}>
              <Row>
                <div className="iconWeather">
                  <img
                    className="todayIcon"
                    src={iconType.image}
                    alt={iconType.description}
                  />
                </div>
              </Row>
              <Row className="temperature">
                {temperature}
                {unitTemperature}
              </Row>
            </Col>
            <Col xs={3} md={3} lg={3} xl={3} xxl={3}>
              <Row hidden={showPanel} xs={12}>
                Wind Speed : {windSpeed}
                {windSpeedUnit}
              </Row>
              <Row hidden={showPanel} xs={12}>
                Wind Direction : {windDirection}
                {windDirectionUnit}
              </Row>
            </Col>
            <Col xs={3}></Col>
          </Row>
        </Col>
        <Col className="panelRight" hidden={showPanel} xs={12} md={12}>
          <DayOfTheWeekWeather
            days={days}
            dictionaryDayTemprature={temperatures}
            icons={icons}
            timeZone={timeZone}
            unitTemperature={unitTemperature}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
