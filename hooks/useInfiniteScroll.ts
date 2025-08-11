import { useState, useEffect, useRef, useCallback } from 'react';
import { Message } from '@/utils/types';

export const useInfiniteScroll = (items: Message[], itemsPerPage: number) => {
  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<Message[]>([]);
  const loadingRef = useRef<HTMLDivElement>(null);

  const totalItems = items.length;
  const hasMore = (page * itemsPerPage) < totalItems;

  const fetchMore = useCallback(() => {
    if (!hasMore) return;

    const start = totalItems - (page + 1) * itemsPerPage;
    const end = totalItems - page * itemsPerPage;
    const newItems = items.slice(Math.max(0, start), end).reverse();

    if (newItems.length > 0) {
      setVisibleItems(prev => [...newItems, ...prev]);
      setPage(prev => prev + 1);
    }
  }, [items, page, itemsPerPage, totalItems, hasMore]);

  useEffect(() => {
    const initialItems = items.slice(-itemsPerPage).reverse();
    setVisibleItems(initialItems);
    setPage(1);
  }, [items, itemsPerPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [fetchMore, hasMore]);

  return { visibleItems, loadingRef, hasMore };
};