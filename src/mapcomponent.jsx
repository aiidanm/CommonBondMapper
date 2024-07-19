import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import 'mapbox-gl/dist/mapbox-gl.css';
	import {
		MapboxExportControl,
		Size,
		PageOrientation,
		Format,
		DPI
	} from '@watergis/mapbox-gl-export';
	import '@watergis/mapbox-gl-export/dist/mapbox-gl-export.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapComponent = ({
  layers,
  onRemoveLayer,
  onUpdateLayer,
  onPostcodesChange,
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-2.24409, 53.48305],
        zoom: 12,
      });

      mapRef.current.on("load", () => {
        setMapLoaded(true);
        mapRef.current.addControl(
          new MapboxExportControl({
            PageSize: Size.A3,
            PageOrientation: PageOrientation.Portrait,
            Format: Format.PNG,
            DPI: DPI[96],
            Crosshair: true,
            PrintableArea: true,
            Local: 'en'
          }),
          'top-right'
        );
      });
    }
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      layers.forEach((layer) => {
        const layerId = `layer-${layer.name}`;
        const outlineId = `outline-${layer.name}`;

        // Check if layer already exists
        if (mapRef.current.getLayer(layerId)) {
          mapRef.current.getSource(layerId).setData(layer.geojsonData);
        } else {
          mapRef.current.addSource(layerId, {
            type: "geojson",
            data: layer.geojsonData,
          });

          mapRef.current.addLayer({
            id: layerId,
            type: "fill",
            source: layerId,
            layout: {},
            paint: {
              "fill-color": layer.color,
              "fill-opacity": layer.opacity,
            },
          });

          mapRef.current.addLayer({
            id: outlineId,
            type: "line",
            source: layerId,
            layout: {},
            paint: {
              "line-color": "#000",
              "line-width": 2,
            },
          });

          // Check if geojsonData is defined before using turf.bbox
          if (
            layer.geojsonData &&
            layer.geojsonData.features &&
            layer.geojsonData.features.length > 0
          ) {
            const bbox = turf.bbox(layer.geojsonData);
            mapRef.current.fitBounds(bbox, { padding: 20 });
          }
        }
      });

      // Remove layers that are not in the state anymore
      const existingLayers = mapRef.current.getStyle().layers;
      existingLayers.forEach((layer) => {
        if (
          layer.id.startsWith("layer-") &&
          !layers.find((l) => `layer-${l.name}` === layer.id)
        ) {
          mapRef.current.removeLayer(layer.id);
          mapRef.current.removeSource(layer.id);
        }

        if (
          layer.id.startsWith("outline-") &&
          !layers.find((l) => `outline-${l.name}` === layer.id)
        ) {
          mapRef.current.removeLayer(layer.id);
        }
      });
    }
  }, [layers, mapLoaded]);

  const handleRemoveLayer = (layerName) => {
    const layerId = `layer-${layerName}`;
    const outlineId = `outline-${layerName}`;

    if (mapRef.current.getLayer(outlineId)) {
      mapRef.current.removeLayer(outlineId);
    }

    if (mapRef.current.getLayer(layerId)) {
      mapRef.current.removeLayer(layerId);
      mapRef.current.removeSource(layerId);
    }

    onRemoveLayer(layerName);
  };

  const handlePostcodesChange = (layerName, newPostcodes) => {
    onPostcodesChange(layerName, newPostcodes);
  };

  return (
    <div className="bottomContainer">
      <div className="map-container" ref={mapContainerRef} />
      <div className="layer-list">
        <a id="downloadLink" href={imageDownloadUrl} download="map.png">
          Download ↓
        </a>
        {layers.map((layer) => (
          <div key={layer.name} className="layer-item">
            <span
              className="layer-color-box"
              style={{ backgroundColor: layer.color }}
            ></span>
            <span>{layer.name}</span>
            <input
              type="text"
              value={layer.postcodes}
              onChange={(e) =>
                handlePostcodesChange(layer.name, e.target.value)
              }
            />
            <button onClick={() => onUpdateLayer(layer.name)}>Update</button>
            <button onClick={() => handleRemoveLayer(layer.name)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapComponent;
