import React, { useState, useEffect } from "react";
import "./fireball.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function Fireballs() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("https://fireballmap.herokuapp.com/https://ssd-api.jpl.nasa.gov/fireball.api?limit=15")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result.data);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="mainFB">
        <h1>Fireballs</h1>{" "}
        <MapContainer id="map" center={[0, 0]} zoom={1} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {items.map((item, index) => {
            if (item[4] === "S") {
              // item[3].prepend("-");
              // item[3] = `-${item[3]}`;
              item[3] = -item[3];
            } else if (item[6] === "W") {
              // item[5] = `-${item[5]}`;
              item[5] = -item[5];
            } else if (!item[3]) {
              item[3] = 0;
            }
            console.log(item[3].toString(), typeof item[3])
            console.log(item[5].toString(), typeof item[5])
            return (
              <Marker key={index} position={[item[3], item[5], item[7]]}>
                <Popup>{item[0]}</Popup>
              </Marker>
            );
          })}
        </MapContainer>
        <table id="table">
          <thead>
            <tr className="headers">
              <th className="date">Date - Time (UTC)</th>
              <th className="energy">Energy (kt)</th>
              <th className="lat">Latitude</th>
              <th className="long">Longitude</th>
              <th className="vel">Velocity</th>
            </tr>
          </thead>
          {items.map((item, index) => {
            return (
              <tbody className="nameDate" id={index} key={index}>
                <tr>
                  <td className="date">{item[0]}</td>
                  <td className="energy">{item[2]}</td>
                  <td className="lat">{item[3]}</td>
                  <td className="long">{item[5]}</td>
                  <td className="vel">{item[8]}</td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
    );
  }
}

export default Fireballs;
