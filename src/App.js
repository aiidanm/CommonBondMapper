import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";
import MapComponent from "./mapcomponent";
import Modal from "./popup";

function App() {
  const [postcodes, setPostcodes] = useState("");
  const [filteredPostcodes, setFilteredPostcodes] = useState("");
  const [selectedcolor, setSelectedColor] = useState("#3d9de6");
  const [triggerUpdate, setTriggerUpdate] = useState(0);
  const [opacity, setOpacity] = useState(0.5);
  const [openHowTo, setOpenHowTo] = useState(false);

  const handleUpdateMap = () => {
    setFilteredPostcodes(postcodes);
    setTriggerUpdate((prev) => prev + 1); // Increment the counter to trigger map update
  };

  const handleColorUpdate = (e) => {
    setSelectedColor(e.target.value);
  };

  const handleOpacity = (e) => {
    setOpacity(Number(e.target.value) / 100);
  };

  return (
    <div className="app-container">
      <div className="centered-box">
        <h1 className="mainName">Postcode Plotter</h1>
        <h3>by Aidan Murray</h3>
        <button onClick={() => setOpenHowTo(true)} className="howtoButton">
          How to use
        </button>
        <div className="controlsContainer">
          <Modal isOpen={openHowTo} onClose={() => setOpenHowTo(false)}></Modal>
          <div className="colorPickerContainer">
            <input
              id="style1"
              type="color"
              value={selectedcolor}
              onChange={handleColorUpdate}
            />
            <label htmlFor="style1">Pick your colour</label>
          </div>

          <div className="opacityContainer">
            <input
              type="range"
              id="opacity"
              min={0}
              max={100}
              onChange={handleOpacity}
            ></input>
            <label htmlFor="opacity">
              Opacity: {Math.round(opacity * 100)}%
            </label>
          </div>
          <input
            type="text"
            value={postcodes}
            onChange={(e) => setPostcodes(e.target.value.toUpperCase())}
            placeholder="M1,M2,M3,...."
          />
          <button onClick={handleUpdateMap} className="button">
            Update Map
          </button>
        </div>

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
