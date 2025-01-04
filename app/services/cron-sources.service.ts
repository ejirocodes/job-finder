import "dotenv/config";

export function getCronSources() {
  try {
    console.log("Fetching list of job boards...");

    // List of job boards
    const sources = [
      { url: "https://weworkremotely.com" },
      // { url: "https://www.workatastartup.com/jobs" },
      // { url: "https://startup.jobs/" },
      // { url: "https://vuejobs.com" },
      //   { url: "https://wellfound.com/jobs" }, // the bots are too darn good
    ];

    return sources.map((source) => source.url);
  } catch (error) {
    console.error(error);
  }
}
