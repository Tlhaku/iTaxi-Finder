const API_KEY = 'AIzaSyCYxFkL9vcvbaFz-Ut1Lm2Vge5byodujfk';
let map, polyline;
let path = [];
let routesData = [];
const select = document.getElementById('existingRoutes');

function init() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -33.9249, lng: 18.4241 },
    zoom: 12
  });
  polyline = new google.maps.Polyline({ map, path: [] });

  map.addListener('click', e => {
    path.push(e.latLng);
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

function loadRoute(id) {
  const route = routesData.find(r => r.id === id);
  document.getElementById('routeId').value = route ? route.id : '';
  document.getElementById('routeName').value = route ? route.name : '';
  document.getElementById('routeFreq').value = route && route.frequency !== undefined ? route.frequency : '';
  path = route ? route.path.map(p => new google.maps.LatLng(p[0], p[1])) : [];
  polyline.setPath(path);
  if (path.length) {
    const bounds = new google.maps.LatLngBounds();
    path.forEach(p => bounds.extend(p));
    map.fitBounds(bounds);
  }
}

document.getElementById('snap').addEventListener('click', () => {
  if (path.length === 0) return;
  const pathStr = path.map(p => `${p.lat()},${p.lng()}`).join('|');
  fetch(`https://roads.googleapis.com/v1/snapToRoads?path=${encodeURIComponent(pathStr)}&interpolate=true&key=${API_KEY}`)
    .then(r => r.json())
    .then(data => {
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
  path.pop();
  polyline.setPath(path);
});

document.getElementById('clear').addEventListener('click', () => {
  path = [];
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
  loadRoute(select.value);
});

document.getElementById('togglePanel').addEventListener('click', () => {
  document.getElementById('helpPanel').classList.toggle('hidden');
});

document.getElementById('closePanel').addEventListener('click', () => {
  document.getElementById('helpPanel').classList.add('hidden');
});

window.init = init;

if (window.google && google.maps) {
  init();
}
