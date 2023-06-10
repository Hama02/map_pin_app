import { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import RoomIcon from "@mui/icons-material/Room";
import Star from "@mui/icons-material/Star";
import "./app.css";
import axios from "axios";
import { format } from "timeago.js";

function App() {
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [newPlace, setNewPlace] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: 2.333333,
    latitude: 48.866667,
    zoom: 4,
  });

  const handleMarkerClick = (id) => {
    setCurrentPlaceId(id);
  };

  const handleAddClick = (e) => {
    const { lng, lat } = e.lngLat;
    setNewPlace({
      lat: lat,
      long: lng,
    });
  };

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);
  return (
    <div className="app">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        style={{ width: "100vw", height: "100vh" }}
        onDblClick={handleAddClick}
        mapboxAccessToken="pk.eyJ1IjoiaGFtYWFhYSIsImEiOiJjbGlwNHphaGIwbTh0M2RwY3Zub3Zkc2E1In0.ZkrArC3cptvPSmfXzeeR7Q"
      >
        {pins.map((pin) => (
          <>
            <Marker
              latitude={pin.lat}
              longitude={pin.long}
              onClick={() => setShowPopup(true)}
            >
              <RoomIcon
                style={{
                  fontSize: viewState.zoom * 7,
                  color: "slateblue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(pin._id)}
              />
            </Marker>
            ;
            {currentPlaceId === pin._id && showPopup && (
              <Popup
                longitude={pin.long}
                latitude={pin.lat}
                anchor="left"
                closeButton={true}
                closeOnClick={false}
                onClose={() => setShowPopup(false)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{pin.title}</h4>
                  <label>Review</label>
                  <p className="desc">{pin.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    <Star className="star" />
                    <Star className="star" />
                    <Star className="star" />
                    <Star className="star" />
                    <Star className="star" />
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{pin.username}</b>
                  </span>
                  <span className="date">{format(pin.createdAt)}</span>
                </div>
              </Popup>
            )}
          </>
        ))}
        {newPlace && (
          <Marker
            latitude={newPlace?.lat}
            longitude={newPlace?.long}
            onClick={() => setShowPopup(true)}
          >
            <RoomIcon
              style={{
                fontSize: viewState.zoom * 7,
                color: "slateblue",
                cursor: "pointer",
              }}
            />
          </Marker>
        )}
      </Map>
    </div>
  );
}

export default App;
