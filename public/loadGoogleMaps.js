(async function() {
  try {
    const res = await fetch('/config');
    const cfg = await res.json();
    if (cfg.googleMapsApiKey) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${cfg.googleMapsApiKey}&callback=initMap`;
      script.async = true;
      document.head.appendChild(script);
    } else {
      console.error('Google Maps API key not provided');
    }
  } catch (e) {
    console.error('Failed to load Maps', e);
  }
})();
