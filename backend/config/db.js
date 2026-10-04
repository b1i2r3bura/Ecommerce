const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const connectDB = async (res,req) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
     console.log(`✅ MongoDB Successfully Connected: ${conn.connection.host}`);
     
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit with failure code
  }
};

module.exports = connectDB;




/**
 * db.js — MongoDB Atlas Connection
 *
 * WHAT IT IS:
 *   This file is responsible for establishing the connection between our
 *   Node.js/Express application and our MongoDB Atlas database using Mongoose.
 *
 * WHY WE NEED IT:
 *   Rather than scattering connection logic throughout the app, we isolate it
 *   here so that server.js stays clean. It is called once at startup.
 *
 * HOW IT WORKS:
 *   - We read the MONGO_URI from the .env file (via dotenv in server.js).
 *   - mongoose.connect() returns a promise, so we use async/await.
 *   - If the connection fails, we log the error and call process.exit(1)
 *     to stop the server — there's no point running without a database.
 */
