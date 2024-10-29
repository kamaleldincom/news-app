// src/types/news.ts

export type NewsCategory = 'general' | 'business' | 'technology' | 'entertainment' | 'health' | 'science' | 'sports' | 'politics';
export type SourceBias = 'supporting' | 'opposing' | 'neutral';
export type SourceCategory = 'official' | 'press' | 'analysis';
export type PolarizationLevel = 'High' | 'Moderate' | 'Low';

export interface NewsSource {
  id: string | null;
  name: string;
  category?: SourceCategory;
  bias?: SourceBias;
  reliability?: number;
}

export interface NewsArticle {
  source: NewsSource;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface ContentionPoint {
  topic: string;
  supportingView: {
    text: string;
    source: string;
  };
  opposingView: {
    text: string;
    source: string;
  };
}

export interface NotableStatement {
  quote: string;
  source: string;
}

export interface Polarization {
  level: PolarizationLevel;
  score: number;
  supporting: number;
  opposing: number;
  neutral: number;
  sourceBiases: Array<{
    name: string;
    bias: SourceBias;
    reliability: number;
  }>;
  contentionPoints: ContentionPoint[];
  notableStatements: NotableStatement[];
}

export interface Story {
  id: string;
  title: string;
  description: string;
  mainSource: NewsSource;
  relatedSources: NewsSource[];
  articles: NewsArticle[];
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  category: string;
  readTime: string;
  polarization: Polarization;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  time?: string;
  title: string;
  description: string;
  source: {
    id: string;
    name: string;
    category: SourceCategory;
    bias?: SourceBias;
    url: string;
    color: string;
  };
}

export interface DayEvents {
  date: string;
  formattedDate: string;
  label: string;
  isToday: boolean;
  events: TimelineEvent[];
}

export interface CoverageTrend {
  period: 'initial' | 'current';
  date: string;
  sentiment: 'skeptical' | 'neutral' | 'concerned';
  mainSources: string[];
  description: string;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export interface FetchStoriesParams {
  category?: NewsCategory;
  page?: number;
  pageSize?: number;
  q?: string;
  language?: string;
  country?: string;
}