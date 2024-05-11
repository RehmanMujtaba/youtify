import { AuthorizationCode } from 'simple-oauth2';
import dotenv from 'dotenv';


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
  const authorizationUri = spotifyAuth.authorizeURL({
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    scope: ['user-read-email', 'user-read-private', 'playlist-modify-private'],
  });

  res.redirect(authorizationUri);
}
