// src/MapComponent.js
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWlkYW5tdXJyYXkiLCJhIjoiY2x5N3BldnRtMDF4ejJrcXd4YnZtaHAycSJ9.7rTiY9kqsc8gmO2Y95QpNg";

const MapComponent = ({ postcodes }) => {
  const [geojsonData, setGeojsonData] = useState(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const fetchGeojsonData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3003/geojson/${postcodes}`
      );
      const data = await response.json();
      setGeojsonData(data);
    } catch (error) {
      console.error("Error fetching GeoJSON data:", error);
    }
  };

  useEffect(() => {
    fetchGeojsonData();
  }, []);

  useEffect(() => {
    if (!geojsonData) return;

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-2.24409, 53.48305],
        zoom: 12,
      });

      mapRef.current.on("load", () => {
        updateMap();
      });
    } else {
      updateMap();
    }

    function updateMap() {
      const filteredData = {
        ...geojsonData,
        features: geojsonData.features.filter((feature) =>
          postcodes
            .split(",")
            .map((code) => code.trim())
            .includes(feature.properties.name)
        ),
      };

      console.log("Filtered Data:", filteredData);

      if (mapRef.current.getSource("polygon")) {
        mapRef.current.getSource("polygon").setData(filteredData);
      } else {
        mapRef.current.addSource("polygon", {
          type: "geojson",
          data: filteredData,
        });

        mapRef.current.addLayer({
          id: "polygon-layer",
          type: "fill",
          source: "polygon",
          layout: {},
          paint: {
            "fill-color": "#d15ac9",
            "fill-opacity": 0.5,
          },
        });

        mapRef.current.addLayer({
          id: "outline",
          type: "line",
          source: "polygon",
          layout: {},
          paint: {
            "line-color": "#000",
            "line-width": 2,
          },
        });
      }
    }

    // Clean up the map instance on component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [geojsonData, postcodes]); // Run this effect when geojsonData or postcodes change

  return <div className="map-container" ref={mapContainerRef} />;
};

export default MapComponent;
