import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

// Example REDIS_URL:
// redis://localhost:6379
// redis://default:password@localhost:6379
const redisUrl = process.env.REDIS_URL;

const redisClient = createClient({
  url: redisUrl,
});

// Register event listeners once
redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

redisClient.on("connect", () => {
  console.log("Redis connecting...");
});

redisClient.on("ready", () => {
  console.log("Redis Client Ready and Connected");
});

/**
 * Connect to Redis only when the server starts.
 * This prevents automatic connection during module import.
 */
export const connectRedis = async () => {
  try {
    // Avoid reconnecting if already connected
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    throw error;
  }
};

export default redisClient;
