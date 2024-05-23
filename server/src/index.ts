import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';
import environment from './environment';
import ManagerDataService from './manager-data-service';
import frontendAuth, { newAuthCode } from './middleware/frontend-auth';
import showsRouter from './routes/shows';
import profilesRouter from './routes/profiles';
import apiKeyAuth from './middleware/apikey-auth';

const managerDataService = new ManagerDataService(environment.dbConnectionString!);

const app = express();
const serveStatic = express.static('src/public', { extensions: ['html'] });

app.use(cookieParser());
app.use(express.json());

app.use(async (req, res, next) => {
  try { next(); } catch (error: any) { res.sendStatus(500); }
});

app.get('/api/authcode', apiKeyAuth, (req, res) => {
  res.send(newAuthCode());
  res.end();
});

app.use('/api/profiles', profilesRouter(managerDataService));

app.use('/api/shows', showsRouter(managerDataService));

app.use('/', frontendAuth(managerDataService, environment.environment));

if (environment.environment === 'production') app.use(serveStatic);
else app.use('/', createProxyMiddleware({ target: 'http://frontend:5173', changeOrigin: true }));

app.listen(environment.port, () => {
  console.log(`server listening on ${ environment.port }`);
});
