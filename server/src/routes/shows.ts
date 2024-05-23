import { Router } from 'express';
import ManagerDataService from '../manager-data-service';
import apiKeyAuth from '../middleware/apikey-auth';

function showsRouter(managerDataService: ManagerDataService) {
  const router = Router();

  router.use(apiKeyAuth);

  router.get('/', async (req, res) => {
    const currentProfile = await managerDataService.getCurrentProfileName();
    const showNamesAndIds = await managerDataService.getShowNamesAndIds(currentProfile);
    res.send(showNamesAndIds);
    res.end();
  });

  router.put('/', async (req, res) => {
    const currentProfile = await managerDataService.getCurrentProfileName();
    const exists = await managerDataService.getShow(currentProfile, req.body.id);
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
  });

  router.get('/:showId', async (req, res) => {
    const currentProfile = await managerDataService.getCurrentProfileName();
    const showData = await managerDataService.getShow(currentProfile, req.params.showId);
    res.send({
      id: showData.id,
      name: showData.name,
      singleArtist: showData.singleArtist,
      twoPmRehearsal: showData.twoPmRehearsal,
      setSplitIndex: showData.setSplitIndex,
      songs: showData.songs,
      cast: showData.cast,
    });
    res.end();
  });

  router.get('/:profileName/all', async (req, res) => {
    const profile = await managerDataService.getProfile(req.params.profileName);
    res.send(profile.shows);
    res.end();
  });

  return router;
}

export default showsRouter;
