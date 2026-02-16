import { useEffect } from 'react';
import { getOrCreateSessionId } from '@/lib/sessionId';

export function usePageTracking(
  pageType: 'tv' | 'monitor' | 'guide' | 'home',
  pageIdentifier?: string
) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sessionId = getOrCreateSessionId();
    const trackKey = `tracked-${pageType}-${pageIdentifier || 'main'}`;
    const lastTracked = sessionStorage.getItem(trackKey);
    if (lastTracked && Date.now() - parseInt(lastTracked) < 24 * 3600 * 1000) return;

    fetch('/api/analytics/page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page_type: pageType,
        page_identifier: pageIdentifier || null,
        session_id: sessionId,
      }),
    })
      .then(() => sessionStorage.setItem(trackKey, Date.now().toString()))
      .catch((err: unknown) => console.error('Tracking failed:', err));
  }, [pageType, pageIdentifier]);
}
