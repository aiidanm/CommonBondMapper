// src/MapComponent.js
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapComponent = ({ postcodes }) => {
  const [geojsonData, setGeojsonData] = useState(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const fetchGeojsonData = async () => {
    if (!postcodes) {
      setGeojsonData(null);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/geojson/${postcodes}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setGeojsonData(data);
    } catch (error) {
      console.error("Error fetching GeoJSON data:", error);
    }
  };

  useEffect(() => {
    fetchGeojsonData();
  }, [postcodes]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-2.24409, 53.48305],
        zoom: 12,
      });

      mapRef.current.on("load", () => {
        if (geojsonData) {
          updateMap();
        }
      });
    } else {
      updateMap();
    }

    function updateMap() {
      if (!geojsonData) {
        if (mapRef.current.getLayer("polygon-layer")) {
          mapRef.current.removeLayer("polygon-layer");
        }
        if (mapRef.current.getLayer("outline")) {
          mapRef.current.removeLayer("outline");
        }
        if (mapRef.current.getSource("polygon")) {
          mapRef.current.removeSource("polygon");
        }
        return;
      }

      const filteredData = {
        type: "FeatureCollection",
        features: geojsonData.map((item) => ({
          type: "Feature",
          properties: {
            name: item.name,
            description: item.description,
          },
          geometry: JSON.parse(item.geojson),
        })),
      };

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

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [geojsonData]);

  return <div className="map-container" ref={mapContainerRef} />;
};

export default MapComponent;
