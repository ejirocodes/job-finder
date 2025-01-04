import "dotenv/config";
import { z } from "zod";
import FirecrawlApp from "@mendable/firecrawl-js";
import Together from "together-ai";
import { zodToJsonSchema } from "zod-to-json-schema";

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

const JobSchema = z.object({
  title: z.string(),
  company: z.string(),
  location: z.string(),
  salary: z.string().optional(),
  description: z.string(),
  postedDate: z.string(),
  url: z.string(),
  source: z.string(),
});

const JobsSchema = z.object({
  jobs: z.array(JobSchema).describe("An array of tech jobs"),
});

const jsonSchema = zodToJsonSchema(JobsSchema, {
  name: "JobsSchema",
  nameStrategy: "title",
});

export async function scrapeSources(sources: string[]) {
  const allJobs: z.infer<typeof JobSchema>[] = [];

  for (const source of sources) {
    console.log(`Scraping ${source}...`);
    const fireCrawlresponse = await firecrawl.scrapeUrl(source, {
      formats: ["markdown"],
    });
    if (!fireCrawlresponse.success) {
      console.error(`Failed to scrape ${source}: ${fireCrawlresponse.error}`);
      throw new Error(`Failed to scrape: ${fireCrawlresponse.error}`);
    }

    try {
      const together = new Together();
      const currentDate = new Date().toLocaleDateString();

      const response = await together.chat.completions.create({
        model: "deepseek-ai/DeepSeek-V3",
        messages: [
          {
            role: "system",
            content: `
                    You are a job posting analyser. Parse the provided job listings and return only jobs posted today in the following format:
                   RESPONSE FORMAT:
                   Return ONLY a raw JSON object (no markdown, no code blocks, no additional text) in this exact structure:
                       {
                            "jobs": [
                                {
                                    "title": "string",
                                    "company": "string",
                                    "location": "string",
                                    "salary": "string",
                                    "description": "string",
                                    "postedDate": "string",
                                    "url": "string",
                                    "source": "string"
                                }
                            ]
                        }

                  The jobs must be posted today, ${currentDate}
                   Important rules:
                    1. Only include jobs posted within the last 24 hours
                    2. Ensure dates are in ISO format
                    3. Remove any HTML tags from descriptions
                    4. Validate all URLs are complete and valid, if not construct the full URL. DO NOT HALLUCINATE!.
                    5. If salary is not provided, omit the field
                    6. Keep descriptions concise but include key requirements

                    DO NOT include any explanation, markdown formatting, or code blocks. Return ONLY the JSON object, it must be valid JSON.

                    Scraped Job Board Content:\n\n${fireCrawlresponse.markdown}`,
          },
        ],

        //@ts-ignore
        // response_format: { type: "json_object", schema: jsonSchema },
      });

      const json = response.choices[0].message?.content;

      if (!json) {
        console.log(`No JSON output from LLM for ${source}`);
        continue;
      }

      const todayJobs = JSON.parse(json);
      console.log(
        `Found ${todayJobs?.jobs?.length} jobs from ${source} for ${currentDate}`
      );

      allJobs.push(...todayJobs.jobs);
    } catch (error) {
      console.error(`Error from LLM: ${error}`);
      continue;
    }
  }

  return { jobs: allJobs };
}
