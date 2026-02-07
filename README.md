# Wearable Health Dashboard

Compare health data from Whoop and Garmin side-by-side with interactive visualizations.

## Features

- **Whoop integration** — OAuth 2.0 flow to pull sleep, recovery, and strain data
- **Garmin integration** — OAuth 1.0a flow to pull sleep, body battery, and activity data
- **Normalized data models** — Common types across both platforms for direct comparison
- **Comparative charts** — Sleep duration, recovery score, HRV, resting heart rate, and strain/activity load
- **Date range selector** — View 7, 14, 30, or 90 day windows
- **Toggle sources** — Show/hide individual data sources on the dashboard
- **Demo mode** — Mock data generator for development without API credentials

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.local.example .env.local
# Fill in your Whoop and Garmin API credentials

# Run development server
npm run dev
```

Open http://localhost:3000 to view the dashboard.

## API Credentials

### Whoop
Register a developer application at https://developer.whoop.com to get your client ID and secret.

### Garmin
Apply for the Garmin Connect Developer Program at https://developer.garmin.com/gc-developer-program/ to get your consumer key and secret.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── health-data/    # Aggregated health data endpoint
│   │   ├── whoop/callback/ # Whoop OAuth callback
│   │   └── garmin/callback/# Garmin OAuth callback
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Dashboard.tsx       # Main dashboard with all charts
│   ├── SleepChart.tsx      # Sleep duration bar chart
│   ├── RecoveryChart.tsx   # Recovery score line chart
│   ├── HrvChart.tsx        # HRV area chart
│   ├── HeartRateChart.tsx  # Resting heart rate line chart
│   ├── StrainChart.tsx     # Strain/activity bar chart
│   ├── ConnectionPanel.tsx # Connect/disconnect wearables
│   └── DateRangeSelector.tsx
├── lib/
│   ├── whoop.ts            # Whoop API client
│   ├── garmin.ts           # Garmin API client
│   └── mock-data.ts        # Mock data generator
└── types/
    └── health.ts           # Shared health data types
```

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- date-fns
