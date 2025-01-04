import cron from "node-cron";
import { getCronSources } from "../services/cron-sources.service";
import { scrapeSources } from "../services/scrape-sources.service";
import { sendJobsToSlack } from "../services/notification.service";

class CronController {
  private isRunning: boolean = false;
  private lastRunDate: string | null = null;

  constructor() {
    // Run every hour from 8 AM to 6 PM every day
    // '0 8-18 * * *' means:
    // - 0: At minute 0
    // - 8-18: From 8 AM to 6 PM
    // - *: Every day of the month
    // - *: Every month
    // - *: Every day of the week (including weekends)
    cron.schedule("0 8-18 * * *", () => {
      this.runJobScraper();
    });

    // Run every day at 11:30 PM to check if we need to run the job scraper again
    cron.schedule("30 23 * * *", () => {
      this.runFinalCheck();
    });
  }

  private async runJobScraper() {
    const today = new Date().toDateString();

    if (this.isRunning) {
      console.log("Job scraper is already running");
      return;
    }

    if (this.lastRunDate === today) {
      console.log("Already ran today, skipping...");
      return;
    }

    try {
      this.isRunning = true;
      console.log("Starting scheduled job scraping...");

      const cronSources = await getCronSources();
      if (!cronSources || cronSources.length === 0) {
        console.log("No sources found");
        return;
      }

      const results = await scrapeSources(cronSources);

      if (results.jobs && results.jobs.length > 0) {
        await sendJobsToSlack(results.jobs);
        console.log(`Successfully processed ${results.jobs.length} jobs`);
      } else {
        console.log("No jobs found for today");
      }

      this.lastRunDate = today;
    } catch (error) {
      console.error("Error in cron job:", error);
    } finally {
      this.isRunning = false;
    }
  }

  private async runFinalCheck() {
    const today = new Date().toDateString();

    if (this.lastRunDate !== today) {
      console.log("Running final check for today's jobs...");
      await this.runJobScraper();
    }
  }

  public async manualTrigger() {
    await this.runJobScraper();
  }

  public getLastRunDate(): string | null {
    return this.lastRunDate;
  }
}

export const cronController = new CronController();
