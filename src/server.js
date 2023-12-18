// require("dotenv").config();
require("dotenv").config({ path: "../.env" });
const express = require("express");
const axios = require('axios');
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3030;

const spotifyAuthUrl = "https://accounts.spotify.com/authorize";

app.listen(3000, () => console.log("Server is running on localhost:3000"));

// console.log(process.env);

app.get("/auth/spotify", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID,
    redirect_uri: "http://localhost:3000/auth/spotify/callback",
    scope: "playlist-read-private playlist-modify-private",
    response_type: "code",
  });

  const authUrl = `${spotifyAuthUrl}?${params.toString()}`;

  // console.log("authUrl:");
  // console.log(authUrl);

  // Redirect to Spotify authorization page
  res.redirect(authUrl);
});
const tokens = {};


app.get('/auth/spotify/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Error: Missing authorization code');
  }

  // Spotify Token Endpoint URL
  const spotifyTokenUrl = 'https://accounts.spotify.com/api/token';

  // Spotify API credentials
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = 'http://localhost:3000/auth/spotify/callback';

  try {
    // Exchange the authorization code for an access token and refresh token
    const response = await axios.post(
      spotifyTokenUrl,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Extract tokens from the response
    const { access_token, refresh_token } = response.data;

    // Store tokens in the in-memory data structure (simplified for POC)
    tokens.spotify = {
      access_token,
      refresh_token,
    };

    console.log('Spotify tokens:', tokens.spotify);

    // TODO: Store the tokens securely in a production environment

    res.send('Spotify authentication successful');
  } catch (error) {
    console.error('Error exchanging Spotify authorization code:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/spotify/playlists', async (req, res) => {
  // Ensure that there is a Spotify access token
  if (!tokens.spotify || !tokens.spotify.access_token) {
    return res.status(401).send('Error: Spotify access token not available');
  }

  
  const SPOTIFY_API_BASE_URL = 'https://api.spotify.com';
  const SPOTIFY_ME_ENDPOINT = '/v1/me';
  const SPOTIFY_PLAYLISTS_ENDPOINT = '/playlists';
  // Make an authenticated request to Spotify API to get user's playlists
  try {
    const response = await axios.get(`${SPOTIFY_API_BASE_URL}${SPOTIFY_ME_ENDPOINT}${SPOTIFY_PLAYLISTS_ENDPOINT}`, {
      headers: {
        Authorization: `Bearer ${tokens.spotify.access_token}`,
      },
    });

    const playlists = response.data.items;
    res.json(playlists);
  } catch (error) {
    console.error('Error fetching Spotify playlists:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const youtubeAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";

app.get("/auth/youtube", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.YOUTUBE_CLIENT_ID,
    redirect_uri: "http://localhost:3000/auth/youtube/callback",
    scope: "https://www.googleapis.com/auth/youtube",
    response_type: "code",
  });

  const authUrl = `${youtubeAuthUrl}?${params.toString()}`;

  // console.log("authUrl:");
  // console.log(authUrl);

  // Redirect to Spotify authorization page
  res.redirect(authUrl);
});

app.get("/auth/youtube/callback", async (req, res) => {
  const { code } = req.query;
  // TODO: Exchange the code for an access token and refresh token
  // Use axios or another HTTP library to make requests to the YouTube API
  // Handle the response and store the tokens securely
  // For simplicity, we won't implement token exchange in this POC
  res.send("YouTube authentication callback");
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// const { createProxyMiddleware } = require('http-proxy-middleware');

// if (process.env.NODE_ENV !== 'production') {
//   app.use(
//     '/src',
//     createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true })
//   );
// } else {
//   // Serve static files from the React app
//   app.use(express.static(path.join(__dirname, '../vite-project/dist')));
// }
// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, "../vite-project/dist")));

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../vite-project/dist", "index.html"));
// });
