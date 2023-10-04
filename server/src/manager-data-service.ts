import { Db, MongoClient, Collection, ObjectId } from 'mongodb';
import ShowData from './models/show-data';

interface ManagerDataDocument {
  name: string;
  created: string;
  shows: ShowData[];
}



export class ManagerDataService {
  protected readonly db: Promise<Db>
  protected readonly managerDataCollection: Promise<Collection<ManagerDataDocument>>;

  constructor(connectionUri: string) {
    if (!connectionUri)
      throw new Error('couldn\'t start mongo service - no connectionUri');

    this.db = new MongoClient(connectionUri).connect().then(client => client.db('manager-data'));

    this.managerDataCollection = this.db.then(db => db.collection('manager-data'));
  }

  async getAllBackups(): Promise<ManagerDataDocument[]> {
    const collection = await this.managerDataCollection;
    
    return collection
      .find({}, { collation: { locale: 'en' }})
      .toArray();
  }

  async getBackup(backupName: string): Promise<ManagerDataDocument | null> {
    const collection = await this.managerDataCollection;
    const backup = await collection.findOne({ name: backupName })
    return backup;
  }

  async saveData(data: ManagerDataDocument): Promise<void> {
    const collection = await this.managerDataCollection;
    await collection.insertOne({ _id: new ObjectId(), name: data.name, created: new Date().toISOString(), shows: data.shows });
  }

  async deleteBackup(backupName: string): Promise<void> {
    const collection = await this.managerDataCollection;
    const result = await collection.deleteOne({ name: backupName });
  }
}