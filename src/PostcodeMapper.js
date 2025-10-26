import React, { useState } from "react";
import MapComponent from "./mapcomponent";
import Modal from "./popup";
import "./PostcodeMapper.css";

function PostcodeMapper() {
  // ... your existing state and functions ...

  return (
    <div className="postcode-mapper">
      <div className="app-container">
        <Modal isOpen={openHowTo} onClose={() => setOpenHowTo(false)} />
        
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          {/* ... rest of your component ... */}
        </div>

        <MapComponent
          layers={layers}
          onRemoveLayer={handleRemoveLayer}
          onUpdateLayer={handleUpdateLayer}
          onPostcodesChange={handlePostcodesChange}
        />
      </div>
    </div>
  );
}

export default PostcodeMapper;