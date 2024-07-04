import logo from "./logo.svg";
import "./App.css";
import React, { useRef, useEffect, useState } from "react";
import MapComponent from "./mapcomponent";

function App() {
  const [postcodes, setPostcodes] = useState("");
    const [filteredPostcodes, setFilteredPostcodes] = useState("");

   const handleUpdateMap = () => {
     setFilteredPostcodes(postcodes);
   };

  return (
    <div className="app-container">
      <div className="centered-box">
        <h1 className="mainName">SCU Common bond map</h1>
        <input
          type="text"
          value={postcodes}
          onChange={(e) => setPostcodes(e.target.value)}
        ></input>
        <button onClick={handleUpdateMap}>Update Map</button>
        <div className="postcodeinput"></div>
        <MapComponent postcodes={filteredPostcodes}/>
      </div>
    </div>
  );
}

export default App;
