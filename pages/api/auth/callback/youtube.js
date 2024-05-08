// pages/api/auth/callback/youtube.js
import { AuthorizationCode } from 'simple-oauth2';
import dotenv from 'dotenv';

import { setTokenCookies } from '../../../../utility/cookies';

dotenv.config();

const youtubeAuth = new AuthorizationCode({
  client: {
    id: process.env.YOUTUBE_CLIENT_ID,
    secret: process.env.YOUTUBE_CLIENT_SECRET,
  },
  auth: {
    tokenHost: 'https://accounts.google.com',
    authorizePath: '/o/oauth2/auth',
    tokenPath: '/o/oauth2/token',
  },
});

export default async function handler(req, res) {
  const { code } = req.query;

  try {
    const tokenParams = {
      code,
      redirect_uri: process.env.YOUTUBE_REDIRECT_URI,
    };

    const accessToken = await youtubeAuth.getToken(tokenParams);
    const { token } = youtubeAuth.createToken(accessToken);

    setTokenCookies(res, accessToken.token.access_token, accessToken.token.refresh_token);

    res.redirect('/');
  } catch (error) {
    console.error('Access Token Error:', error.message);
    res.status(500).json('Authentication failed');
  }
}
