// pages/api/user/youtube-profile.js
import axios from 'axios';

export default async function handler(req, res) {
  try {
    // Get access token from cookie
    const youtubeAccessToken = req.cookies.youtubeAccessToken;

    if (!youtubeAccessToken) {
      return res.status(401).json({ message: 'Access token not found' });
    }

    // Fetch YouTube profile using access token
    const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: {
        part: 'snippet,contentDetails,statistics',
        mine: true,
        access_token: youtubeAccessToken,
      },
    });

    if (response.data.items.length === 0) {
      return res.status(404).json({ message: 'YouTube profile not found' });
    }

    const youtubeProfile = response.data.items[0].snippet;
    res.status(200).json(youtubeProfile);
  } catch (error) {
    console.error('Error fetching YouTube profile:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request data:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message);
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}