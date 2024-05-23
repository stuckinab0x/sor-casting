const connectionUri = process.env.MIGRATIONS_CONNECTION_URI || 'mongodb://localhost:27017';

const config = {
  mongodb: {
    url: connectionUri,
    databaseName: 'manager-data',
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'esm',
};

export default config;
