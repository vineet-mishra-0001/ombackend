const app = require('../app'); // Adjust if app is named differently
const serverless = require('serverless-http');

module.exports.handler = serverless(app);
