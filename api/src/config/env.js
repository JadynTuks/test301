import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT || 5000,

  daemonHost: process.env.DAEMON_HOST || "172.26.58.42",
  daemonPort: process.env.DAEMON_PORT || 3000,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION || '100d',
  tokenExpiry: process.env.TOKEN_EXPIRY || "100d",
};


