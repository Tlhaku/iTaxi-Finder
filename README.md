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

To persist taxi locations, set the environment variable `MONGODB_URI` to your MongoDB connection string before starting the server.

Examples:

- **macOS/Linux**

  ```bash
  export MONGODB_URI="mongodb://localhost:27017/taxi"
  npm start
  ```

1. Ensure your phone and the computer running the server are on the same network. Use the computer's IP address instead of `localhost` if needed (e.g. `http://192.168.1.10:3000/taxi.html`).
2. Open `taxi.html` in the phone's browser and allow location access.
3. Enter a taxi **ID** and optionally the **route** it is on, then tap **Share Location**. Leave the page open; it will continuously post your GPS coordinates to `/api/taxis`.
4. Visit the main map at `http://localhost:3000` from any browser to see the phone's location rendered as a taxi marker.

### Testing the site

Navigate to `http://localhost:3000` in a browser to view the map with routes. Click a route to see fare, hand signals, stops and time information.

### Editing and adding routes


```bash
curl -X POST http://localhost:3000/api/routes \
  -H "Content-Type: application/json" \
  -d '{"id":"route3","name":"Custom","fare":10,"handSignal":"Thumb up","stops":["A","B"],"frequency":0.5,"loadingTimes":{"first":"05:00","last":"21:00","rush":[],"quiet":[]},"path":[[-33.9,18.4],[-33.91,18.41]]}'
```

Newly added routes are appended to `data/routes.json` and appear on the map after a refresh.

### Snapping routes to roads



```bash
curl 'https://roads.googleapis.com/v1/snapToRoads?path=-33.9,18.4|-33.91,18.41&key=YOUR_API_KEY'
```

Replace `YOUR_API_KEY` with a valid Maps API key, then copy the snapped latitude/longitude pairs into the `path` array in `data/routes.json` or your POST payload.

## Notes

This is a minimal demonstration; taxi positions reset when the server restarts unless MongoDB is configured.

