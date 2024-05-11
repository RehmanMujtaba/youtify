import axios from 'axios';

export default async function handler(req, res) {
  try {
    const spotifyAccessToken = req.cookies.spotifyAccessToken;

    if (!spotifyAccessToken) {
      return res.status(401).json({ message: 'Access token6 not found' });
    }

    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    });

    const spotifyProfile = response.data;
    res.status(200).json(spotifyProfile);
  } catch (error) {
    console.error('Error fetching Spotify profile:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}