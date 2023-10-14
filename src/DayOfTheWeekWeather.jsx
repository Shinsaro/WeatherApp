import { Col, Row } from "react-bootstrap";
import WeatherIconsCollection from "./collections/WeatherIconsCollection.json";

function DayOfTheWeekWeather({
  dictionaryDayTemprature,
  days,
  icons,
  timeZone,
  unitTemperature,
}) {
  const displayedTemperatures = [...dictionaryDayTemprature];
  const options = { month: "long" };
  let arrayIcons = new Array();
  for (let i = 0; i < icons.length; i++) {
    arrayIcons.push(WeatherIconsCollection[icons[i]].day);
  }
  return (
    <>
      {displayedTemperatures.map((temperature, i) => (
        <Col className="dayOfWeekPanel" key={i} xs={6} md={4} lg={3} xl={2}>
          <Row
            className="panelForDateOfWeekWeather"
            xs={12}
            md={12}
            lg={12}
            xl={12}
            xxl={12}
          >
            <Col xs={4} md={4} lg={4} xl={4} xxl={4}>
              <h3 className="titleDayOfWeek">
                {new Date(days[i]).getDate().toString().padStart(2, "0")}
              </h3>
            </Col>
            <Col xs={8} md={8} lg={8} xl={8} xxl={8}>
              <h3 className="titleDayOfWeek">
                {new Date(days[i]).toLocaleDateString(timeZone, options)}
              </h3>
            </Col>
          </Row>
          <Row
            className="panelForDayofWeekWeather"
            xs={12}
            md={12}
            lg={12}
            xl={12}
            xxl={12}
          >
            <Row>
              <img
                className="dailyIcon"
                src={arrayIcons[i].image}
                alt={arrayIcons[i].description}
              />
            </Row>
            <Row className="dailyTemp">
              {temperature} {unitTemperature}
            </Row>
          </Row>
        </Col>
      ))}
    </>
  );
}
export default DayOfTheWeekWeather;
