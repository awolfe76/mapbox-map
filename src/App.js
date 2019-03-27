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

    // colors
    const blue = 'blue'
    const orange = 'orange'
    const green = 'green'
    const brown = 'brown'
    const slategray = 'slategray'
    const white = 'white'
    const red = 'red'
    const black = 'black'
    const yellow = 'yellow'
    const violet = 'violet'
    const rose = 'mistyrose'
    const aqua = 'aqua'
    const spanColor = '#800080'
    const tapColor = '#bababa' //'#c4c4c4'
    const spanAerial = '#551a8b' //purple
    const spanUnder = '#FFA500'
    const seqColor = '#A9A9A9' //'#FFA500'
    const strandTextColor = '#545454' //'#FFA500'
    const strandLineColor = '#dcdcdc' //'#FFA500'

    // cable - lines
    const cableUrl = 'mapbox://conexon-design.a13fpb9r'
    const cableSourceLayer = 'avecc_cable-4f5knl'

    map.on('load', function() {
      map.on('zoom', () => {
        //console.log(map.queryRenderedFeatures({ layers: ['tubes'] }))
      })

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

      // splice cans - bowties
      const splicePointUrl = 'mapbox://conexon-design.10b9jbcd'
      const splicePointSourceLayer = 'avecc_splicepoints-4eofp4'

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

      // taps and strands
      const tapURL = 'mapbox://conexon-design.21pxqp4z'
      const tapSourceLayer = 'avecc_equipmentdisp-466p7e'

      map.addLayer({
        id: 'tubes',
        type: 'circle',
        source: {
          type: 'vector',
          url: tapURL
        },
        'source-layer': tapSourceLayer,
        paint: {
          'circle-radius': {
            base: 2,
            stops: [[12, 2], [13, 6], [14, 8], [15, 9], [16, 12]]
          },
          'circle-stroke-width': 3,
          // slategray and mistyrose come in a slate and rose
          // so we have logic to render the correct HTML 'named' color
          // otherwise just output the property color
          'circle-stroke-color': [
            'case',
            ['==', ['get', 'tubes'], 'slate'],
            'slategray',
            ['==', ['get', 'tubes'], 'rose'],
            'mistyrose',
            ['get', 'tubes']
          ],
          'circle-color': [
            'case',
            ['==', ['get', 'strands'], 'slate'],
            'slategray',
            ['==', ['get', 'strands'], 'rose'],
            'mistyrose',
            ['get', 'strands']
          ]
        }
      })
    })

    return function cleanUp() {
      map.remove()
    }
  })

  return <div id="map" ref={mapDiv} />
}

export default App
