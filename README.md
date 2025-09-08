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

- **Windows (PowerShell)**

  ```powershell
  $env:MONGODB_URI="mongodb://localhost:27017/taxi"
  npm start
  ```

Use the URI of a MongoDB server you control. For a local database, the string above creates/uses a database named `taxi` on `localhost`. For hosted services like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), obtain the connection string from your dashboard's **Connect** button and substitute it for the examples above.

### Broadcasting from your phone

1. Ensure your phone and the computer running the server are on the same network. Use the computer's IP address instead of `localhost` if needed (e.g. `http://192.168.1.10:3000/taxi.html`).
2. Open `taxi.html` in the phone's browser and allow location access.
3. Enter a taxi **ID** and optionally the **route** it is on, then tap **Share Location**. Leave the page open; it will continuously post your GPS coordinates to `/api/taxis`.
4. Visit the main map at `http://localhost:3000` from any browser to see the phone's location rendered as a taxi marker.

### Testing the site

Navigate to `http://localhost:3000` in a browser to view the map with routes. Click a route to see fare, hand signals, stops and time information.

### Editing and adding routes

#### Web editor
Open `http://localhost:3000/routes.html` to draw or modify routes directly on a map. Click to add points, then press **Snap to Roads** to align the path using the Google Roads API before saving. Choosing an existing route from the drop-down loads it for editing; saving replaces it, and leaving the selector on `-- new route --` creates a fresh route.

#### Manual JSON editing
Routes are also stored in `data/routes.json`. To change an existing route by hand, edit this file directly and adjust fields such as `stops`, `fare` or the `path` array of `[lat, lng]` points. Refresh the browser (or restart the server) to see the changes.

To add a brand new route programmatically, send a POST request:

```bash
curl -X POST http://localhost:3000/api/routes \
  -H "Content-Type: application/json" \
  -d '{"id":"route3","name":"Custom","fare":10,"handSignal":"Thumb up","stops":["A","B"],"frequency":0.5,"loadingTimes":{"first":"05:00","last":"21:00","rush":[],"quiet":[]},"path":[[-33.9,18.4],[-33.91,18.41]]}'
```

Newly added routes are appended to `data/routes.json` and appear on the map after a refresh.

### Snapping routes to roads

`routes.html` automatically uses the [Google Roads API](https://developers.google.com/maps/documentation/roads/snap) when you click **Snap to Roads**, so the saved path follows actual streets. If you prefer scripting, you can call the endpoint yourself:

```bash
curl 'https://roads.googleapis.com/v1/snapToRoads?path=-33.9,18.4|-33.91,18.41&key=YOUR_API_KEY'
```

Replace `YOUR_API_KEY` with a valid Maps API key, then copy the snapped latitude/longitude pairs into the `path` array in `data/routes.json` or your POST payload.

## Notes

This is a minimal demonstration; taxi positions reset when the server restarts unless MongoDB is configured.

