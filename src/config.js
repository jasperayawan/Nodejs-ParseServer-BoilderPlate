// src/config.js
require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGO_URI,
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY,
  serverURL: process.env.SERVER_URL,
  port: process.env.PORT || 1337,
  appName: process.env.APP_NAME
};
