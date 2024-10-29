// src/lib/news-service.ts

import { NewsApiResponse, FetchStoriesParams, Story, NewsArticle, NewsSource } from '@/types/news';


// Source bias data (we can expand this)
const sourceBiases: Record<string, {
  bias: 'left' | 'center' | 'right';
  reliability: number;
}> = {
  'Reuters': { bias: 'center', reliability: 0.9 },
  'Associated Press': { bias: 'center', reliability: 0.9 },
  'BBC News': { bias: 'center', reliability: 0.85 },
  'Fox News': { bias: 'right', reliability: 0.6 },
  'CNN': { bias: 'left', reliability: 0.7 },
  // Add more sources
};

class NewsService {
  private static instance: NewsService;
  private baseUrl = 'https://newsapi.org/v2';
  private apiKey: string;

  private constructor() {
    const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
    if (!apiKey) throw new Error('NEWS_API_KEY is not defined');
    this.apiKey = apiKey;
  }

  public static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService();
    }
    return NewsService.instance;
  }

  private calculateSourceBias(source: NewsSource) {
    const biasData = sourceBiases[source.name];
    return {
      ...source,
      bias: biasData?.bias || 'center',
      reliability: biasData?.reliability || 0.7
    };
  }

  private extractKeywords(text: string): string[] {
    // Simple keyword extraction
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    return Array.from(new Set(words));
  }

  private calculateTitleSimilarity(title1: string, title2: string): number {
    const keywords1 = new Set(this.extractKeywords(title1));
    const keywords2 = new Set(this.extractKeywords(title2));
    
    const intersection = new Set([...keywords1].filter(x => keywords2.has(x)));
    const union = new Set([...keywords1, ...keywords2]);
    
    return intersection.size / union.size;
  }

  private detectCategory(article: NewsArticle): string {
    const keywords = this.extractKeywords(article.title + ' ' + (article.description || ''));
    
    const categoryKeywords: Record<string, string[]> = {
      'politics': ['government', 'election', 'president', 'congress', 'senate'],
      'technology': ['tech', 'apple', 'google', 'ai', 'software'],
      'business': ['market', 'economy', 'stock', 'company', 'business'],
      'science': ['research', 'study', 'scientist', 'discovery'],
      // Add more categories
    };

    let maxCategory = 'general';
    let maxScore = 0;

    for (const [category, catKeywords] of Object.entries(categoryKeywords)) {
      const score = catKeywords.filter(k => keywords.includes(k)).length;
      if (score > maxScore) {
        maxScore = score;
        maxCategory = category;
      }
    }

    return maxCategory;
  }

  private calculatePolarization(articles: NewsArticle[]) {
    const sources = articles.map(a => this.calculateSourceBias(a.source));
    
    // Calculate source diversity and positions
    const sourcesWithStance = sources.map(source => {
      const articleContent = articles.find(a => a.source.name === source.name)?.description || '';
      return {
        ...source,
        stance: this.analyzeStance(articleContent)
      };
    });
  
    const supportingSources = sourcesWithStance.filter(s => s.stance === 'supporting');
    const opposingSources = sourcesWithStance.filter(s => s.stance === 'opposing');
    const neutralSources = sourcesWithStance.filter(s => s.stance === 'neutral');
    
    const totalSources = sourcesWithStance.length;
    const supportingPercentage = Math.round((supportingSources.length / totalSources) * 100);
    const opposingPercentage = Math.round((opposingSources.length / totalSources) * 100);
    const neutralPercentage = Math.round((neutralSources.length / totalSources) * 100);
  
    // Determine level based on ratio between supporting and opposing
    const polarizationRatio = Math.abs(supportingPercentage - opposingPercentage) / 100;
    const level = polarizationRatio > 0.7 ? 'High' : polarizationRatio > 0.3 ? 'Moderate' : 'Low';
  
    return {
      level,
      score: polarizationRatio,
      supporting: supportingPercentage,
      opposing: opposingPercentage,
      neutral: neutralPercentage,
      sourceBiases: sourcesWithStance.map(s => ({
        name: s.name,
        bias: s.stance,
        reliability: s.reliability
      }))
    };
  }

  private analyzeStance(content: string): 'supporting' | 'opposing' | 'neutral' {
    const supportingKeywords = [
      'cooperation', 'agreement', 'partnership', 'support', 'assist',
      'humanitarian', 'legitimate', 'authorized', 'legal', 'bilateral'
    ];
  
    const opposingKeywords = [
      'violation', 'concern', 'condemn', 'illegal', 'threat',
      'sanctions', 'warning', 'crisis', 'escalation', 'conflict'
    ];
  
    const words = content.toLowerCase().split(/\s+/);
    const supportingCount = words.filter(word => supportingKeywords.includes(word)).length;
    const opposingCount = words.filter(word => opposingKeywords.includes(word)).length;
  
    if (Math.abs(supportingCount - opposingCount) <= 1) return 'neutral';
    return supportingCount > opposingCount ? 'supporting' : 'opposing';
  }

  private groupArticles(articles: NewsArticle[]): Story[] {
    const stories: Story[] = [];
    const processedTitles = new Set<string>();
  
    for (const article of articles) {
      if (processedTitles.has(article.title)) continue;
  
      // Find related articles
      const relatedArticles = articles.filter(a => 
        this.calculateTitleSimilarity(a.title, article.title) > 0.6 &&
        a.title !== article.title
      );
  
      // Mark processed
      relatedArticles.forEach(a => processedTitles.add(a.title));
      processedTitles.add(article.title);
  
      const allArticles = [article, ...relatedArticles];
      const category = this.detectCategory(article);
      const polarization = this.calculatePolarization(allArticles);
  
      stories.push({
        id: Math.random().toString(36).substring(2, 9),
        title: article.title,
        description: article.description || '',
        mainSource: this.calculateSourceBias(article.source),
        relatedSources: relatedArticles.map(a => this.calculateSourceBias(a.source)),
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        category,
        readTime: this.calculateReadTime(article.content || article.description || ''),
        polarization,
        articles: allArticles.map(a => ({
          ...a,
          source: {
            ...a.source,
            category: this.detectSourceCategory(a.source.name),
            bias: this.analyzeStance(a.description || '')
          }
        }))
      });
    }
  
    return stories;
  }

  private detectSourceCategory(sourceName: string): 'official' | 'press' | 'analysis' {
    const officialKeywords = ['Ministry', 'Department', 'Government', 'Agency', 'Official', 'Council'];
    const analysisKeywords = ['Institute', 'Research', 'Analysis', 'Think Tank', 'Foundation', 'University'];
  
    if (officialKeywords.some(keyword => sourceName.includes(keyword))) {
      return 'official';
    }
  
    if (analysisKeywords.some(keyword => sourceName.includes(keyword))) {
      return 'analysis';
    }
  
    return 'press';
  }

  private calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  }

  async fetchStories(params: FetchStoriesParams = {}): Promise<Story[]> {
    const { category, page = 1, pageSize = 20, q, language = 'en', country = 'us' } = params;
    
    const queryParams = new URLSearchParams({
      apiKey: this.apiKey,
      page: page.toString(),
      pageSize: pageSize.toString(),
      language,
      country,
    });

    if (category) queryParams.append('category', category);
    if (q) queryParams.append('q', q);

    const response = await fetch(
      `${this.baseUrl}/top-headlines?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data: NewsApiResponse = await response.json();
    return this.groupArticles(data.articles);
  }

  async searchStories(query: string, params: Omit<FetchStoriesParams, 'q'> = {}): Promise<Story[]> {
    return this.fetchStories({ ...params, q: query });
  }
}

export default NewsService;