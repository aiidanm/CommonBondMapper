import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";
import MapComponent from "./mapcomponent";

function App() {
  const [postcodes, setPostcodes] = useState("");
  const [filteredPostcodes, setFilteredPostcodes] = useState("");
  const [selectedcolor, setSelectedColor] = useState("#ff3399");
  const [triggerUpdate, setTriggerUpdate] = useState(0);
  const [opacity, setOpacity] = useState(0.5);

  const handleUpdateMap = () => {
    setFilteredPostcodes(postcodes);
    setTriggerUpdate((prev) => prev + 1); // Increment the counter to trigger map update
  };

  const handleColorUpdate = (e) => {
    setSelectedColor(e.target.value);
  };

  const handleOpacity = (e) => {
    setOpacity(Number(e.target.value) / 10);
  };

  return (
    <div className="app-container">
      <div className="centered-box">
        <h1 className="mainName">Common bond map</h1>
        <h3>by Aidan Murray</h3>
        <input
          type="text"
          value={postcodes}
          onChange={(e) => setPostcodes(e.target.value.toUpperCase())}
        />
        <input
          className="colorPicker"
          type="color"
          value={selectedcolor}
          onChange={handleColorUpdate}
        />
        <input
          type="range"
          id="opacity"
          min={0}
          max={10}
          onChange={handleOpacity}
        ></input>
        <label htmlFor="opacity">Opacity</label>
        <button onClick={handleUpdateMap}>Update Map</button>
        <MapComponent
          postcodes={filteredPostcodes}
          selectedcolor={selectedcolor}
          triggerUpdate={triggerUpdate}
          opacity={opacity}
        />
      </div>
    </div>
  );
}

export default App;
