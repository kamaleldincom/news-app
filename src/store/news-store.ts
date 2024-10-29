// src/store/news-store.ts

import { create } from 'zustand';
import { Story } from '@/types/news';

interface NewsState {
  activeStory: Story | null;
  activeTab: 'international' | 'local';
  activeView: 'feed' | 'detail' | 'search';
  stories: Story[];
  isLoading: boolean;
  error: string | null;
  setActiveStory: (story: Story | null) => void;
  setActiveTab: (tab: 'international' | 'local') => void;
  setActiveView: (view: 'feed' | 'detail' | 'search') => void;
  setStories: (stories: Story[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useNewsStore = create<NewsState>((set) => ({
  activeStory: null,
  activeTab: 'international',
  activeView: 'feed',
  stories: [],
  isLoading: false,
  error: null,
  setActiveStory: (story) => set({ activeStory: story }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveView: (view) => set({ activeView: view }),
  setStories: (stories) => set({ stories }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));