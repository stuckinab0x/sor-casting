import { Db, MongoClient, Collection } from 'mongodb';
import Show, { ShowData, ShowNameAndId } from './models/show-data';

interface ManagerDataDocument {
  profileName: string;
  lastModified: Date;
  shows: Show[];
}

interface ManagerConfigDocument {
  name: string;
  currentProfile: string;
}

export default class ManagerDataService {
  protected readonly db: Promise<Db>;
  protected readonly managerConfigCollection: Promise<Collection<ManagerConfigDocument>>;
  protected readonly managerDataCollection: Promise<Collection<ManagerDataDocument>>;

  constructor(connectionUri: string) {
    if (!connectionUri)
      throw new Error('couldn\'t start mongo service - no connectionUri');

    this.db = new MongoClient(connectionUri).connect().then(client => client.db('manager-data'));

    this.managerConfigCollection = this.db.then(db => db.collection('manager-config'));
    this.managerDataCollection = this.db.then(db => db.collection('manager-data'));
  }

  async addProfile(profileName:string): Promise<void> {
    const collection = await this.managerDataCollection;
    await collection.updateOne({ profileName }, { $setOnInsert: { profileName, lastModified: new Date(), shows: [] } }, { upsert: true });
  }

  async getCurrentProfileName(): Promise<string> {
    const collection = await this.managerConfigCollection;
    const config = await collection.findOne({ name: 'config' }, { projection: { currentProfile: 1 } });
    return config?.currentProfile || '';
  }

  async setConfig(profileName: string): Promise<void> {
    const configCollection = await this.managerConfigCollection;
    await configCollection.updateOne({ name: 'config' }, { $set: { currentProfile: profileName } }, { upsert: true });
    await this.addProfile(profileName);
  }

  async getAllProfileNames(): Promise<string[]> {
    const collection = await this.managerDataCollection;
    const all = await collection
      .find({}, { collation: { locale: 'en' } })
      .toArray();
    return all.map(x => x.profileName);
  }

  async getShowNamesAndIds(profileName: string): Promise<ShowNameAndId[]> {
    const collection = await this.managerDataCollection;
    const profileData = await collection.findOne({ profileName });
    return profileData.shows.map(x => ({ id: x.id, name: x.name }));
  }

  async getShow(profileName: string, showId: string): Promise<Show> {
    const collection = await this.managerDataCollection;
    const profileData = await collection.findOne({ profileName });
    return profileData.shows.find(x => x.id === showId);
  }

  async addNewShow(profileName: string, showData: ShowData) {
    const collection = await this.managerDataCollection;
    await collection.updateOne({ profileName }, { $addToSet: { shows: { ...showData, rehearsals: [] } }, $set: { lastModified: new Date() } });
  }

  async saveShowData(profileName: string, showData: ShowData) {
    const collection = await this.managerDataCollection;
    await collection.updateOne(
      { profileName, 'shows.id': showData.id },
      {
        $set: {
          lastModified: new Date(),
          'shows.$.id': showData.id,
          'shows.$.name': showData.name,
          'shows.$.singleArtist': showData.singleArtist,
          'shows.$.twoPmRehearsal': showData.twoPmRehearsal,
          'shows.$.setSplitIndex': Number(showData.setSplitIndex),
          'shows.$.songs': showData.songs,
          'shows.$.cast': showData.cast,
        },
      },
      { upsert: true },
    );
  }

  async saveShowWithRehearsals(profileName: string, shows: Show[]) {
    const collection = await this.managerDataCollection;
    await collection.updateOne(
      { profileName },
      {
        $set: {
          lastModified: new Date(),
          shows,
        },
      },
    );
  }

  async getProfile(profileName: string): Promise<ManagerDataDocument> {
    const collection = await this.managerDataCollection;
    return collection.findOne({ profileName });
  }
}
