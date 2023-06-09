import { useState } from "react";
import Map, { Marker } from "react-map-gl";
import RoomIcon from "@mui/icons-material/Room";

function App() {
  const [viewState, setViewState] = useState({
    longitude: 10,
    latitude: 36,
    zoom: 4,
  });
  return (
    <div>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken="pk.eyJ1IjoiaGFtYWFhYSIsImEiOiJjbGluZHhwbmIwNGhsM3BxY3Z1aHc4a2JwIn0.xInFxM3fTCGMgd90O1Qvmg"
      >
        <Marker latitude={36} longitude={10} offsetLeft={-20} offsetTop={-10}>
          <RoomIcon />
        </Marker>
      </Map>
    </div>
  );
}

export default App;
