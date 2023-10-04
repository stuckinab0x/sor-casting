import express from 'express';
import environment from './environment';
import { ManagerDataService } from './manager-data-service';
import BackupInfo, { ShowBackupInfo } from './models/backupInfo';
import { createProxyMiddleware } from 'http-proxy-middleware';

const managerDataService = new ManagerDataService(environment.dbConnectionString!);

const app = express();
const serveStatic = express.static('src/public', { extensions: ['html'] });

app.use(express.json());

if (environment.environment === 'production') app.use(serveStatic)
else app.use('/', createProxyMiddleware({ target: 'http://frontend:5173', changeOrigin: true }));

app.use((req, res, next) => {
  if (req.headers.authorization === environment.apiKey)
    return next();
  res.status(401);
  res.end();
})

app.get('/api/backups', async (req, res) => {
  const allData = await managerDataService.getAllBackups()
  const data: BackupInfo[] = allData.map(x => {
    const showsData: ShowBackupInfo[] = x.shows.map(show => ({ name: show.name, noOfRehearsals: show.rehearsals.length }));

    return { backupName: x.name, date: x.created, shows: showsData };
  });

  res.send(data);
  res.status(204);
  res.end();
})

app.get('/api/backups/:backupName', async (req, res) => {
  const backup = await managerDataService.getBackup(req.params.backupName);

  if (!backup) {
    res.status(404);
    return res.end();
  }

  res.send(backup.shows);
  res.status(200);
  res.end();
})

app.post('/api/backups', async (req, res) => {
  managerDataService.saveData(req.body);

  res.status(204);
  return res.end();
})

app.delete('/api/backups/:backupName', async (req, res) => {
  await managerDataService.deleteBackup(req.params.backupName);

  res.status(200);
  res.end();
});

app.listen(environment.port, () => {
  console.log(`server listening on ${ environment.port }`)
});
