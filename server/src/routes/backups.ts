import { Router } from 'express';
import { ManagerDataService } from '../manager-data-service';
import BackupInfo, { ShowBackupInfo } from '../models/backupInfo';
import environment from '../environment';
import apiKeyAuth from '../middleware/apikey-auth';

function backupsRouter(managerDataService: ManagerDataService) {
  const router = Router();

  router.use(apiKeyAuth);

  router.get('/', async (req, res) => {
    const allData = await managerDataService.getAllBackups()
    const data: BackupInfo[] = allData.map(x => {
      const showsData: ShowBackupInfo[] = x.shows.map(show => ({ name: show.name, noOfRehearsals: show.rehearsals.length }));
  
      return { backupName: x.name, date: x.created, shows: showsData };
    });
  
    res.send(data);
    res.status(204);
    res.end();
  })
  
  router.get('/:backupName', async (req, res) => {
    const backup = await managerDataService.getBackup(req.params.backupName);
  
    if (!backup) {
      res.status(404);
      return res.end();
    }
  
    res.send(backup.shows);
    res.status(200);
    res.end();
  })
  
  router.post('/', async (req, res) => {
    managerDataService.saveData(req.body);
  
    res.status(204);
    return res.end();
  })
  
  router.delete('/:backupName', async (req, res) => {
    await managerDataService.deleteBackup(req.params.backupName);
  
    res.status(200);
    res.end();
  });

  return router;
}

export default backupsRouter;
