// pages/api/auth/callback/spotify.js
import { AuthorizationCode } from 'simple-oauth2';
import dotenv from 'dotenv';
import { setCookie } from 'utility/cookies';

dotenv.config();

const spotifyAuth = new AuthorizationCode({
  client: {
    id: process.env.SPOTIFY_CLIENT_ID,
    secret: process.env.SPOTIFY_CLIENT_SECRET,
  },
  auth: {
    tokenHost: 'https://accounts.spotify.com',
    authorizePath: '/authorize',
    tokenPath: '/api/token',
  },
});

export default async function handler(req, res) {
  const { code } = req.query;

  try {
    const tokenParams = {
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    };

    const accessToken = await spotifyAuth.getToken(tokenParams);
    setCookie('spotifyAccessToken', accessToken, { expires: 7, secure: true });

    res.redirect('/');
  } catch (error) {
    console.error('Access Token Error:', error.message);
    res.status(500).json('Authentication failed');
  }
}
