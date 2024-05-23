export default interface Environment {
  environment: 'production' | 'development';
  port: number | string;
  apiKey: string;
  dbConnectionString: string;
  serverUrl: string;
}
