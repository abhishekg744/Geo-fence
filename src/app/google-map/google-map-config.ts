export let MapConfig = {
  Map_Center: '12.954154945908408, 77.64081755987168',
  Drawing_Manager: {
    Modes: ['polygon'],//['marker', 'circle', 'polygon', 'polyline', 'rectangle']
    circleOptions: {
      fillColor: '#ffff00',
      fillOpacity: 0.4,
      strokeWeight: 5,
      editable: true,
      zIndex: 1
    },
    polygonOptions: {
      fillColor: '#ffff00',
      fillOpacity: 0.3,
      strokeWeight: 3,
      editable: true,
      zIndex: 1
    },
  }
}