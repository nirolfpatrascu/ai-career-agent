'use client';

import { useCallback, useState, useRef } from 'react';
import { formatFileSize } from '@/lib/utils';

interface CVUploadProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

export default function CVUpload({ file, onFileSelect }: CVUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSet = useCallback(
    (selectedFile: File) => {
      setError('');

      if (selectedFile.type !== 'application/pdf') {
        setError('Only PDF files are accepted.');
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB.');
        return;
      }

      onFileSelect(selectedFile);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        validateAndSet(droppedFile);
      }
    },
    [validateAndSet]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        validateAndSet(selectedFile);
      }
    },
    [validateAndSet]
  );

  const handleRemove = useCallback(() => {
    onFileSelect(null);
    setError('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [onFileSelect]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text-primary">
        Upload Your CV
        <span className="text-text-secondary font-normal ml-1">(PDF, max 5MB)</span>
      </label>

      {!file ? (
        /* Drop zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-card-border hover:border-primary/50 hover:bg-card'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileInput}
            className="hidden"
            id="cv-upload"
          />

          <div className="flex flex-col items-center gap-3">
            {/* Upload icon */}
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-200 ${
                isDragging ? 'bg-primary/20 text-primary' : 'bg-card text-text-secondary'
              }`}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>

            <div>
              <p className="text-text-primary font-medium">
                {isDragging ? 'Drop your CV here' : 'Drop your CV here or click to browse'}
              </p>
              <p className="text-sm text-text-secondary mt-1">
                PDF format, up to 5MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* File preview */
        <div className="bg-card border border-card-border rounded-xl p-5">
          <div className="flex items-center gap-4">
            {/* PDF icon */}
            <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>

            {/* File info */}
            <div className="flex-1 min-w-0">
              <p className="text-text-primary font-medium truncate">{file.name}</p>
              <p className="text-sm text-text-secondary">
                {formatFileSize(file.size)} • PDF
              </p>
            </div>

            {/* Checkmark */}
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            {/* Remove button */}
            <button
              onClick={handleRemove}
              className="text-text-secondary hover:text-danger transition-colors p-1"
              aria-label="Remove file"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-sm text-danger flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
