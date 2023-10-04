export default interface BackupInfo {
  backupName: string;
  date: string;
  shows: ShowBackupInfo[];
}

export interface ShowBackupInfo {
  name: string;
  noOfRehearsals: number;
}
