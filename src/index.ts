import express, { RequestHandler } from 'express';
import cors from 'cors';
import environment from './environment';
import { ManagerDataService } from './manager-data-service';
import BackupInfo, { ShowBackupInfo } from './models/backupInfo';

const managerDataService = new ManagerDataService(environment.dbConnectionString!);

const app = express();
app.use(cors({ origin: environment.serverUrl }));
app.use(express.json());

const auth: RequestHandler = (req, res, next) => {
  if (req.headers.authorization !== environment.apiKey)
    return res.status(401);
  return next();
}

app.get('/', async (req, res) => {
  res.status(200);
  res.end();
});

app.use(auth);

app.get('/api/backups', async (req, res) => {
  const allData = await managerDataService.getAllBackups()
  const data: BackupInfo[] = allData.map(x => {
    const showsData: ShowBackupInfo[] = x.shows.map(show => ({ name: show.name, noOfRehearsals: show.rehearsals.length }));

    return { backupName: x.name, date: x.created, shows: showsData };
  });

  res.send(data);
  res.status(204);
  return res.end();
})

app.get('/api/backups/:backupName', async (req, res) => {
  const backup = await managerDataService.getBackup(req.params.backupName);

  if (!backup) {
    res.status(404);
    return res.end();
  }

  res.send(backup.shows);
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
})

app.listen(environment.port, () => {
  console.log(`server listening on ${ environment.port }`)
});
