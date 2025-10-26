import "./App.css";
import React, { useState } from "react";
import MapComponent from "./mapcomponent";
import Modal from "./popup";

function App() {
  const [postcodes, setPostcodes] = useState("");
  const [layerName, setLayerName] = useState("");
  const [layers, setLayers] = useState([]);
  const [selectedcolor, setSelectedColor] = useState("#3d9de6");
  const [opacity, setOpacity] = useState(0.5);
  const [openHowTo, setOpenHowTo] = useState(false);
  const [outlineColor, setOutlineColor] = useState("#000000");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const fetchGeojsonData = async (postcodes) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/geojson/${postcodes}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const geojsonData = await response.json();
    return geojsonData.map((item) => ({
      type: "Feature",
      properties: {
        name: item.name,
        description: item.description,
      },
      geometry: JSON.parse(item.geojson),
    }));
  };

  const handleAddLayer = async () => {
    if (layers.some((layer) => layer.name === layerName)) {
      alert("Layer name already exists. Please choose a different name.");
      return;
    }

    try {
      const features = await fetchGeojsonData(postcodes);
      const newLayer = {
        name: layerName,
        postcodes: postcodes,
        geojsonData: {
          type: "FeatureCollection",
          features,
        },
        color: selectedcolor,
        opacity: opacity,
        lineColor: outlineColor,
      };

      setLayers([...layers, newLayer]);
      setLayerName("");
      setPostcodes("");
    } catch (error) {
      console.error("Error fetching GeoJSON data:", error);
    }
  };

  const handleUpdateLayer = async (layerName) => {
    const layerIndex = layers.findIndex((layer) => layer.name === layerName);
    if (layerIndex === -1) return;

    try {
      const features = await fetchGeojsonData(layers[layerIndex].postcodes);
      const updatedLayer = {
        ...layers[layerIndex],
        geojsonData: {
          type: "FeatureCollection",
          features,
        },
      };

      const updatedLayers = [...layers];
      updatedLayers[layerIndex] = updatedLayer;
      setLayers(updatedLayers);
    } catch (error) {
      console.error("Error fetching GeoJSON data:", error);
    }
  };

  const handleRemoveLayer = (layerName) => {
    setLayers(layers.filter((layer) => layer.name !== layerName));
  };

  const handleColorUpdate = (e) => {
    setSelectedColor(e.target.value);
  };

  const handleOutlineColorUpdate = (e) => {
    setOutlineColor(e.target.value);
  };

  const handleOpacity = (e) => {
    setOpacity(Number(e.target.value) / 100);
  };

  const handlePostcodesChange = (layerName, newPostcodes) => {
    const updatedLayers = layers.map((layer) =>
      layer.name === layerName ? { ...layer, postcodes: newPostcodes } : layer
    );
    setLayers(updatedLayers);
  };

  return (
    <div className="app-container">
      <Modal isOpen={openHowTo} onClose={() => setOpenHowTo(false)} />
      
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h1 className="mainName">Common bond map</h1>
            <h3>by Aidan Murray</h3>
            <button onClick={() => setOpenHowTo(true)} className="howtoButton">
              How to use
            </button>
          </div>
          
          <div className="controlsContainer">
            <div className="controls-section">
              <div className="colorPickerContainer">
                <div className="colorpicker">
                  <label htmlFor="fillColor">Fill Colour</label>
                  <input
                    id="fillColor"
                    type="color"
                    className="style1"
                    value={selectedcolor}
                    onChange={handleColorUpdate}
                  />
                </div>
                <div className="colorpicker">
                  <label htmlFor="outlineColor">Outline Colour</label>
                  <input
                    id="outlineColor"
                    type="color"
                    className="style1"
                    value={outlineColor}
                    onChange={handleOutlineColorUpdate}
                  />
                </div>
              </div>
            </div>

            <div className="controls-section">
              <div className="opacityContainer">
                <label htmlFor="opacity">Opacity: {Math.round(opacity * 100)}%</label>
                <input
                  type="range"
                  id="opacity"
                  min={0}
                  max={100}
                  value={Math.round(opacity * 100)}
                  onChange={handleOpacity}
                />
              </div>
            </div>

            <div className="controls-section controls-group">
              <div className="input-group">
                <label htmlFor="layerName">Layer Name</label>
                <input
                  id="layerName"
                  type="text"
                  value={layerName}
                  onChange={(e) => setLayerName(e.target.value)}
                  placeholder="Enter a name for this layer"
                />
              </div>
              <div className="input-group">
                <label htmlFor="postcodes">Postcodes</label>
                <input
                  id="postcodes"
                  type="text"
                  value={postcodes}
                  onChange={(e) => setPostcodes(e.target.value.toUpperCase())}
                  placeholder="Enter postcodes (e.g., M1,M2,M3)"
                />
              </div>
              <button onClick={handleAddLayer} className="button">
                Add New Layer
              </button>
            </div>

            <div className="layer-list">
              {layers.map((layer) => (
                <div key={layer.name} className="layer-item">
                  <div className="layer-header">
                    <span
                      className="layer-color-box"
                      style={{ backgroundColor: layer.color }}
                    />
                    <span>{layer.name}</span>
                  </div>
                  <div className="layer-controls">
                    <input
                      type="text"
                      value={layer.postcodes}
                      onChange={(e) =>
                        handlePostcodesChange(layer.name, e.target.value.toUpperCase())
                      }
                      placeholder="Enter postcodes"
                    />
                    <button onClick={() => handleUpdateLayer(layer.name)}>Update</button>
                    <button onClick={() => handleRemoveLayer(layer.name)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div 
          className="sidebar-toggle" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          title={isSidebarOpen ? "Hide controls" : "Show controls"}
        >
          {isSidebarOpen ? '←' : '→'}
        </div>
      </div>

      <MapComponent
        layers={layers}
        onRemoveLayer={handleRemoveLayer}
        onUpdateLayer={handleUpdateLayer}
        onPostcodesChange={handlePostcodesChange}
      />
    </div>
  );
}

export default App;
