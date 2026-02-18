'use client';

import { useState, useCallback, useRef } from 'react';
import type { AnalysisResult } from '@/lib/types';

export interface StreamStep {
  step: string;
  progress: number;
  message: string;
}

interface StreamEvent {
  step: string;
  progress?: number;
  message?: string;
  data?: Partial<AnalysisResult>;
  totalTime?: string;
}

export interface StreamingState {
  /** Current pipeline step info */
  currentStep: StreamStep;
  /** Partial result that builds up as sections complete */
  partialResult: Partial<AnalysisResult> | null;
  /** Final complete result (only set when step === 'complete') */
  result: AnalysisResult | null;
  /** Whether analysis is in progress */
  isStreaming: boolean;
  /** Error message if pipeline fails */
  error: string | null;
  /** Sections that have arrived (for fade-in) */
  readySections: Set<string>;
}

const INITIAL_STEP: StreamStep = { step: 'idle', progress: 0, message: '' };

export function useStreamingAnalysis() {
  const [currentStep, setCurrentStep] = useState<StreamStep>(INITIAL_STEP);
  const [partialResult, setPartialResult] = useState<Partial<AnalysisResult> | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readySections, setReadySections] = useState<Set<string>>(new Set());
  const abortRef = useRef<AbortController | null>(null);

  const startAnalysis = useCallback(async (formData: FormData) => {
    // Reset state
    setCurrentStep({ step: 'starting', progress: 2, message: 'Starting analysis...' });
    setPartialResult(null);
    setResult(null);
    setError(null);
    setReadySections(new Set());
    setIsStreaming(true);

    // Abort previous if any
    if (abortRef.current) abortRef.current.abort();
    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      const response = await fetch('/api/analyze-stream', {
        method: 'POST',
        body: formData,
        signal: abortController.signal,
      });

      // Non-SSE error response (validation errors return JSON)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Analysis failed. Please try again.');
      }

      if (!response.body) {
        throw new Error('No response stream available.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Parse SSE events (data: {...}\n\n)
        const lines = buffer.split('\n\n');
        // Keep last incomplete chunk in buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;

          try {
            const event: StreamEvent = JSON.parse(trimmed.slice(6));
            handleEvent(event);
          } catch {
            // Skip malformed events
          }
        }
      }

      // Process any remaining buffer
      if (buffer.trim().startsWith('data: ')) {
        try {
          const event: StreamEvent = JSON.parse(buffer.trim().slice(6));
          handleEvent(event);
        } catch {
          // Ignore
        }
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      setCurrentStep({ step: 'error', progress: 0, message });
    } finally {
      setIsStreaming(false);
    }

    function handleEvent(event: StreamEvent) {
      // Update step
      if (event.progress !== undefined) {
        setCurrentStep({
          step: event.step,
          progress: event.progress,
          message: event.message || '',
        });
      }

      // Handle error
      if (event.step === 'error') {
        setError(event.message || 'Analysis failed.');
        setIsStreaming(false);
        return;
      }

      // Gap analysis results — first batch of visible data
      if (event.step === 'gap_done' && event.data) {
        setPartialResult((prev) => ({
          ...prev,
          metadata: prev?.metadata || {
            analyzedAt: new Date().toISOString(),
            cvFileName: '',
            targetRole: '',
            country: '',
          },
          fitScore: event.data!.fitScore,
          strengths: event.data!.strengths,
          gaps: event.data!.gaps,
          roleRecommendations: event.data!.roleRecommendations,
        }));
        setReadySections((prev) => {
          const next = new Set(Array.from(prev));
          ['fitScore', 'strengths', 'gaps', 'roleRecommendations'].forEach((s) => next.add(s));
          return next;
        });
      }

      // Career plan + salary + job match
      if (event.step === 'plan_done' && event.data) {
        setPartialResult((prev) => ({
          ...prev,
          actionPlan: event.data!.actionPlan,
          salaryAnalysis: event.data!.salaryAnalysis,
          ...(event.data!.jobMatch && { jobMatch: event.data!.jobMatch }),
        }));
        const newSections = ['actionPlan', 'salaryAnalysis'];
        if (event.data!.jobMatch) newSections.push('jobMatch');
        setReadySections((prev) => {
          const next = new Set(Array.from(prev));
          newSections.forEach((s) => next.add(s));
          return next;
        });
      }

      // Complete — set final result (may be translated)
      if (event.step === 'complete' && event.data) {
        const finalResult = event.data as AnalysisResult;
        setResult(finalResult);
        setPartialResult(null); // Clear partial, use final
        setReadySections(new Set([
          'fitScore', 'strengths', 'gaps', 'roleRecommendations',
          'actionPlan', 'salaryAnalysis', 'jobMatch', 'chat',
        ]));
      }
    }
  }, []);

  const cancelAnalysis = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsStreaming(false);
    setCurrentStep(INITIAL_STEP);
  }, []);

  const reset = useCallback(() => {
    cancelAnalysis();
    setPartialResult(null);
    setResult(null);
    setError(null);
    setReadySections(new Set());
  }, [cancelAnalysis]);

  return {
    currentStep,
    partialResult,
    result,
    isStreaming,
    error,
    readySections,
    startAnalysis,
    cancelAnalysis,
    reset,
  };
}