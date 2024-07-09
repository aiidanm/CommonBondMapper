import logo from "./logo.svg";
import "./App.css";
import React, { useRef, useEffect, useState } from "react";
import MapComponent from "./mapcomponent";

function App() {
  const [postcodes, setPostcodes] = useState("");
    const [filteredPostcodes, setFilteredPostcodes] = useState("");
    const [selectedcolor, setSelectedColor] = useState("#ff3399")

   const handleUpdateMap = () => {
     setFilteredPostcodes(postcodes);
   };

   const handleColorUpdate = (e) => {
    setSelectedColor(e.target.value)
   }

  return (
    <div className="app-container">
      <div className="centered-box">
        <h1 className="mainName">Common bond map</h1>
        <h3>by Aidan Murray</h3>
        <input
          type="text"
          value={postcodes}
          onChange={(e) => setPostcodes(e.target.value.toUpperCase())}
        ></input>
        <input className="colorPicker" type="color" onChange={(e) => handleColorUpdate(e)}></input>
        <button onClick={handleUpdateMap}>Update Map</button>
        <div className="postcodeinput"></div>
        <MapComponent postcodes={filteredPostcodes} selectedcolor={selectedcolor}/>
      </div>
    </div>
  );
}

export default App;
