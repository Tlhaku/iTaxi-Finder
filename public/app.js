var app = angular.module('TaxiFinderApp', []);
app.controller('MapCtrl', function($scope, $http, $interval) {
  var map = L.map('map').setView([-33.9249, 18.4241], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  $http.get('/api/routes').then(function(res) {
    $scope.routes = res.data;
    res.data.forEach(function(route) {
      var color = getColor(route.frequency);
      var line = L.polyline(route.path, { color: color }).addTo(map);
      line.bindTooltip(route.name);
      line.on('click', function() {
        $scope.$apply(function() { $scope.selected = route; });
      });
    });
  });

  function refreshTaxis() {
    $http.get('/api/taxis').then(function(res) {
      if ($scope.taxiMarkers) {
        $scope.taxiMarkers.forEach(function(m) { map.removeLayer(m); });
      }
      $scope.taxiMarkers = res.data.map(function(t) {
        return L.marker([t.lat, t.lng]).addTo(map).bindTooltip('Taxi ' + t.id + ' (' + (t.routeId || 'n/a') + ')');
      });
    });
  }
  refreshTaxis();
  $interval(refreshTaxis, 5000);

  function getColor(freq) {
    var r = Math.round(255 * freq);
    var b = Math.round(255 * (1 - freq));
    return 'rgb(' + r + ',0,' + b + ')';
  }
});
