// pages/api/auth/youtube.js
import { AuthorizationCode } from 'simple-oauth2';
import dotenv from 'dotenv';

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
  const authorizationUri = youtubeAuth.authorizeURL({
    redirect_uri: process.env.YOUTUBE_REDIRECT_URI,
    scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
    response_type: 'code',
  });

  res.redirect(authorizationUri);
}
