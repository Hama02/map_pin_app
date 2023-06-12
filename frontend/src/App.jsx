import { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import RoomIcon from "@mui/icons-material/Room";
import Star from "@mui/icons-material/Star";
import "./app.css";
import axios from "axios";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

function App() {
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem("user") || null
  );
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [ratings, setRatings] = useState(0);
  const [viewState, setViewState] = useState({
    longitude: 2.333333,
    latitude: 48.866667,
    zoom: 4,
  });

  const handleAddClick = (e) => {
    const { lng, lat } = e.lngLat;
    setNewPlace({
      lat: lat,
      long: lng,
    });
  };

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewState({ ...viewState, longitude: long, latitude: lat });
  };

  const handleDelete = async (title) => {
    await axios.delete(`https://map-pinner.onrender.com/api/pins/${title}`);
    setPins(pins.filter((pin) => pin.title !== title));
  };

  const handleLogout = (e) => {
    e.preventDefault();
    setCurrentUser(null);
    localStorage.removeItem("user");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      ratings,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post(
        "https://map-pinner.onrender.com/api/pins",
        newPin
      );
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("https://map-pinner.onrender.com/api/pins");
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
        transitionDuration="200"
        mapboxAccessToken="pk.eyJ1IjoiaGFtYWFhYSIsImEiOiJjbGlwNHphaGIwbTh0M2RwY3Zub3Zkc2E1In0.ZkrArC3cptvPSmfXzeeR7Q"
      >
        {pins.map((pin) => (
          <>
            <Marker
              latitude={pin.lat}
              longitude={pin.long}
              offsetLeft={-viewState.zoom * 3.5}
              offsetTop={-viewState.zoom * 7}
              onClick={() => setShowPopup(true)}
            >
              <RoomIcon
                style={{
                  fontSize: viewState.zoom * 7,
                  color: currentUser === pin.username ? "tomato" : "slateblue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)}
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
                    {Array(pin.ratings).fill(<Star className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{pin.username}</b>
                  </span>
                  <span className="date">{format(pin.createdAt)}</span>
                  {currentUser === pin.username && (
                    <span
                      className="remove"
                      onClick={() => handleDelete(pin.title)}
                    >
                      <RemoveCircleIcon /> Remove Pin
                    </span>
                  )}
                </div>
              </Popup>
            )}
          </>
        ))}
        {newPlace && (
          <Popup
            longitude={newPlace.long}
            latitude={newPlace.lat}
            anchor="left"
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  type="text"
                  placeholder="enter a title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea
                  placeholder="Say us something about this place"
                  onChange={(e) => setDesc(e.target.value)}
                ></textarea>
                <label>Rating</label>
                <select onChange={(e) => setRatings(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        )}
        {currentUser ? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Login
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login setShowLogin={setShowLogin} setCurrentUser={setCurrentUser} />
        )}
      </Map>
    </div>
  );
}

export default App;
