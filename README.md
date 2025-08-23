iTaxi Finder
============

A simple MEAN-stack style demo that displays South African mini-bus taxi routes with colour-coded frequencies and live taxi locations. The project uses a Node/Express backend, AngularJS front-end and Leaflet maps. Taxi positions are kept in memory by default but can use MongoDB when `MONGODB_URI` is provided.

## Setup

1. Install [Node.js](https://nodejs.org/) (v18 or later recommended).
2. Clone this repository and install dependencies:

```bash
npm install
```

## Running locally

Start the server:

```bash
npm start
```

This serves the web site at `http://localhost:3000`.

To persist taxi locations, set the environment variable `MONGODB_URI` to a running MongoDB instance before starting the server.

### Acting as a taxi

Open `http://localhost:3000/taxi.html` on a phone (connected to the same network) and allow location access. Enter an ID and optionally a route identifier. The page will send your GPS position to the server so that the main map shows a live taxi marker.

### Testing the site

Navigate to `http://localhost:3000` in a browser to view the map with routes. Click a route to see fare, hand signals, stops and time information.

## Notes

This is a minimal demonstration; route data is static and taxi positions reset when the server restarts (unless MongoDB is configured).
