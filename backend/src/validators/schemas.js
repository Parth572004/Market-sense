import { z } from 'zod';

export const sourceSchema = z.object({
  id: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  country: z.string().nullable().optional()
}).passthrough().optional();

export const articleSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  url: z.string().url().optional().or(z.literal('')),
  image: z.string().nullable().optional(),
  urlToImage: z.string().nullable().optional(),
  publishedAt: z.string().optional(),
  source: sourceSchema
}).passthrough();

export const scanQuerySchema = z.object({
  scope: z.string().optional(),
  focus: z.string().optional(),
  region: z.string().optional(),
  category: z.string().optional(),
  provider: z.enum(['auto', 'newsapi', 'gnews', 'fallback', 'demo']).optional(),
  limit: z.coerce.number().int().min(1).max(25).optional(),
  demoMode: z.coerce.boolean().optional(),
  explainMode: z.enum(['normal', 'simple']).optional()
});

export const analyzeBodySchema = z.object({
  event: z.record(z.any()).optional(),
  events: z.array(z.record(z.any())).optional(),
  explainMode: z.enum(['normal', 'simple']).optional()
}).refine((value) => value.event || value.events, {
  message: 'Request must include event or events'
});

export const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.enum(['geopolitics', 'indian_politics', 'global_markets', 'energy', 'inflation']),
  category_label: z.string().optional(),
  sub_category: z.string().optional(),
  region: z.string(),
  lat: z.number(),
  lng: z.number(),
  priority: z.enum(['low', 'medium', 'high']),
  summary: z.string(),
  source: z.string(),
  source_url: z.string().optional(),
  image_url: z.string().nullable().optional(),
  published_at: z.string(),
  what_happened: z.string(),
  why_it_matters: z.string(),
  market_impact: z.array(z.string()),
  personal_finance_impact: z.array(z.string()),
  suggested_action: z.string(),
  possible_outcomes: z.array(z.string())
}).passthrough();
