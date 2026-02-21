'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { AnalysisResult } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import { escapeHtml } from '@/lib/utils';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatPanelProps {
  analysis: AnalysisResult;
}

const QUICK_ACTION_PROMPTS = [
  'Rewrite my professional summary / CV headline optimized for my primary target role. Make it compelling, keyword-rich, and ready to copy-paste. Then list the top 5 keywords I must have in my CV for ATS screening.',
  'Generate the 10 most likely interview questions for my target role. For each, write a strong suggested answer using my actual experience and skills. Also include how to address my biggest gaps if the interviewer brings them up.',
  'Based on my analysis, create a concrete day-by-day plan for this week (Mon-Fri). Each day: 1-2 specific tasks I can finish in 1-2 hours. Prioritize the highest-impact items from my 30-day plan.',
  'Compare all my recommended roles in a decision matrix. For each: fit score, salary range, time to ready, biggest advantage, biggest risk, and whether it leads to my long-term goal. Give me a clear recommendation with reasoning.',
  'Write 3 different LinkedIn cold outreach messages I can send to hiring managers at my target companies. One formal, one casual, one that leads with a specific project. Reference my actual strengths and make each under 300 characters.',
  'Take my most critical skill gap and give me the complete roadmap to close it: week-by-week study plan, specific free resources with URLs, a mini-project to prove the skill, and exactly how to present it on my CV once done.',
  'Write me a complete salary negotiation playbook for my target role. Include: the exact range to ask for, 3 anchoring phrases using my strengths, how to respond to lowball offers, what to negotiate beyond base salary, and a word-for-word script for the money conversation.',
  'Suggest 3 portfolio projects I can build in 1-2 weeks each that would directly demonstrate the skills my target role requires. For each: project name, what it proves, tech stack, and a 1-paragraph README description I can use on GitHub.',
];

const QUICK_ACTION_ICONS = [
  <svg key="0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  <svg key="1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  <svg key="2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  <svg key="3" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  <svg key="4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  <svg key="5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  <svg key="6" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  <svg key="7" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
];

function renderMarkdown(text: string): string {
  // First escape HTML to prevent XSS, then apply markdown formatting
  let safe = escapeHtml(text);
  return safe
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-black/[0.04] rounded-lg p-3 my-2 overflow-x-auto text-xs border border-black/[0.06]"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-primary/[0.06] rounded px-1.5 py-0.5 text-xs text-primary font-medium">$1</code>')
    .replace(/^### (.+)$/gm, '<h4 class="font-semibold text-text-primary mt-3 mb-1">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="font-semibold text-text-primary text-lg mt-4 mb-1.5">$1</h3>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/^Q: (.+)$/gm, '<p class="font-semibold text-primary mt-3">Q: $1</p>')
    .replace(/^A: /gm, '<p class="mt-1">A: ')
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/([^>])\n([^<])/g, '$1<br/>$2');
}

export default function ChatPanel({ analysis }: ChatPanelProps) {
  const { t, locale } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
  };

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isStreaming) return;

    const userMessage: ChatMessage = { role: 'user', content: messageText.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setShowQuickActions(false);
    setIsStreaming(true);

    if (inputRef.current) inputRef.current.style.height = 'auto';

    const assistantMessage: ChatMessage = { role: 'assistant', content: '' };
    setMessages([...newMessages, assistantMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, analysis, language: locale }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Chat request failed');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: fullText };
          return updated;
        });
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: `${t('chat.errorPrefix')} ${errMsg}` };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }, [messages, isStreaming, analysis, locale, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // ── Full-page layout ──
  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] sm:h-[calc(100vh-12rem)] lg:h-[calc(100vh-11rem)] min-h-[400px] -mx-4 sm:-mx-6 -mb-20 sm:-mb-12">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 scrollbar-thin">
        {/* Welcome / empty state */}
        {messages.length === 0 && (
          <div className="max-w-3xl mx-auto">
            {/* Welcome header */}
            <div className="text-center mb-8 pt-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/[0.08] border border-primary/15 flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8890A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-text-primary font-display mb-2">{t('chat.title')}</h2>
              <p className="text-text-secondary text-sm max-w-lg mx-auto">{t('chat.welcomeHint')}</p>
            </div>

            {/* Quick actions grid */}
            {showQuickActions && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {QUICK_ACTION_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt)}
                    className="group text-left p-4 rounded-xl border border-black/[0.08] bg-white hover:border-primary/30 hover:bg-primary/[0.03] hover:shadow-md hover:shadow-primary/[0.04] transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/[0.06] border border-primary/10 flex items-center justify-center text-primary/70 group-hover:text-primary group-hover:bg-primary/[0.10] transition-colors">
                        {QUICK_ACTION_ICONS[i]}
                      </span>
                      <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors leading-relaxed">
                        {t(`chat.actions.${i}`)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chat messages */}
        {messages.length > 0 && (
          <div className="max-w-3xl mx-auto space-y-5">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/[0.08] border border-primary/15 flex items-center justify-center mr-3 mt-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8890A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-white border border-black/[0.08] rounded-bl-md shadow-sm'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  ) : msg.content ? (
                    <div
                      className="text-sm text-text-primary prose-sm leading-relaxed [&_li]:text-text-primary [&_strong]:text-text-primary [&_h3]:text-text-primary [&_h4]:text-text-primary"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                    />
                  ) : (
                    <div className="flex items-center gap-1.5 py-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input bar - pinned to bottom */}
      <div className="flex-shrink-0 border-t border-black/[0.08] bg-white/80 backdrop-blur-xl px-4 sm:px-6 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={() => { setMessages([]); setShowQuickActions(true); }}
                className="flex-shrink-0 w-9 h-9 rounded-xl border border-black/[0.08] bg-black/[0.03] hover:bg-black/[0.06] text-text-tertiary hover:text-text-primary flex items-center justify-center transition-all"
                aria-label={t('chat.clearChat')}
                title={t('chat.clearChat')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
              </button>
            )}
            <form onSubmit={handleSubmit} className="flex-1 flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={t('chat.inputPlaceholder')}
                rows={1}
                disabled={isStreaming}
                className="flex-1 bg-black/[0.03] border border-black/[0.08] rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary resize-none focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-accent-orange text-white flex items-center justify-center transition-all disabled:opacity-30 hover:shadow-lg hover:shadow-primary/20"
                aria-label="Send message"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}