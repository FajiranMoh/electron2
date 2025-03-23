require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true,
    trustedConnection: true,
    instanceName: process.env.DB_INSTANCE,
    enableArithAbort: true,
  },
  port: parseInt(process.env.DB_PORT),
};

module.exports = config;
