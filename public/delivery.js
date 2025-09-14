window.initMap = function() {
  function start(center) {
    new google.maps.Map(document.getElementById('map'), { center: center, zoom: 12 });
  }
  function geoFallback() {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => start({ lat: d.latitude, lng: d.longitude }))
      .catch(() => start({ lat: -33.9249, lng: 18.4241 }));
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      start({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    }, geoFallback);
  } else {
    geoFallback();
  }
};
