export default () => ({
  server: {
    port: process.env.SERVER_PORT || 3001,
    cors_origins: process.env.CORS_ORIGINS,
  },
  database: {
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: process.env.DATABASE_PORT || 27017,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME || 'iHelp',
  },
  hash: {
    salt: Number(process.env.SALT) || 10,
  },
  jwt: {
    key: process.env.JWT_KEY || 'e776c17dcf7b8de11a1647faa49b89c2',
    ttl: process.env.JWT_TTL || '7d',
  },
});
