import { Router } from 'express';
import { ManagerDataService } from '../manager-data-service';
import apiKeyAuth from '../middleware/apikey-auth';

function showsRouter(managerDataService: ManagerDataService) {
  const router = Router();

  router.use(apiKeyAuth)

  router.get('/', async (req, res) => {
    const currentProfile = await managerDataService.getCurrentProfileName();
    const showNames = await managerDataService.getShowNames(currentProfile);
    res.send(showNames);
    res.end();
  });
  
  router.put('/', async (req, res) => {
    const currentProfile = await managerDataService.getCurrentProfileName();
    const exists = await managerDataService.getShow(currentProfile, req.body.name);
    if (!exists)
      await managerDataService.addNewShow(currentProfile, req.body);
    else
      await managerDataService.saveShowData(currentProfile, req.body);
    res.sendStatus(200);
    res.end();
  });

  router.put('/:profileName', async (req, res) => {
    await managerDataService.saveShowWithRehearsals(req.params.profileName, req.body);
    res.sendStatus(200);
    res.end();
  })
  
  router.get('/:showName', async (req, res) => {
    const currentProfile = await managerDataService.getCurrentProfileName();
    const showData = await managerDataService.getShow(currentProfile, req.params.showName);
    res.send({
      name: showData.name,
      singleArtist: showData.singleArtist,
      twoPmRehearsal: showData.twoPmRehearsal,
      songs: showData.songs,
      cast: showData.cast,
    });
    res.end();
  });

  router.get('/:profileName/all', async (req, res) => {
    const profile = await managerDataService.getProfile(req.params.profileName);
    res.send(profile.shows);
    res.end();
  })

  return router;
}

export default showsRouter;
