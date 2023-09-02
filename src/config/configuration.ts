export default () => ({
  server: {
    port: process.env.SERVER_PORT || 3002,
  },
  database: {
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: process.env.DATABASE_PORT || 27017,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME || 'iHelp',
  },
});
