import { RequestHandler, Response } from 'express';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import AuthCode from '../models/auth-code';
import ManagerDataService from '../manager-data-service';

let authCode: AuthCode | null = null;
let timeout: NodeJS.Timeout | null = null;

export const newAuthCode = () => {
  clearTimeout(timeout);
  authCode = { code: Array.from(Array(6).keys()).map(() => String(Math.floor(Math.random() * 10))).join(''), created: new Date() };
  timeout = setTimeout(() => { authCode = null; }, 1000 * 60);
  return authCode;
};

const activeTokens: string[] = [];

const setToken = (res: Response) => {
  const active = uuidv4();
  activeTokens.push(active);
  res.cookie('rehearsalmanagertoken', active, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 15 });
};

function frontendAuth(managerDataService: ManagerDataService, nodeEnv: 'development' | 'production') {
  const middleWare: RequestHandler = async (req, res, next) => {
    if ((!req.cookies.rehearsalmanagertoken || !activeTokens.includes(req.cookies.rehearsalmanagertoken)) && nodeEnv === 'development') {
      setToken(res);
      return res.redirect('/');
    }

    if (req.cookies.rehearsalmanagertoken && activeTokens.includes(req.cookies.rehearsalmanagertoken)) {
      const profile = await managerDataService.getCurrentProfileName();
      res.clearCookie('currentProfile');
      if (profile)
        res.cookie('currentProfile', profile);
      return next();
    }

    if (req.cookies.rehearsalmanagertoken && !activeTokens.includes(req.cookies.rehearsalmanagertoken))
      res.clearCookie('rehearsalmanagertoken');

    if (!req.query.code
      && (!req.cookies.rehearsalmanagertoken || !activeTokens.includes(req.cookies.rehearsalmanagertoken))
      && nodeEnv === 'production'
    )
      return res.sendFile(path.join(__dirname, '/../views/login.html'));

    if ((req.query.code && req.query.code === authCode.code)) {
      setToken(res);
      res.sendStatus(200);
      return res.end();
    }

    res.sendStatus(401);
    return res.end();
  };

  return middleWare;
}

export const getActiveTokens = () => activeTokens;

export default frontendAuth;
