import * as turf from '@turf/turf'
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { useRef, useEffect, useState } from 'react'
import './index.css'

mapboxgl.accessToken = 'pk.eyJ1Ijoic2hldmF3ZW4iLCJhIjoiY2lwZXN2OGlvMDAwMXR1bmh0aG5vbDFteiJ9.2fsD37adZ1hC2MUU-2xByA'

function App() { 
 // Área da Fazenda - Polígono
let boundaries = {
  type: "FeatureCollection",
  name: "boundaries",
  crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  features: [{
    type: "Feature",
    properties: {},
    geometry: {
      type: "MultiPolygon",
      coordinates: [[[ 
        [-45.98442061889694,-13.24265206349504], 
        [-45.97533265836429,-13.25895133869182], 
        [-45.96793018752702,-13.27233159702336], 
        [-45.9610414619882,-13.2845987550389], 
        [-45.9515265860163,-13.2795363001975], 
        [-45.9394241829635,-13.27317264298896], 
        [-45.9296970069854,-13.26809315134953],
        [-45.92950269818233,-13.2685900497644],
        [-45.91906148413759,-13.26331513286398],
        [-45.90929206072812,-13.25814432190867],
        [-45.89957544684647,-13.25300550634069],
        [-45.89002364712455,-13.24819853342071],
        [-45.88020640174634,-13.24295807953573],
        [-45.86992820588441,-13.23764137756826],
        [-45.86153887135558,-13.23343776226168],
        [-45.84968970768443,-13.22701547163829],
        [-45.85970497894705,-13.20856239147062],
        [-45.86467823775478,-13.19948854345764],
        [-45.86970522324357,-13.19017535745368],
        [-45.87700254818245,-13.1777554414895],
        [-45.88683459965847,-13.18292607566585],
        [-45.89690749601046,-13.1881053439416],
        [-45.90686385736248,-13.19343876697683],
        [-45.91711842420401,-13.19869011649538],
        [-45.93617471447868,-13.20886838995027],
        [-45.93575462141151,-13.20963423980725],
        [-45.93857543667506,-13.21119436809248],
        [-45.94530475201044,-13.21471078013605],
        [-45.94223919343963,-13.22050487971375],
        [-45.94796845965034,-13.22351762027571],
        [-45.96780796652137,-13.23388062812176],
        [-45.98442061889694,-13.24265206349504]    
      ] ] ]  
    } 
  }]
};
// boundaries = turf.transformScale(boundaries, 1);
var bbox = turf.bbox(boundaries);
console.log(bbox);

// Esses dados simulam as estações de campo com respectivos valores de umidade
let data = [
	 { "Lat" : -13.215800, "Lon" : -46.036335, "value" : 0 },
   { "Lat" : -13.323058, "Lon" : -46.002479, "value" : 0 },
   { "Lat" : -13.263925, "Lon" : -45.793796, "value" : 0 },
   { "Lat" : -13.141703, "Lon" : -45.834859, "value" : 0 },
   
  { "Lat" : -13.271419, "Lon" : -45.954840, "value" : 99 },
  { "Lat" : -13.273231, "Lon" : -45.955903, "value" : 99 },

  { "Lat" : -13.244260, "Lon" : -45.912256, "value" : 50 },
  
  { "Lat" : -13.260415, "Lon" : -45.914572, "value" : 77 },
   
  { "Lat" : -13.245733, "Lon" : -45.936171, "value" : 77 },

  { "Lat" : -13.248592, "Lon" : -45.937395, "value" : 77 },

  { "Lat" : -13.242406, "Lon" : -45.958479, "value" : 93 },

  { "Lat" : -13.239735, "Lon" : -45.957697, "value" : 93 },
  
  { "Lat" : -13.210440, "Lon" : -45.922149, "value" : 65 }, 

  { "Lat" : -13.222884, "Lon" : -45.900822, "value" : 56 }, 

  { "Lat" : -13.206637, "Lon" : -45.883638, "value" : 42 }, 
  
  { "Lat" : -13.198353, "Lon" : -45.902822, "value" : 48 },
  
  { "Lat" : -13.201324, "Lon" : -45.903300, "value" : 48 }
];
//Montando dados do geoJSON no formato lon e lat
var featuresP = data.map(i => {return {
  type: "Feature",
  properties: {
    "value": i.value
  },
  geometry: {
    type: "Point",
    coordinates: [i.Lon, i.Lat]
  }
}});

var points = turf.featureCollection(featuresP);

//boundaries = turf.featureCollection(boundaries);

//Montado paramentros e chamando função para interpolação dos dados

var interpolate_options = {
  gridType: "points",
  property: "value",
  units: "degrees",
  weight: 10
};
//O segundo paramentro define a precisão/detalhes da interpolação das linhas (como os pixels de outras ferramentas)
let grid = turf.interpolate(points, 0.0005, interpolate_options);
grid.features.map((i) => (i.properties.value = i.properties.value.toFixed(2)));

var isobands_options = {
  zProperty: "value",
  commonProperties: {
    "fill-opacity": 0.8
  },
  breaksProperties: [ /*
    {fill: "#001dff"},// 0-5
    {fill: "#005eff"},// 5-10
    {fill: "#0091ff"},// 10-15
    {fill: "#164a00"},// 15-20
    {fill: "#1e6400"},// 20-25
    {fill: "#247900"},// 25-30
    {fill: "#298900"},// 30-35
    {fill: "#2c9300"},// 35-40
    {fill: "#30a100"},// 40-45
    {fill: "#3ac300"},// 45-50
    {fill: "#41db00"},// 50-55
    {fill: "#aaff00"},// 55-60
    {fill: "#fffb00"},// 60-65
    {fill: "#ffee00"},// 65-70
    {fill: "#ffe203"},// 70-75
    {fill: "#ffd500"},// 75-80
    {fill: "#ffc400"},// 80-85
    {fill: "#ff9100"},// 85-90
    {fill: "#ff4400"},// 90-95
    {fill: "#ff0000"} // 95-100 */
    {fill: "#bffffd"},// 0-5
    {fill: "#00e6ff"},// 5-10
    {fill: "#00b3ff"},// 10-15
    {fill: "#0084ff"},// 15-20
    {fill: "#0062ff"},// 20-25
    {fill: "#1d00ff"},// 25-30
    {fill: "#1a00c4"},// 30-35
    {fill: "#1900a8"},// 35-40
    {fill: "#4e0098"},// 40-45
    {fill: "#7002ab"},// 45-50
    {fill: "#86008b"}
  ]
};
//Chamando função de isobandas com o segundo parametro para agrupar os dados e definir a isobanda
let isobands = turf.isobands(
  grid,
  [0, 1, 3, 6, 12, 18, 30, 45, 60, 75, 90, 200],
  //[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
  isobands_options
);

boundaries = turf.flatten(boundaries);
isobands = turf.flatten(isobands);

let features = [];

// criando interseção entre área da fazenda e isobandas
isobands.features.forEach(function (layer1) {
  boundaries.features.forEach(function (layer2) {
    let intersection = null;
    try {
      intersection = turf.intersect(layer1, layer2);
    } catch (e) {
      layer1 = turf.buffer(layer1, 0);
      intersection = turf.intersect(layer1, layer2);
    }
    if (intersection != null) {
      intersection.properties = layer1.properties;
      intersection.id = Math.random() * 100000;
      features.push(intersection);
    }
  });
});

let intersection = turf.featureCollection(features);

  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng, setLng] = useState(-46.036335)
  const [lat, setLat] = useState(-13.215800)
  const [zoom, setZoom] = useState(9)

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
    container: mapContainer.current,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [lng, lat],
    zoom: zoom
    });
  })

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4))
      setLat(map.current.getCenter().lat.toFixed(4))
      setZoom(map.current.getZoom().toFixed(2))
    })
  })
  
  return (
    <>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>    
      <div>
        <div ref={mapContainer} className="map-container" />
      </div>
    </>
  );
}

export default App;
