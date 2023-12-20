// index.js (Node.js server-side code)
require('dotenv').config();

const express = require('express');
const cors = require('cors');

let fetch;

(async () => {
  fetch = (await import('node-fetch')).default;
})();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
// Or if you need to restrict it to specific origins:
// app.use(cors({ origin: 'http://yourfrontenddomain.com' }));

// Enable CORS for your client-side app, replace '*' with your actual client-side URL in production
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Serve static files from the 'public' directory (where your front-end code is)
app.use(express.static('public'));

// Endpoint to fetch Google reviews
app.get('/fetch-google-reviews', async (req, res) => {
    const placeId = req.query.placeid;
    
    const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${process.env.GOOGLE_API_KEY}&reviews_sort=newest`;

    console.log("Fetching Google reviews for place ID:", placeId); // Log place ID

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log("Response from Google API:", data); // Log the full response

        res.json(data);
    } catch (error) {
        console.error('Error fetching Google reviews:', error);
        res.status(500).json({ error: 'Error fetching reviews' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
