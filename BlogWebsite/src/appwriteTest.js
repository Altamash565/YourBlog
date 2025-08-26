import { Client } from "appwrite";
import config from "./config/config";

function testAppwriteConnection() {
  try {
    const client = new Client()
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);

    console.log("✅ Appwrite client initialized:");
    console.log("Endpoint:", config.appwriteUrl);
    console.log("Project ID:", config.appwriteProjectId);
  } catch (error) {
    console.error("❌ Appwrite connection failed:", error);
  }
}

testAppwriteConnection();
