var map = L.map('map').setView([40.75911419157821, -73.98964318821668], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

L.marker([40.75911419157821, -73.98964318821668]).addTo(map)
    .bindPopup("Birdland, New York")
    .openPopup();

L.circle([40.75911419157821, -73.98964318821668], {
    color: 'blue',
    fillColor: '#30f',
    fillOpacity: 0.3,
    radius: 100
}).addTo(map);