// src/hooks/useNews.ts

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import NewsService from '@/lib/news-service';
import { FetchStoriesParams, Story } from '@/types/news';
import { useNewsStore } from '@/store/news-store';

export function useNews(params: FetchStoriesParams = {}) {
  const setStories = useNewsStore(state => state.setStories);
  const setError = useNewsStore(state => state.setError);
  const setLoading = useNewsStore(state => state.setLoading);

  return useQuery<Story[], Error>({
    queryKey: ['news', params],
    queryFn: () => NewsService.getInstance().fetchStories(params),
    onSuccess: (data) => {
      setStories(data);
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
    },
    onSettled: () => {
      setLoading(false);
    }
  });
}

export function useNewsSearch(query: string) {
  return useQuery<Story[], Error>({
    queryKey: ['news-search', query],
    queryFn: () => NewsService.getInstance().searchStories(query),
    enabled: query.length > 0
  });
}

export function useInfiniteNews(params: FetchStoriesParams = {}) {
  return useInfiniteQuery<Story[], Error>({
    queryKey: ['infinite-news', params],
    queryFn: ({ pageParam = 1 }) => 
      NewsService.getInstance().fetchStories({ ...params, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => 
      lastPage.length === 20 ? allPages.length + 1 : undefined,
  });
}