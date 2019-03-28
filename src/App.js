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
      center: [-94.3902, 35.3937]
    })

    map.on('load', function() {
      // cables and strand counts
      map.addSource('cables', {
        type: 'vector',
        url: 'mapbox://conexon-design.a13fpb9r'
      })

      const cableSourceLayer = 'avecc_cable-4f5knl'

      // cables (lines)
      map.addLayer({
        id: 'cables',
        type: 'line',
        source: 'cables',
        'source-layer': cableSourceLayer,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-width': {
            property: 'cableSize',
            stops: [
              [{ value: 12, zoom: 13 }, 1.25],
              [{ value: 24, zoom: 13 }, 1.5],
              [{ value: 48, zoom: 13 }, 1.75],
              [{ value: 96, zoom: 13 }, 2]
            ]
          },
          'line-color': {
            property: 'class',
            type: 'categorical',
            stops: [['A', 'blue'], ['U', 'brown']]
          }
        }
      })

      // cable-strand count (text)
      map.addLayer({
        id: 'cableStrandCounts',
        type: 'symbol',
        source: 'cables',
        'source-layer': cableSourceLayer,
        paint: {
          'text-color': 'black'
        },
        layout: {
          'text-field': '{cableSize}',
          'symbol-placement': 'line',
          'text-allow-overlap': true,
          'text-justify': 'center',
          'text-rotation-alignment': 'viewport',
          'text-size': {
            base: 1,
            stops: [[12, 8], [13, 9], [14, 10], [15, 12], [16, 14]]
          }
        }
      })

      // splice cans and substations
      map.addSource('splicePointsAndSubstations', {
        type: 'vector',
        url: 'mapbox://conexon-design.10b9jbcd'
      })

      const spliceCansAndSubtationsSourceLayer = 'avecc_splicepoints-4eofp4'

      // splice cans (bowtie symbol)
      map.addLayer({
        id: 'spliceCans',
        type: 'symbol',
        source: 'splicePointsAndSubstations',
        'source-layer': spliceCansAndSubtationsSourceLayer,
        filter: ['all', ['==', 'Subtype', 1]],
        layout: {
          'icon-image': 'blue-bowtie-15',
          'icon-allow-overlap': true,
          'icon-size': {
            stops: [[12, 0.4], [13, 0.5], [14, 0.8], [15, 0.9], [16, 1]]
          }
        }
      })

      // substations (black squares)
      map.addLayer({
        id: 'substations',
        type: 'symbol',
        source: 'splicePointsAndSubstations',
        'source-layer': spliceCansAndSubtationsSourceLayer,
        filter: ['all', ['==', 'Subtype', 4]],
        layout: {
          'icon-image': 'black-square-15',
          'icon-allow-overlap': true,
          'icon-size': {
            base: 0.5,
            stops: [[12, 0.75], [13, 1.25], [14, 1.75], [15, 2.25], [16, 3.75]]
          }
        }
      })

      // tubes and strands
      map.addSource('tubesAndStrands', {
        type: 'vector',
        url: 'mapbox://conexon-design.21pxqp4z'
      })

      const tubesAndStrandsSourceLayer = 'avecc_equipmentdisp-466p7e'

      // tubes (symbols)
      // symbols are used to represent tubes based on the tap_ports value
      // 2 = circle
      // 4 = square
      // 8 = octagon
      map.addLayer({
        id: 'tubes',
        type: 'symbol',
        source: 'tubesAndStrands',
        'source-layer': tubesAndStrandsSourceLayer,
        layout: {
          'icon-allow-overlap': true,
          'icon-image': [
            // get the tubes color to use the correct image
            // eg blue-circle-15 or rose-octagon-15
            'step',
            ['get', 'tap_ports'],
            ['concat', ['get', 'tubes'], '-circle-15'], // default
            2,
            ['concat', ['get', 'tubes'], '-circle-15'],
            4,
            ['concat', ['get', 'tubes'], '-square-15'],
            8,
            ['concat', ['get', 'tubes'], '-octagon-15']
          ],
          'icon-size': {
            base: 0.5,
            stops: [[12, 0.5], [13, 1], [14, 1.25], [15, 1.75], [16, 2]]
          }
        }
      })

      // strands (circles)
      map.addLayer({
        id: 'stands',
        type: 'circle',
        source: 'tubesAndStrands',
        'source-layer': tubesAndStrandsSourceLayer,
        paint: {
          'circle-color': [
            // most colors translate to HTML named colors
            // slate and rose do not, so we convert them
            'case',
            ['==', ['get', 'strands'], 'slate'],
            'slategray',
            ['==', ['get', 'strands'], 'rose'],
            'mistyrose',
            ['get', 'strands']
          ],
          'circle-radius': {
            base: 0.9,
            stops: [[12, 1], [13, 4], [14, 6], [15, 7], [16, 10]]
          }
        }
      })

      // add zoom and rotation controls to the map.
      map.addControl(new mapboxgl.NavigationControl())
    })

    // remove the map when component unmounts
    return function cleanUp() {
      map.remove()
    }
  })

  return <div id="map" ref={mapDiv} />
}

export default App
