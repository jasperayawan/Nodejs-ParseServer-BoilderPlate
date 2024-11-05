const express = require('express');
const { ParseServer } = require('parse-server');
const ParseDashboard = require('parse-dashboard')
const config = require('./config');

// import routes here

const userRoutes = require('../routes/user.route')

const app = express();

const api = new ParseServer({
  databaseURI: config.mongoURI,
  appId: config.appId,
  masterKey: config.masterKey,
  serverURL: config.serverURL,
  allowClientClassCreation: false,  // Optional for production security
});

const dashboardConfig = new ParseDashboard({
    apps: [
      {
        appId: config.appId,
        masterKey: config.masterKey,
        serverURL: config.serverURL,
        appName: config.appName,
      },
    ],
  }, { allowInsecureHTTP: true });

await api.start();

// Mount Parse API at the `/parse` endpoint
app.use('/parse', api.app);
app.use('/dashboard', dashboardConfig);

app.use('/api/user', userRoutes)

// Root endpoint to check server status
app.get('/', (req, res) => {
  res.send('Parse Server is running');
});

// Start the server
app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
});
