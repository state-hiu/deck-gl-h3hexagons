/// app.js
import React, {useState } from 'react';
import DeckGL from '@deck.gl/react';
//import {LineLayer} from '@deck.gl/layers';
import {H3HexagonLayer} from '@deck.gl/geo-layers';
import {Map} from 'react-map-gl';
import mapboxgl from "mapbox-gl"; // This is a dependency of react-map-gl even if you didn't explicitly install it

// add to apply the following fix so that the basemap works in production: https://github.com/visgl/react-map-gl/issues/1266
// npm install worker-loader
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiaGl1IiwiYSI6InJWNGZJSzgifQ.xK1ndT3W8XL9lwVZrT6jvQ';

function getDataAsync() {
  return fetch('boston_crimes_h3.json'
  ,{
    headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
     }
  }
  )
  .then((response) => response.json())
  .then((responseJson) => {
    return responseJson;
  })
  .catch((error) => {
    console.error(error);
  });
}

// DeckGL react component
function App() {
  
  // useEffect(() => {
  //   boston_crime = getDataAsync()
  // })

  // https://deck.gl/docs/developer-guide/interactivity
  const [viewState, setViewState] = useState({
    longitude: -71.039,
    latitude: 42.352,
    zoom: 9,
    maxZoom: 15,
    pitch: 30,
    bearing: 0
  });

  const layer = new H3HexagonLayer({
    id: 'h3-hexagon-layer',
    data: getDataAsync(),
    pickable: true,
    wireframe: false,
    filled: true,
    extruded: true,
    elevationScale: 20,
    getHexagon: d => d.hex,
    getFillColor: d => [255, (1 - d.value / 500) * 255, 0],
    getElevation: d => d.value
  });

  return (
    <DeckGL
      viewState={viewState}
      onViewStateChange={e => setViewState(e.viewState)}
      controller={true}
      layers={layer}
      getTooltip={({object}) => object && `${object.hex} value: ${object.value}`}
    >
      <Map 
        mapStyle="mapbox://styles/mapbox/dark-v10"
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN} 
      />
    </DeckGL>
  );
}

export default App;