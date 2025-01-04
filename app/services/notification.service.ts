import "dotenv/config";

interface Job {
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  postedDate: string;
  url: string;
  source: string;
}

export async function sendJobsToSlack(jobs: Job[]) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("Slack webhook URL not configured");
    return;
  }

  try {
    const blocks = jobs.map((job) => ({
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          `*${job?.title}* at ${job?.company}\n` +
          `📍 ${job?.location}\n` +
          `${job?.salary ? `💰 ${job?.salary}\n` : ""}` +
          `📅 Posted: ${job?.postedDate}\n` +
          `🔗 <${job?.url}|Apply Here>\n` +
          `\n${job?.description?.substring(0, 200)}...`,
      },
    }));

    const message = {
      text: `🔥 New Jobs Found Today (${jobs.length})`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `🔥 New Jobs Found Today (${jobs.length})`,
            emoji: true,
          },
        },
        ...blocks,
      ],
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`Failed to send to Slack: ${response.statusText}`);
    }

    console.log("Successfully sent jobs to Slack");
  } catch (error) {
    console.error("Error sending jobs to Slack:", error);
    throw error;
  }
}
