import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";
import MapComponent from "./mapcomponent";
import Modal from "./popup";

function App() {
  const [postcodes, setPostcodes] = useState("");
  const [layerName, setLayerName] = useState(""); // New state for layer name
  const [layers, setLayers] = useState([]); // New state for layers
  const [selectedcolor, setSelectedColor] = useState("#3d9de6");
  const [opacity, setOpacity] = useState(0.5);
  const [openHowTo, setOpenHowTo] = useState(false);

  const handleAddLayer = async () => {
    if (layers.some((layer) => layer.name === layerName)) {
      alert("Layer name already exists. Please choose a different name.");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/geojson/${postcodes}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const geojsonData = await response.json();

      const newLayer = {
        name: layerName,
        geojsonData: {
          type: "FeatureCollection",
          features: geojsonData.map((item) => ({
            type: "Feature",
            properties: {
              name: item.name,
              description: item.description,
            },
            geometry: JSON.parse(item.geojson),
          })),
        },
        color: selectedcolor,
        opacity: opacity,
      };

      setLayers([...layers, newLayer]);
      setLayerName("");
      setPostcodes("");
    } catch (error) {
      console.error("Error fetching GeoJSON data:", error);
    }
  };

  const handleRemoveLayer = (layerName) => {
    setLayers(currLayers => currLayers.filter((layer) => layer.name !== layerName))
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
        <h1 className="mainName">Common bond map</h1>
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
            value={layerName}
            onChange={(e) => setLayerName(e.target.value)}
            placeholder="Layer Name"
          />
          <input
            type="text"
            value={postcodes}
            onChange={(e) => setPostcodes(e.target.value.toUpperCase())}
            placeholder="M1,M2,M3,...."
          />
          <button onClick={handleAddLayer} className="button">
            Update Map
          </button>
        </div>

        <MapComponent layers={layers} onRemoveLayer={handleRemoveLayer} />
      </div>
    </div>
  );
}

export default App;
