const express = require('express');
const app = express();
const axios = require('axios');

// Import routes
const accessoriesRoutes = require('./routes/accessories');
app.use('/api/accessories', accessoriesRoutes);

axios.get("http://localhost:5000/api/accessories")
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error('There was an error!', error);
    });

module.exports = app;