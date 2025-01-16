# Job Finder 💼

**Never miss out on your dream job opportunity — all in one place.**



https://github.com/user-attachments/assets/78ba47ca-469c-463b-aada-cb16ff32d9dc



Job Finder automatically monitors job boards and company career pages, then sends Slack notifications when it detects new relevant positions. This tool revolutionizes your job search by:

- **Saving hours** normally spent manually checking multiple job sites
- **Keeping you informed** of new opportunities in real-time
- **Enabling quick applications** before positions get flooded with candidates

_Stop refreshing job boards manually and let automation work for you._

## How it Works

1. **Job Collection** 📥
   - Monitors selected company career pages using Firecrawl's /extract
   - Tracks job boards for new listings
   - Runs on a scheduled basis using cron jobs

2. **AI Analysis** 🧠
   - Processes job listings through Together AI
   - Identifies relevant positions based on your criteria
   - Analyzes job requirements and qualifications
   - Filters out irrelevant positions

3. **Notification System** 📢
   - Sends Slack notifications when relevant jobs are found
   - Provides direct application links or contact information
   - Includes key job details and requirements

## Features

- 🤖 AI-powered job matching using Together AI
- 🔍 Career page monitoring with Firecrawl
- 💼 Job board integration
- 💬 Instant Slack notifications
- ⏱️ Scheduled monitoring using cron jobs
- 📋 Automatic job requirement analysis
- 🔗 Direct application links

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **AI/ML**: Together AI
- **Data Sources**:
  - Firecrawl for web scraping
  - Company career pages
- **Notifications**: Slack Webhooks
- **Scheduling**: node-cron
- **Development**:
  - nodemon for hot reloading
  - TypeScript for type safety
  - Express for web server

## Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Slack workspace with webhook permissions
- API keys for required services

## Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ejirocodes/job-finder.git
   cd job-finder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run the application:**
   ```bash
   # Development mode with hot reloading
   npm run start

   # Build for production
   npm run build
   ```


## Project Structure
```job-finder/
├── app/
│ ├── controllers/
│ │ └── cron.controller.ts # Job search scheduling
│ ├── services/
│ │ ├── notification.service.ts # Slack notifications
│ │ ├── scrape-sources.service.ts # Job source scraping
│ │ └── cron-sources.service.ts # Scheduling service
│ └── index.ts # App entry point
├── .env # Environment variables
└── package.json # Dependencies and scripts
```

## Configuration

### Adding Job Sources
Edit `app/services/scrape-sources.service.ts` to add or modify job sources:
- Company career pages
- Job board URLs
- Search criteria and filters

### Notification Settings
Customize notifications in `app/services/notification.service.ts`:
- Message format
- Job detail inclusion
- Notification frequency

### Scheduling
Adjust monitoring frequency in `app/services/cron-sources.service.ts`:
- Set check intervals
- Configure time windows
- Manage rate limits

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-feature `)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## Credits

- This project was heavily inspired by [Trend Finder](https://github.com/ericciarla/trendFinder)

## License

MIT License - see LICENSE file for details
