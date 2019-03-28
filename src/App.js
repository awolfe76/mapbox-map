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
      map.on('zoom', () => {
        //console.log(map.queryRenderedFeatures({ layers: ['tubes'] }))
      })

      // cables (lines) and strand counts
      const cableUrl = 'mapbox://conexon-design.a13fpb9r'
      const cableSourceLayer = 'avecc_cable-4f5knl'

      map.addLayer({
        id: 'cable',
        type: 'line',
        source: {
          type: 'vector',
          url: cableUrl
        },
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
            stops: [['A', 'purple'], ['U', 'orange']]
          }
        }
      })

      // cable-strand count
      map.addLayer({
        id: 'cable-strand-count',
        type: 'symbol',
        source: {
          type: 'vector',
          url: cableUrl
        },
        'source-layer': cableSourceLayer,
        paint: {
          'text-color': 'black'
        },
        layout: {
          'text-field': '{cableSize}',
          'symbol-placement': 'line',
          'text-allow-overlap': true,
          //'text-offset': [0, -1],
          'text-justify': 'center',
          'text-rotation-alignment': 'viewport',
          'text-size': {
            base: 1,
            stops: [[12, 8], [13, 9], [14, 10], [15, 12], [16, 14]]
          }
        }
      })

      // splice cans (bowties) and substations
      const splicePointUrl = 'mapbox://conexon-design.10b9jbcd'
      const splicePointSourceLayer = 'avecc_splicepoints-4eofp4'

      // splice cans
      map.addLayer({
        id: 'spliceCan',
        type: 'symbol',
        source: {
          type: 'vector',
          url: splicePointUrl
        },
        'source-layer': splicePointSourceLayer,
        filter: ['all', ['==', 'Subtype', 1]],
        layout: {
          'icon-image': 'blue-bowtie-15',
          'icon-allow-overlap': true,
          'icon-size': {
            stops: [[12, 0.4], [13, 0.5], [14, 0.8], [15, 0.9], [16, 1]]
          }
        }
      })

      // substations
      map.addLayer({
        id: 'substations',
        type: 'symbol',
        source: {
          type: 'vector',
          url: splicePointUrl
        },
        'source-layer': splicePointSourceLayer,
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

      // taps and strands
      const tapURL = 'mapbox://conexon-design.21pxqp4z'
      const tapSourceLayer = 'avecc_equipmentdisp-466p7e'

      // tubes
      // symbols are used to represent tubes based on the tap_ports value
      // 2 = circle
      // 4 = square
      // 8 = octagon
      map.addLayer({
        id: 'tubes',
        type: 'symbol',
        source: {
          type: 'vector',
          url: tapURL
        },
        'source-layer': tapSourceLayer,
        layout: {
          'icon-allow-overlap': true,
          'icon-image': [
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

      // strands
      // stands are always circles
      map.addLayer({
        id: 'stands',
        type: 'circle',
        source: {
          type: 'vector',
          url: tapURL
        },
        'source-layer': tapSourceLayer,
        paint: {
          'circle-color': [
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

    return function cleanUp() {
      map.remove()
    }
  })

  return <div id="map" ref={mapDiv} />
}

export default App
