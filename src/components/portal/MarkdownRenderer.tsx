// src/components/portal/MarkdownRenderer.tsx
'use client'
import ReactMarkdown from 'react-markdown'
import { cn } from '@/lib/utils'

export function MarkdownRenderer({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn('prose prose-sm max-w-none', className)}>
      <style>{`
        .prose { color: #93c5fd; }
        .prose h1, .prose h2, .prose h3 { color: #eff6ff; font-weight: 700; margin-top: 1.25em; }
        .prose p { color: #93c5fd; line-height: 1.7; margin: 0.75em 0; }
        .prose ul, .prose ol { color: #93c5fd; padding-left: 1.25em; }
        .prose li { margin: 0.25em 0; }
        .prose strong { color: #eff6ff; }
        .prose code { color: #38bdf8; background: rgba(59,130,246,0.1); padding: 0.1em 0.4em; border-radius: 4px; font-size: 0.85em; }
        .prose pre { background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2); border-radius: 8px; padding: 1em; overflow-x: auto; }
        .prose a { color: #38bdf8; text-decoration: underline; }
        .prose blockquote { border-left: 3px solid rgba(59,130,246,0.4); padding-left: 1em; color: #1e3a5f; }
      `}</style>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
