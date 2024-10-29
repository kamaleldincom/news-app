// src/components/news/sources-view.tsx
'use client';

import { Story, NewsArticle } from '@/types/news';
import { ExternalLink } from 'lucide-react';

interface SourcesViewProps {
  story: Story;
}

export function SourcesView({ story }: SourcesViewProps) {
  // Filter articles by category
  const officialStatements = story.articles.filter(
    article => article.source.category === 'official'
  );

  const supportingCoverage = story.articles.filter(
    article => story.polarization.sourceBiases.find(
      bias => bias.name === article.source.name && bias.bias === 'supporting'
    )
  );

  const opposingCoverage = story.articles.filter(
    article => story.polarization.sourceBiases.find(
      bias => bias.name === article.source.name && bias.bias === 'opposing'
    )
  );

  const renderArticle = (article: NewsArticle, bgColor: string = 'bg-gray-50') => (
    <div key={article.url} className={`${bgColor} rounded-lg p-4`}>
      <h3 className="text-sm font-medium mb-2">{article.source.name}</h3>
      <p className="text-sm text-gray-600 mb-3">"{article.description}"</p>
      <a 
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
      >
        Source <ExternalLink className="w-3 h-3"/>
      </a>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Total Sources Counter */}
      <div className="text-sm text-gray-500">
        From {story.articles.length} Sources
      </div>

      {/* Official Statements */}
      {officialStatements.length > 0 && (
        <div>
          <h2 className="text-sm font-medium mb-4">Official Statements</h2>
          <div className="space-y-4">
            {officialStatements.map(article => renderArticle(article))}
          </div>
        </div>
      )}

      {/* Supporting Coverage */}
      {supportingCoverage.length > 0 && (
        <div>
          <h2 className="text-sm font-medium mb-4">Supporting Coverage</h2>
          <div className="space-y-4">
            {supportingCoverage.map(article => renderArticle(article, 'bg-blue-50'))}
          </div>
        </div>
      )}

      {/* Opposing Coverage */}
      {opposingCoverage.length > 0 && (
        <div>
          <h2 className="text-sm font-medium mb-4">Opposing Coverage</h2>
          <div className="space-y-4">
            {opposingCoverage.map(article => renderArticle(article, 'bg-red-50'))}
          </div>
        </div>
      )}
    </div>
  );
}