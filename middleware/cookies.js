// middleware/cookies.js
import { cookie } from 'cookie';

export function cookies(req, res, next) {
  req.cookies = cookie.parse(req.headers.cookie || '');
  next();
}