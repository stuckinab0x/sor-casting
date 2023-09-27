import 'dotenv/config';

export default {
  environment: process.env.NODE_ENV,
  port: process.env.PORT,
  apiKey: process.env.API_KEY,
  dbConnectionString: process.env.DB_CONNECTION_STRING,
}