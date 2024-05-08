import Environment from './models/environment';

const getValidEnvironment = () => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production')
    return process.env.NODE_ENV;
  return process.exit(1);
};

const environment: Environment = {
  environment: getValidEnvironment(),
  port: process.env.PORT ?? 80,
  apiKey: process.env.API_KEY,
  dbConnectionString: process.env.DB_CONNECTION_STRING,
  serverUrl: process.env.SERVER_URL,
};

export default environment;
