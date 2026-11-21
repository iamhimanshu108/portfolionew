// `flow` describes how each project works: what goes in, what does the work, what comes out.
export const projects = [
  {
    id: "ats-score-analyzer",
    title: "ATS Score Analyzer",
    kind: "AI",
    summary: "Turns a long resume review into a clear next step.",
    description:
      "AI-powered resume evaluation that compares a candidate's resume with a job description and returns compatibility scores, missing skills, and actionable suggestions.",
    features: ["Compares a resume to a target role", "Surfaces missing skills", "Suggests concrete edits"],
    flow: { input: "Resume + job description", engine: "LLM scoring pipeline", output: "Score, skill gaps, next steps" },
    technologies: ["React", "TypeScript", "Generative AI", "Tailwind CSS"],
    repoUrl: "https://github.com/iamhimanshu108/ats-score-analyzer",
    liveUrl: "https://www.iamhimanshu.in/ats-score-analyzer",
  },
  {
    id: "automation-router",
    title: "Multi-Channel Automation Router",
    kind: "Automation",
    summary: "One routing layer for everyday business workflows.",
    description:
      "Trigger-based automation that connects WhatsApp, Telegram, email, AppSheet, and Google Sheets through a single Python service.",
    features: ["Routes triggers across channels", "Connects business tools through APIs", "Runs anywhere in Docker"],
    flow: { input: "WhatsApp, Telegram, email", engine: "FastAPI router in Docker", output: "Sheets, AppSheet, replies" },
    technologies: ["Python", "FastAPI", "Node.js", "Docker"],
    repoUrl: "https://github.com/iamhimanshu108/automation-router",
    liveUrl: "https://www.iamhimanshu.in/automation-router",
  },
  {
    id: "crypto-tracker",
    title: "Crypto Tracker",
    kind: "Web app",
    summary: "Market context that is easier to act on at a glance.",
    description:
      "Live prices, trend charts, sentiment, and personal watchlists built on the CoinGecko API.",
    features: ["Live market prices", "Trend and sentiment views", "Saved watchlists"],
    flow: { input: "CoinGecko market data", engine: "React + TypeScript client", output: "Prices, trends, watchlists" },
    technologies: ["React", "TypeScript", "Tailwind CSS", "CoinGecko API"],
    repoUrl: "https://github.com/iamhimanshu108/crypto-tracker",
    liveUrl: "https://www.iamhimanshu.in/crypto-tracker",
  },
  {
    id: "weather-dashboard",
    title: "Weather Dashboard",
    kind: "Web app",
    summary: "Forecasts and alerts shaped around where you are.",
    description:
      "Location-aware forecasts with alerts and historical climate context using the OpenWeather API.",
    features: ["Location-aware forecasts", "Historical context", "Severe weather alerts"],
    flow: { input: "OpenWeather API + location", engine: "Forecast and alert logic", output: "Forecasts, history, alerts" },
    technologies: ["React", "TypeScript", "Tailwind CSS", "OpenWeather API"],
    repoUrl: "https://github.com/iamhimanshu108/weather-dashboard",
    liveUrl: "https://www.iamhimanshu.in/weather-dashboard",
  },
];
