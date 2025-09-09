var app = angular.module('TaxiFinderApp', []);
app.controller('MapCtrl', function($scope, $http, $interval) {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -33.9249, lng: 18.4241 },
    zoom: 12
  });


  var routePolylines = {};
  $http.get('/api/routes').then(function(res) {
    $scope.routes = res.data;
    res.data.forEach(function(route) {
      var color = getColor(route.frequency);
      var path = route.path.map(function(p) { return { lat: p[0], lng: p[1] }; });
      var line = new google.maps.Polyline({
        path: path,
        strokeColor: color,
        map: map
      });
      routePolylines[route.id] = line;
      line.addListener('click', function() {

        $scope.$apply(function() { $scope.selected = route; });
      });
    });
  });

  $scope.focusRoute = function(route) {
    var line = routePolylines[route.id];
    if (line) {
      var bounds = new google.maps.LatLngBounds();
      line.getPath().forEach(function(p) { bounds.extend(p); });
      map.fitBounds(bounds);
      $scope.selected = route;
    }
  };

  function refreshTaxis() {
    $http.get('/api/taxis').then(function(res) {
      if ($scope.taxiMarkers) {
        $scope.taxiMarkers.forEach(function(m) { m.setMap(null); });
      }
      $scope.taxiMarkers = res.data.map(function(t) {
        return new google.maps.Marker({
          position: { lat: t.lat, lng: t.lng },
          map: map,
          title: 'Taxi ' + t.id + ' (' + (t.routeId || 'n/a') + ')'
        });

      });
    });
  }
  refreshTaxis();
  $interval(refreshTaxis, 5000);

  function getColor(freq) {
    var r = Math.round(255 * freq).toString(16).padStart(2, '0');
    var b = Math.round(255 * (1 - freq)).toString(16).padStart(2, '0');
    return '#' + r + '00' + b;

  }
});
