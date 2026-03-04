// AI Command Center variant - ai.worldmonitor.app
import type { PanelConfig, MapLayers } from '@/types';
import type { VariantConfig } from './base';

// Re-export base config
export * from './base';

// AI-specific FEEDS configuration
import type { Feed } from '@/types';

const rss = (url: string) => `/api/rss-proxy?url=${encodeURIComponent(url)}`;
const yt = (id: string) => rss(`https://www.youtube.com/feeds/videos.xml?channel_id=${id}`);

export const FEEDS: Record<string, Feed[]> = {
  // General AI Developments
  ai_general: [
    { name: 'AI News', url: rss('https://news.google.com/rss/search?q=artificial+intelligence+news+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'VentureBeat AI', url: rss('https://venturebeat.com/category/ai/feed/') },
    { name: 'The Verge AI', url: rss('https://www.theverge.com/rss/ai-artificial-intelligence/index.xml') },
    { name: 'MIT Tech Review AI', url: rss('https://www.technologyreview.com/topic/artificial-intelligence/feed') },
    { name: 'Fortune AI', url: rss('https://fortune.com/category/technology/ai/feed/') },
    { name: 'ZDNet AI', url: rss('https://www.zdnet.com/topic/artificial-intelligence/rss.xml') },
  ],

  // Generative AI & LLMs
  genai: [
    { name: 'OpenAI Blog', url: rss('https://openai.com/news/rss.xml') },
    { name: 'Anthropic News', url: rss('https://news.google.com/rss/search?q=Anthropic+Claude+AI+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Google AI Blog', url: rss('https://blog.google/technology/ai/rss/') },
    { name: 'Meta AI News', url: rss('https://ai.meta.com/blog/rss/') },
    { name: 'Hugging Face Blog', url: rss('https://huggingface.co/blog/feed.xml') },
    { name: 'Cohere Blog', url: rss('https://txt.cohere.com/rss/') },
    { name: 'GenAI Trends', url: rss('https://news.google.com/rss/search?q="generative+AI"+OR+LLM+OR+ChatGPT+OR+Claude+OR+Gemini+when:2d&hl=en-US&gl=US&ceid=US:en') },
  ],

  // Agentic AI & Autonomy
  agentic: [
    { name: 'Agentic AI News', url: rss('https://news.google.com/rss/search?q="agentic+AI"+OR+"AI+agents"+OR+"autonomous+agents"+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'AutoGPT/Agents', url: rss('https://news.google.com/rss/search?q="AutoGPT"+OR+"BabyAGI"+OR+"LangChain"+agents+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Cognitive AI', url: rss('https://news.google.com/rss/search?q="cognitive+AI"+OR+"AI+autonomy"+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],

  // AI in Medical & Healthcare
  ai_medical: [
    { name: 'Medical AI News', url: rss('https://news.google.com/rss/search?q="AI+in+medicine"+OR+"healthcare+AI"+OR+"AI+diagnostics"+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Nature Medicine AI', url: rss('https://www.nature.com/nm/rss/current') },
    { name: 'ScienceDaily AI', url: rss('https://www.sciencedaily.com/rss/computers_math/artificial_intelligence.xml') },
    { name: 'Bio-AI', url: rss('https://news.google.com/rss/search?q="AlphaFold"+OR+"AI+drug+discovery"+when:14d&hl=en-US&gl=US&ceid=US:en') },
  ],

  // AI in Research & Academia
  ai_research: [
    { name: 'ArXiv AI (cs.AI)', url: rss('https://export.arxiv.org/rss/cs.AI') },
    { name: 'ArXiv ML (cs.LG)', url: rss('https://export.arxiv.org/rss/cs.LG') },
    { name: 'MIT Research', url: rss('https://news.mit.edu/rss/research') },
    { name: 'Stanford HAI', url: rss('https://news.google.com/rss/search?q=site:hai.stanford.edu+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'DeepMind Research', url: rss('https://news.google.com/rss/search?q=site:deepmind.google/research+when:14d&hl=en-US&gl=US&ceid=US:en') },
  ],

  // AI in War & Defense
  ai_war: [
    { name: 'AI Defense News', url: rss('https://news.google.com/rss/search?q="AI+in+warfare"+OR+"lethal+autonomous+weapons"+OR+"AI+defense"+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Defense One AI', url: rss('https://www.defenseone.com/rss/all/') },
    { name: 'Breaking Defense AI', url: rss('https://breakingdefense.com/tag/artificial-intelligence/feed/') },
    { name: 'Palantir News', url: rss('https://news.google.com/rss/search?q=Palantir+AIP+OR+Anduril+AI+when:14d&hl=en-US&gl=US&ceid=US:en') },
  ],

  // AI Podcasts & Tutorials (YouTube)
  podcasts_tutorials: [
    { name: 'Andrej Karpathy', url: yt('UC7neMWGV4CF_p3F0LpLj4Sg') },
    { name: 'AI Explained', url: yt('UCN79vJq_VCO_P_O86S3KzSg') },
    { name: 'Yannic Kilcher', url: yt('UCZHm_O-KxNO6BgN6G_fV0Xg') },
    { name: 'Two Minute Papers', url: yt('UCbfYPyITQ-7l4upoX8nvctg') },
    { name: 'Wes Roth', url: yt('UC8wZnXYK_CGKlBcZp-GxYPA') },
    { name: 'Matthew Berman', url: yt('UCy5znSnfMsDwaLlROn57Qbg') },
    { name: 'Lex Fridman AI', url: rss('https://news.google.com/rss/search?q="Lex+Fridman"+AI+OR+AGI+when:14d&hl=en-US&gl=US&ceid=US:en') },
  ],
};

// Panel configuration for AI Command Center
export const DEFAULT_PANELS: Record<string, PanelConfig> = {
  map: { name: 'AI Global Command', enabled: true, priority: 1 },
  'live-news': { name: 'AI Breaking', enabled: true, priority: 1 },
  insights: { name: 'AI Intelligence Brief', enabled: true, priority: 1 },
  ai_general: { name: 'General AI', enabled: true, priority: 1 },
  genai: { name: 'GenAI & LLMs', enabled: true, priority: 1 },
  agentic: { name: 'Agentic AI', enabled: true, priority: 1 },
  ai_medical: { name: 'Medical AI', enabled: true, priority: 1 },
  ai_research: { name: 'AI Research', enabled: true, priority: 1 },
  ai_war: { name: 'AI in Defense', enabled: true, priority: 1 },
  podcasts_tutorials: { name: 'Podcasts & Tutorials', enabled: true, priority: 1 },
  regulation: { name: 'AI Regulation', enabled: true, priority: 2 },
  'service-status': { name: 'AI Services Status', enabled: true, priority: 2 },
  monitors: { name: 'My AI Monitors', enabled: true, priority: 2 },
};

// AI-focused map layers
export const DEFAULT_MAP_LAYERS: MapLayers = {
  gpsJamming: false,
  geopoliticalBoundaries: false,
  conflicts: false,
  bases: false,
  cables: true,
  pipelines: false,
  hotspots: false,
  ais: false,
  nuclear: false,
  irradiators: false,
  sanctions: false,
  weather: false,
  economic: false,
  waterways: false,
  outages: true,
  cyberThreats: true,
  datacenters: true,
  protests: false,
  flights: false,
  military: false,
  natural: false,
  spaceports: false,
  minerals: false,
  fires: false,
  ucdpEvents: false,
  displacement: false,
  climate: false,
  startupHubs: true,
  cloudRegions: true,
  accelerators: false,
  techHQs: true,
  techEvents: true,
  aiResearchLabs: true,
  stockExchanges: false,
  financialCenters: false,
  centralBanks: false,
  commodityHubs: false,
  gulfInvestments: false,
  positiveEvents: false,
  kindness: false,
  happiness: false,
  speciesRecovery: false,
  renewableInstallations: false,
  tradeRoutes: false,
  iranAttacks: false,
  dayNight: false,
};

export const MOBILE_DEFAULT_MAP_LAYERS: MapLayers = {
  ...DEFAULT_MAP_LAYERS,
  cables: false,
  cloudRegions: false,
  techHQs: false,
};

export const VARIANT_CONFIG: VariantConfig = {
  name: 'ai',
  description: 'AI Command Center - Tracking developments in AI, GenAI and Agentic AI',
  panels: DEFAULT_PANELS,
  mapLayers: DEFAULT_MAP_LAYERS,
  mobileMapLayers: MOBILE_DEFAULT_MAP_LAYERS,
};
