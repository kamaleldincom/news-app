// src/app/search/page.tsx
'use client';

import { StoryCard } from '@/components/news/story-card';
import { useSearchNews } from '@/hooks/useNews';
import { useNewsStore } from '@/store/news-store';
import { ArrowLeft, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { data: stories, isLoading } = useSearchNews(query);
  const { setActiveStory, setActiveView } = useNewsStore();

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button 
            className="text-gray-600 p-1" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search news..."
              className="w-full bg-gray-50 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              autoFocus
            />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"/>
          </div>
        ) : !query ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
            <Search className="w-8 h-8 mb-2" />
            <p>Search for news</p>
          </div>
        ) : stories?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
            <p>No results found</p>
          </div>
        ) : (
          stories?.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onClick={() => {
                setActiveStory(story);
                setActiveView('detail');
                router.push('/');
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}