import { RequestHandler } from 'express';
import environment from '../environment';

const apiKeyAuth: RequestHandler = (req, res, next) => {
  if (req.headers.authorization === environment.apiKey)
    return next();
  res.status(401);
  res.end();
}

export default apiKeyAuth;
