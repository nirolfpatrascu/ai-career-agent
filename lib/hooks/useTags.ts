'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/context';
import type { OutputTag } from '@/lib/types';

/**
 * Hook to manage tags for a specific analysis.
 * Fetches existing tags on mount and provides add/remove callbacks.
 */
export function useTags(analysisId: string | undefined) {
  const { session } = useAuth();
  const [tags, setTags] = useState<OutputTag[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing tags for this analysis
  useEffect(() => {
    if (!analysisId || !session?.access_token) return;

    setLoading(true);
    fetch(`/api/tags?analysisId=${analysisId}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.tags) setTags(data.tags);
      })
      .catch(() => { /* Non-critical */ })
      .finally(() => setLoading(false));
  }, [analysisId, session?.access_token]);

  const addTag = useCallback((tag: OutputTag) => {
    setTags(prev => [...prev, tag]);
  }, []);

  const removeTag = useCallback((tagId: string) => {
    setTags(prev => prev.filter(t => t.id !== tagId));
  }, []);

  return { tags, loading, addTag, removeTag };
}
