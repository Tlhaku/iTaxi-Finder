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

Replace `YOUR_API_KEY` in `public/index.html` with a [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key). Then start the server:

```bash
npm start
```

This serves the web site at `http://localhost:3000`.

To persist taxi locations, set the environment variable `MONGODB_URI` to a running MongoDB instance before starting the server.

### Acting as a taxi

Open `http://localhost:3000/taxi.html` on a phone (connected to the same network) and allow location access. Enter an ID and optionally a route identifier. The page will send your GPS position to the server so that the main map shows a live taxi marker.

### Testing the site

Navigate to `http://localhost:3000` in a browser to view the map with routes. Click a route to see fare, hand signals, stops and time information.

### Adding custom routes

Routes are stored in `data/routes.json`. To add a route without editing files, send a POST request:

```bash
curl -X POST http://localhost:3000/api/routes \
  -H "Content-Type: application/json" \
  -d '{"id":"route3","name":"Custom","fare":10,"handSignal":"Thumb up","stops":["A","B"],"frequency":0.5,"loadingTimes":{"first":"05:00","last":"21:00","rush":[],"quiet":[]},"path":[[-33.9,18.4],[-33.91,18.41]]}'
```

Newly added routes are appended to `data/routes.json` and appear on the map after a refresh.

## Notes

This is a minimal demonstration; taxi positions reset when the server restarts unless MongoDB is configured.
