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

  vk: {
    appId: process.env.VK_APP_ID || '51729194',
    appSecret: process.env.VK_APP_SECRET || 'lyxbTQRoOzpKBX4PqjWm',
    redirectUri: process.env.VK_APP_REDIRECT_URI || 'http://127.0.0.1:3001/callback',
  },
  jwt: {
    key: process.env.JWT_KEY || 'e776c17dcf7b8de11a1647faa49b89c2',
    secret: process.env.JWT_SECRET || 'jwt-secret-key',
    ttl: process.env.JWT_TTL || '7d',
  },
  hash: {
    salt: Number(process.env.SALT) || 10,
  },
});
