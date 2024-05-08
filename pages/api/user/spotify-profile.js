import axios from 'axios';
import { getTokenFromCookies } from '../../../utility/cookies';

export default async function handler(req, res) {
  try {
    // Extract the access token from cookies
    const { accessToken } = getTokenFromCookies(req);
    console.log('accessToken:', accessToken);

    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userProfile = response.data;
    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
}
