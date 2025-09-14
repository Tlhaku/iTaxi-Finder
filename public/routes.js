let map, polyline;
let path = [];
let redoStack = [];
let routesData = [];
const select = document.getElementById('existingRoutes');

window.initMap = function() {
  function start(center) {
    map = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: 12
    });
    polyline = new google.maps.Polyline({ map, path: [] });

    map.addListener('click', e => {
      path.push(e.latLng);
      redoStack = [];
      polyline.setPath(path);
    });

    fetch('/api/routes').then(r => r.json()).then(routes => {
      routesData = routes;
      const blank = document.createElement('option');
      blank.value = '';
      blank.textContent = '-- new route --';
      select.appendChild(blank);
      routesData.forEach(rt => {
        const opt = document.createElement('option');
        opt.value = rt.id;
        opt.textContent = rt.name;
        select.appendChild(opt);
      });
      select.addEventListener('change', () => loadRoute(select.value));
    });
  }

  function geoFallback() {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => start({ lat: data.latitude, lng: data.longitude }))
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

function loadRoute(id) {
  const route = routesData.find(r => r.id === id);
  document.getElementById('routeId').value = route ? route.id : '';
  document.getElementById('routeName').value = route ? route.name : '';
  document.getElementById('routeFreq').value = route && route.frequency !== undefined ? route.frequency : '';
  path = route ? route.path.map(p => new google.maps.LatLng(p[0], p[1])) : [];
  redoStack = [];
  polyline.setPath(path);
  if (path.length) {
    const bounds = new google.maps.LatLngBounds();
    path.forEach(p => bounds.extend(p));
    map.fitBounds(bounds);
  }
}

document.getElementById('snap').addEventListener('click', () => {
  if (path.length === 0) return;
  const body = { path: path.map(p => ({ lat: p.lat(), lng: p.lng() })) };
  fetch('/api/roads/snap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(r => r.json()).then(data => {
    if (!data.snappedPoints) return;
    path = data.snappedPoints.map(p => new google.maps.LatLng(p.location.latitude, p.location.longitude));
    polyline.setPath(path);
  });
});

document.getElementById('routeForm').addEventListener('submit', e => {
  e.preventDefault();
  const body = {
    id: document.getElementById('routeId').value,
    name: document.getElementById('routeName').value,
    frequency: parseFloat(document.getElementById('routeFreq').value) || 0,
    path: path.map(p => [p.lat(), p.lng()])
  };
  const existingId = document.getElementById('existingRoutes').value;
  const method = existingId && existingId === body.id ? 'PUT' : 'POST';
  const url = method === 'POST' ? '/api/routes' : `/api/routes/${encodeURIComponent(body.id)}`;
  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(() => {
    if (method === 'POST') {
      routesData.push(body);
      const opt = document.createElement('option');
      opt.value = body.id;
      opt.textContent = body.name;
      select.appendChild(opt);
      select.value = body.id;
    } else {
      const idx = routesData.findIndex(r => r.id === body.id);
      if (idx > -1) routesData[idx] = body;
    }
    alert('Saved route');
  });
});

document.getElementById('undo').addEventListener('click', () => {
  if (path.length === 0) return;
  const last = path.pop();
  redoStack.push(last);
  polyline.setPath(path);
});

document.getElementById('redo').addEventListener('click', () => {
  if (redoStack.length === 0) return;
  const point = redoStack.pop();
  path.push(point);
  polyline.setPath(path);
});

document.getElementById('clear').addEventListener('click', () => {
  path = [];
  redoStack = [];
  polyline.setPath(path);
});

document.getElementById('delete').addEventListener('click', () => {
  const id = select.value;
  if (!id) return;
  if (!confirm('Delete this route?')) return;
  fetch(`/api/routes/${encodeURIComponent(id)}`, { method: 'DELETE' })
    .then(() => {
      const idx = routesData.findIndex(r => r.id === id);
      if (idx > -1) routesData.splice(idx, 1);
      const opt = select.querySelector(`option[value="${id}"]`);
      if (opt) opt.remove();
      select.value = '';
      loadRoute('');
    });
});

document.getElementById('cancel').addEventListener('click', () => {
  redoStack = [];
  loadRoute(select.value);
});

document.getElementById('togglePanel').addEventListener('click', () => {
  document.getElementById('helpPanel').classList.toggle('hidden');
});

document.getElementById('closePanel').addEventListener('click', () => {
  document.getElementById('helpPanel').classList.add('hidden');
});

// hide UI toggle
document.getElementById('hideUi').addEventListener('click', () => {
  document.body.classList.toggle('hidden-ui');
});
