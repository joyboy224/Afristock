import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT || 4000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/afristock",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret_key",
  emailService: process.env.EMAIL_SERVICE || "SendGrid",
  emailApiKey: process.env.EMAIL_API_KEY || "",
  emailFrom: process.env.EMAIL_FROM || "no-reply@afristock.com",
  apiKey: process.env.API_KEY || "your_api_key_here"
};
