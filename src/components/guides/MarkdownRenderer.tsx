'use client';

import { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface Props {
  content: string;
}

export function MarkdownRenderer({ content }: Props) {
  const html = useMemo(() => {
    const rawHtml = marked.parse(content) as string;
    return DOMPurify.sanitize(rawHtml);
  }, [content]);

  return (
    <div
      className="guide-content max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
