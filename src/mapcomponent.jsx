import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapComponent = ({ postcodes, selectedcolor, triggerUpdate, opacity }) => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [filteredData, setFilteredData] = useState(null); // New state for filtered data
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
    if (geojsonData) {
      const filtered = {
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
      setFilteredData(filtered);
    }
  }, [geojsonData]);

  useEffect(() => {
    const initializeMap = () => {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-2.24409, 53.48305],
        zoom: 12,
      });

      mapRef.current.on("load", () => {
        if (filteredData) {
          updateMap(filteredData);
        }
      });
    };

    if (!mapRef.current) {
      initializeMap();
    } else if (filteredData) {
      updateMap(filteredData);
    }

    function updateMap(data) {
      if (!data) {
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

      if (mapRef.current.isStyleLoaded()) {
        if (mapRef.current.getSource("polygon")) {
          mapRef.current.getSource("polygon").setData(data);
          mapRef.current.setPaintProperty(
            "polygon-layer",
            "fill-color",
            selectedcolor
          );
        } else {
          mapRef.current.addSource("polygon", {
            type: "geojson",
            data: data,
          });

          mapRef.current.addLayer({
            id: "polygon-layer",
            type: "fill",
            source: "polygon",
            layout: {},
            paint: {
              "fill-color": `${selectedcolor}`,
              "fill-opacity": opacity,
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

          var bbox1 = turf.bbox(data);
          mapRef.current.fitBounds(bbox1, { padding: 20 });
        }
      } else {
        mapRef.current.once("styledata", () => {
          updateMap(data);
        });
      }
    }

    if (mapRef.current && filteredData && mapRef.current.isStyleLoaded()) {
      mapRef.current.setPaintProperty(
        "polygon-layer",
        "fill-color",
        selectedcolor
      );
    }


    

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [filteredData, triggerUpdate]);

  return (
      <div className="map-container" ref={mapContainerRef} />
  );
};

export default MapComponent;
