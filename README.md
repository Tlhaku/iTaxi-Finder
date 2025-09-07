iTaxi Finder
============

A simple MEAN-stack style demo that displays South African mini-bus taxi routes with colour-coded frequencies and live taxi locations. The project uses a Node/Express backend, AngularJS front-end and the free Google Maps JavaScript API. Taxi positions are kept in memory by default but can use MongoDB when `MONGODB_URI` is provided.


## Setup

1. Install [Node.js](https://nodejs.org/) (v18 or later recommended).
2. Clone this repository and install dependencies:

```bash
npm install
```

## Running locally


The repository is configured with a demo Google Maps API key in `public/index.html`.
You can replace it with your own [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key)
if desired. Start the server with:


```bash
npm start
```

This serves the web site at `http://localhost:3000`.

To persist taxi locations, set the environment variable `MONGODB_URI` to a running MongoDB instance before starting the server.

### Acting as a taxi

Open `http://localhost:3000/taxi.html` on a phone (connected to the same network) and allow location access. Enter an ID and optionally a route identifier. The page will send your GPS position to the server so that the main map shows a live taxi marker.

### Testing the site

Navigate to `http://localhost:3000` in a browser to view the map with routes. Click a route to see fare, hand signals, stops and time information.

### Editing and adding routes

Routes are stored in `data/routes.json`. To change an existing route, edit this file directly and adjust fields such as `stops`, `fare` or the `path` array of `[lat, lng]` points. Refresh the browser (or restart the server) to see the changes.

To add a brand new route without touching files, send a POST request:

```bash
curl -X POST http://localhost:3000/api/routes \
  -H "Content-Type: application/json" \
  -d '{"id":"route3","name":"Custom","fare":10,"handSignal":"Thumb up","stops":["A","B"],"frequency":0.5,"loadingTimes":{"first":"05:00","last":"21:00","rush":[],"quiet":[]},"path":[[-33.9,18.4],[-33.91,18.41]]}'
```

Newly added routes are appended to `data/routes.json` and appear on the map after a refresh.

### Snapping routes to roads

The app draws coordinates exactly as provided. To align a path with streets, generate coordinates using the [Directions API](https://developers.google.com/maps/documentation/directions/get-directions) or the [Roads API Snap to Roads](https://developers.google.com/maps/documentation/roads/snap) endpoint and use the returned points in your route:

```bash
curl 'https://roads.googleapis.com/v1/snapToRoads?path=-33.9,18.4|-33.91,18.41&key=YOUR_API_KEY'
```

Replace `YOUR_API_KEY` with a valid Maps API key, then copy the snapped latitude/longitude pairs into the `path` array in `data/routes.json` or your POST payload.

## Notes

This is a minimal demonstration; taxi positions reset when the server restarts unless MongoDB is configured.

