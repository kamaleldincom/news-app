// src/components/news/story-card.tsx
'use client';

import { Story } from '@/types/news';
import { BarChart, Clock, Share, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type StoryCardProps = {
  story: Story;
  onClick: () => void;
};

export function StoryCard({ story, onClick }: StoryCardProps) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className="space-y-4 cursor-pointer" onClick={onClick}>
      {story.urlToImage && !imageError ? (
        <div className="relative h-48 rounded-lg overflow-hidden">
          <Image
            src={story.urlToImage}
            alt={story.title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            unoptimized
          />
        </div>
      ): story.urlToImage ? (
        <div className="h-48 rounded-lg bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 flex flex-col items-center">
            <ImageIcon className="w-8 h-8 mb-2" />
            <span className="text-sm">Image unavailable</span>
          </div>
        </div>
      ) : null}
      
      <h2 className="text-2xl font-bold">{story.title}</h2>
      
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {[story.mainSource, ...story.relatedSources.slice(0, 2)].map((source, i) => (
            <div 
              key={source.id || i} 
              className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs"
            >
              {source.name[0]}
            </div>
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {[story.mainSource, ...story.relatedSources].map(s => s.name).join(', ')}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <BarChart className={`w-4 h-4 ${
            story.polarization.level === 'High' ? 'text-red-500' :
            story.polarization.level === 'Moderate' ? 'text-orange-500' :
            'text-green-500'
          }`}/>
          <span className={`text-sm ${
            story.polarization.level === 'High' ? 'text-red-500' :
            story.polarization.level === 'Moderate' ? 'text-orange-500' :
            'text-green-500'
          }`}>
            {story.polarization.level} Discussion
          </span>
        </div>
        <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="flex h-full">
            <div className="bg-blue-500" style={{width: `${story.polarization.supporting}%`}}/>
            <div className="bg-gray-300" style={{width: `${story.polarization.neutral}%`}}/>
            <div className="bg-red-500" style={{width: `${story.polarization.opposing}%`}}/>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-4 h-4"/>
            <span>{new Date(story.publishedAt).toLocaleDateString()}</span>
          </div>
          <span className="text-sm text-gray-500">{story.readTime}</span>
        </div>
        <button 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            if (navigator.share) {
              navigator.share({
                title: story.title,
                text: story.description,
                url: story.url
              });
            } else {
              navigator.clipboard.writeText(story.url);
            }
          }}
        >
          <Share className="w-5 h-5 text-gray-400"/>
        </button>
      </div>
    </div>
  );
}