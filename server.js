const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');
const fs = require('fs');


const app = express();
app.use(cors());
app.use(express.json());

const routesPath = path.join(__dirname, 'data', 'routes.json');
let routes = require('./data/routes.json');

let taxis = {};
let taxiCollection;

if (process.env.MONGODB_URI) {
  MongoClient.connect(process.env.MONGODB_URI)
    .then(client => {
      taxiCollection = client.db().collection('taxis');
      console.log('Connected to MongoDB');
    })
    .catch(err => console.error('Mongo connection error', err));
}

app.get('/api/routes', (req, res) => {
  res.json(routes);
});

app.post('/api/routes', (req, res) => {
  const route = req.body;
  if (!route.id || !route.name || !Array.isArray(route.path)) {
    return res.status(400).json({ error: 'id, name and path required' });
  }
  routes.push(route);
  fs.writeFile(routesPath, JSON.stringify(routes, null, 2), err => {
    if (err) {
      return res.status(500).json({ error: 'failed to save route' });
    }
    res.json({ status: 'ok' });
  });
});

app.get('/api/taxis', async (req, res) => {
  if (taxiCollection) {
    const list = await taxiCollection.find().toArray();
    res.json(list);
  } else {
    res.json(Object.values(taxis));
  }
});

app.post('/api/taxis', async (req, res) => {
  const { id, lat, lng, routeId } = req.body;
  if (!id || lat === undefined || lng === undefined) {
    return res.status(400).json({ error: 'id, lat and lng required' });
  }
  const taxi = { id, lat, lng, routeId, timestamp: Date.now() };
  taxis[id] = taxi;
  if (taxiCollection) {
    await taxiCollection.updateOne({ id }, { $set: taxi }, { upsert: true });
  }
  res.json({ status: 'ok' });
});

app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
