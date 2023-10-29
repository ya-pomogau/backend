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
    name: process.env.DATABASE_NAME || 'iHelp',
  },

  vk: {
    appId: process.env.VK_APP_ID,
    appSecret: process.env.VK_APP_SECRET,
    redirectUri: process.env.VK_APP_REDIRECT_URI,
    api: process.env.VK_API,
    apiOauth: process.env.VK_API_OAUTH,
  },
  jwt: {
    key: process.env.JWT_KEY,
    ttl: process.env.JWT_TTL || '7d',
  },
  saltRounds: Number(process.env.SALT) || 10,
  avatars: {
    maxSize: Number(process.env.AVATARS_FILE_SIZE),
    dest: process.env.AVATARS_LOCATION,
  },
  blogs: {
    maxSize: Number(process.env.BLOG_IMAGES_FILE_SIZE),
    dest: process.env.BLOG_IMAGES_LOCATION,
  },
});
