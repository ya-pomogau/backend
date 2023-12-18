export default () => ({
  server: {
    port: process.env.SERVER_PORT || 3001,
    cors_origins: process.env.CORS_ORIGINS,
    http_address: process.env.HTTP_ADDRESS,
  },
  database: {
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: process.env.DATABASE_PORT || 27017,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME || 'ya-pomogau-db',
  },

  vk: {
    appId: process.env.VK_APP_ID,
    appSecret: process.env.VK_APP_SECRET,
  },
  jwt: {
    key: process.env.JWT_KEY || 'mY-ZypEr-sEKRet-23549',
    ttl: process.env.JWT_TTL || '7d',
  },
  password: {
    saltRounds: Number(process.env.SALT) || 10,
  },
});
