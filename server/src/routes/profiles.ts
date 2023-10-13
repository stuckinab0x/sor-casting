import { Router } from 'express';
import { ManagerDataService } from '../manager-data-service'
import apiKeyAuth from '../middleware/apikey-auth';
import ProfileSummary from '../models/profile-summary';

function ProfilesRouter(managerDataService: ManagerDataService) {
  const router = Router();

  router.use(apiKeyAuth);

  router.get('/', async (req, res) => {
    const profileNames = await managerDataService.getAllProfileNames();
    res.send(profileNames);
    res.end();
  })

  router.get('/:profileName', async (req, res) => {
    const allProfile = await managerDataService.getProfile(req.params.profileName)
    const summary: ProfileSummary = { profileName: allProfile.profileName, lastModified: allProfile.lastModified, shows: allProfile.shows.map(x => ({ name: x.name, songNames: x.songs.map(x => x.name), noOfRehearsals: x.rehearsals.length })) };
    res.send(summary);
    res.end();
  })
  
  router.put('/:profileName', async (req, res) => {
    await managerDataService.setConfig(req.params.profileName);
    res.sendStatus(200);
    res.end();
  });

  return router;
}

export default ProfilesRouter