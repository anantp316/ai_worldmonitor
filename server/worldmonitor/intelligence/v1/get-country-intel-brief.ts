import type {
  ServerContext,
  GetCountryIntelBriefRequest,
  GetCountryIntelBriefResponse,
} from '../../../../src/generated/server/worldmonitor/intelligence/v1/service_server';

import { cachedFetchJson } from '../../../_shared/redis';
import { UPSTREAM_TIMEOUT_MS, GROQ_API_URL, GROQ_MODEL, TIER1_COUNTRIES, hashString } from './_shared';
import { CHROME_UA } from '../../../_shared/constants';

// ========================================================================
// Constants
// ========================================================================

const INTEL_CACHE_TTL = 7200;

// ========================================================================
// RPC handler
// ========================================================================

export async function getCountryIntelBrief(
  ctx: ServerContext,
  req: GetCountryIntelBriefRequest,
): Promise<GetCountryIntelBriefResponse> {
  const empty: GetCountryIntelBriefResponse = {
    countryCode: req.countryCode,
    countryName: '',
    brief: '',
    model: GROQ_MODEL,
    generatedAt: Date.now(),
  };

  if (!req.countryCode) return empty;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return empty;

  let contextSnapshot = '';
  let lang = 'en';
  try {
    const url = new URL(ctx.request.url);
    contextSnapshot = (url.searchParams.get('context') || '').trim().slice(0, 4000);
    lang = url.searchParams.get('lang') || 'en';
  } catch {
    contextSnapshot = '';
  }

  const contextHash = contextSnapshot ? hashString(contextSnapshot) : 'base';
  const cacheKey = `ci-sebuf:v2:${req.countryCode}:${lang}:${contextHash}`;
  const countryName = TIER1_COUNTRIES[req.countryCode] || req.countryCode;
  const dateStr = new Date().toISOString().split('T')[0];

  const systemPrompt = `You are a senior intelligence analyst specializing in artificial intelligence, technology infrastructure, and global AI regulation. Current date: ${dateStr}. Your objective is to provide a brief focused on the country's AI landscape.

Write a concise AI Intelligence Brief for the requested country covering:
1. AI Ecosystem Status - research labs, talent pool, and startups
2. Computing Infrastructure - data centers, chip availability, and cloud capacity
3. Regulatory Environment - AI policies, ethics guidelines, and government initiatives
4. Adoption & Industry Impact - how AI is being used in sectors like medical, research, and defense
5. Strategic Outlook - upcoming milestones and competitive positioning

Rules:
- Focus ENTIRELY on AI, GenAI, and Agentic AI developments
- Be specific and analytical
- 4-5 paragraphs, 250-350 words
- No speculation beyond what data supports
- Use plain language, not jargon
- If a context snapshot is provided, explicitly reflect AI-related indicators (outages, research, news) in the brief${lang === 'fr' ? '\n- IMPORTANT: You MUST respond ENTIRELY in French language.' : ''}`;

  let result: GetCountryIntelBriefResponse | null = null;
  try {
    result = await cachedFetchJson<GetCountryIntelBriefResponse>(cacheKey, INTEL_CACHE_TTL, async () => {
      try {
        const userPromptParts = [
          `Country: ${countryName} (${req.countryCode})`,
        ];
        if (contextSnapshot) {
          userPromptParts.push(`Context snapshot:\n${contextSnapshot}`);
        }

        const resp = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'User-Agent': CHROME_UA },
          body: JSON.stringify({
            model: GROQ_MODEL,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPromptParts.join('\n\n') },
            ],
            temperature: 0.4,
            max_tokens: 900,
          }),
          signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        });

        if (!resp.ok) return null;
        const data = (await resp.json()) as { choices?: Array<{ message?: { content?: string } }> };
        const brief = data.choices?.[0]?.message?.content?.trim() || '';
        if (!brief) return null;

        return {
          countryCode: req.countryCode,
          countryName,
          brief,
          model: GROQ_MODEL,
          generatedAt: Date.now(),
        };
      } catch {
        return null;
      }
    });
  } catch {
    return empty;
  }

  return result || empty;
}
