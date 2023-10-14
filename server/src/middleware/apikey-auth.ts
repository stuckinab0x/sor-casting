import { RequestHandler } from 'express';
import environment from '../environment';
import { getActiveTokens } from './frontend-auth';

const apiKeyAuth: RequestHandler = (req, res, next) => {
  if (req.headers.authorization === environment.apiKey)
    return next();
  const activeTokens = getActiveTokens();
  if (req.cookies.rehearsalmanagertoken && activeTokens.includes(req.cookies.rehearsalmanagertoken))
    return next();
  res.status(401);
  res.end();
}

export default apiKeyAuth;
