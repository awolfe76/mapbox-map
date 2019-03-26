import React, { useEffect, useRef } from 'react'
import './App.css'

import mapboxgl from 'mapbox-gl'

const App = () => {
  const mapDiv = useRef(null)
  mapboxgl.accessToken =
    'pk.eyJ1IjoiY29uZXhvbi1kZXNpZ24iLCJhIjoiY2pvdzZlb2djMXVhOTN3bmhpYzk3NndoZCJ9.On4IrAd0sgmmgd_sAqg_Gg'

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapDiv.current,
      hash: true,
      style: 'mapbox://styles/conexon-design/cjow6vt3sax7q2rpbj5wm7s84',
      zoom: 10.46,
      center: [-94.3158, 35.3941]
    })

    return function cleanUp() {
      map.remove()
    }
  })

  return <div id="map" ref={mapDiv} />
}

export default App
