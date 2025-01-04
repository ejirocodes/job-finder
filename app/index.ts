import "dotenv/config";
import express from "express";
import { cronController } from "./controllers/cron.controller";

const app = express();
const PORT = process.env.PORT || 3000;

async function main() {
  console.log("Starting job finder application...");

  try {
    app.listen(PORT, () => {
      // cronController.manualTrigger(); // comment this out to run the cron job on startup
      console.log(`Server is running on port ${PORT}`);
      console.log("Cron jobs scheduled and running...");
    });

    app.get("/health", (_, res) => {
      res.json({ status: "ok", lastRun: cronController.getLastRunDate() });
    });
  } catch (error) {
    console.error("Error starting job finder application", error);
  }
}

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

main();
