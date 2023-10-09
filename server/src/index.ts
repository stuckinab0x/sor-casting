import express, { RequestHandler } from 'express';
import environment from './environment';
import { ManagerDataService } from './manager-data-service';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';
import frontendAuth, { newAuthCode } from './middleware/frontend-auth';
import backupsRouter from './routes/backups';
import apiKeyAuth from './middleware/apikey-auth';

const managerDataService = new ManagerDataService(environment.dbConnectionString!);

const app = express();
const serveStatic = express.static('src/public', { extensions: ['html'] });

app.use(cookieParser());
app.use(express.json());

app.use('/api/backups', backupsRouter(managerDataService));

app.get('/api/authcode', apiKeyAuth, (req, res) => {
  res.send(newAuthCode());
  res.end();
});

app.use('/', frontendAuth);

if (environment.environment === 'production') app.use(serveStatic)
else app.use('/', createProxyMiddleware({ target: 'http://frontend:5173', changeOrigin: true }));

app.listen(environment.port, () => {
  console.log(`server listening on ${ environment.port }`)
});
