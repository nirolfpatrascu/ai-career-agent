'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { AnalysisResult } from '@/lib/types';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatPanelProps {
  analysis: AnalysisResult;
}

const QUICK_ACTIONS = [
  { label: '✍️ Rewrite my CV summary for target role', prompt: 'Rewrite my professional summary / CV headline optimized for my primary target role. Make it compelling, keyword-rich, and ready to copy-paste. Then list the top 5 keywords I must have in my CV for ATS screening.' },
  { label: '🎯 Top 10 interview questions + answers', prompt: 'Generate the 10 most likely interview questions for my target role. For each, write a strong suggested answer using my actual experience and skills. Also include how to address my biggest gaps if the interviewer brings them up.' },
  { label: '⚡ My 5-day action plan for this week', prompt: 'Based on my analysis, create a concrete day-by-day plan for this week (Mon-Fri). Each day: 1-2 specific tasks I can finish in 1-2 hours. Prioritize the highest-impact items from my 30-day plan.' },
  { label: '🤔 Which role should I pursue first?', prompt: 'Compare all my recommended roles in a decision matrix. For each: fit score, salary range, time to ready, biggest advantage, biggest risk, and whether it leads to my long-term goal. Give me a clear recommendation with reasoning.' },
  { label: '📝 Write a cold outreach message', prompt: 'Write 3 different LinkedIn cold outreach messages I can send to hiring managers at my target companies. One formal, one casual, one that leads with a specific project. Reference my actual strengths and make each under 300 characters.' },
  { label: '🔍 How do I close my #1 skill gap?', prompt: 'Take my most critical skill gap and give me the complete roadmap to close it: week-by-week study plan, specific free resources with URLs, a mini-project to prove the skill, and exactly how to present it on my CV once done.' },
  { label: '💰 Salary negotiation playbook', prompt: 'Write me a complete salary negotiation playbook for my target role. Include: the exact range to ask for, 3 anchoring phrases using my strengths, how to respond to lowball offers, what to negotiate beyond base salary, and a word-for-word script for the money conversation.' },
  { label: '🏗️ Portfolio project ideas', prompt: 'Suggest 3 portfolio projects I can build in 1-2 weeks each that would directly demonstrate the skills my target role requires. For each: project name, what it proves, tech stack, and a 1-paragraph README description I can use on GitHub.' },
];

/**
 * Minimal markdown renderer — handles **bold**, bullet lists, headers, and code blocks
 */
function renderMarkdown(text: string): string {
  return text
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-background rounded-lg p-3 my-2 overflow-x-auto text-xs"><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-background rounded px-1.5 py-0.5 text-xs text-primary">$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h4 class="font-semibold text-text-primary mt-3 mb-1">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="font-semibold text-text-primary text-lg mt-4 mb-1.5">$1</h3>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>')
    // Italic
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Bullet lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    // Numbered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    // Q/A format
    .replace(/^Q: (.+)$/gm, '<p class="font-semibold text-primary mt-3">Q: $1</p>')
    .replace(/^A: /gm, '<p class="mt-1">A: ')
    // Paragraphs (double newlines)
    .replace(/\n\n/g, '</p><p class="mt-2">')
    // Single newlines (only within text, not after HTML)
    .replace(/([^>])\n([^<])/g, '$1<br/>$2');
}

export default function ChatPanel({ analysis }: ChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isStreaming) return;

    const userMessage: ChatMessage = { role: 'user', content: messageText.trim() };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput('');
    setShowQuickActions(false);
    setIsStreaming(true);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    // Add empty assistant message for streaming
    const assistantMessage: ChatMessage = { role: 'assistant', content: '' };
    setMessages([...newMessages, assistantMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          analysis,
        }),
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

        // Update the last (assistant) message
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: fullText };
          return updated;
        });
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Something went wrong';
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: `Sorry, I couldn't process that request. ${errMsg}. Please try again.`,
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }, [messages, isStreaming, analysis]);

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

  // Floating button when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary-light hover:scale-105 transition-all duration-200 group"
        aria-label="Open AI Career Coach chat"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {messages.length === 0 && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-success rounded-full border-2 border-background animate-pulse" />
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[440px] h-[100dvh] sm:h-[600px] sm:max-h-[80vh] flex flex-col bg-card border border-card-border sm:rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-card-border bg-card flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">AI Career Coach</h3>
            <p className="text-xs text-text-secondary">Ask anything about your analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={() => { setMessages([]); setShowQuickActions(true); }}
              className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-background"
              aria-label="Clear chat"
              title="Clear chat"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-background"
            aria-label="Close chat"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin">
        {/* Welcome state */}
        {messages.length === 0 && (
          <div className="space-y-4">
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
              <p className="text-sm text-text-primary font-medium mb-1">
                👋 I&apos;ve read your full career analysis.
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">
                Ask me anything — deep-dive into gaps, get interview prep, rewrite your CV, compare roles, or plan your week. I have all your data.
              </p>
            </div>

            {showQuickActions && (
              <div>
                <p className="text-xs text-text-secondary font-medium mb-2 uppercase tracking-wider">Quick actions</p>
                <div className="grid grid-cols-1 gap-1.5">
                  {QUICK_ACTIONS.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(action.prompt)}
                      className="text-left px-3 py-2.5 rounded-lg border border-card-border bg-background hover:border-primary/40 hover:bg-primary/5 transition-all text-xs text-text-secondary hover:text-text-primary"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat messages */}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-md'
                  : 'bg-background border border-card-border rounded-bl-md'
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

      {/* Input */}
      <div className="px-4 py-3 border-t border-card-border bg-card flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your analysis..."
            rows={1}
            disabled={isStreaming}
            className="flex-1 bg-background border border-card-border rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary resize-none focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-light transition-colors disabled:opacity-30 disabled:hover:bg-primary flex-shrink-0"
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
  );
}