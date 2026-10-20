import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape' && !isLoading) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#FFFFFF] border border-[#E8E0D4] shadow-2xl rounded-lg overflow-hidden text-[#111111] font-sans"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        {/* Top Header */}
        <div className="p-5 flex items-start gap-3.5 border-b border-[#E8E0D4]">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isDanger ? 'bg-[#FFF2F2] text-[#B33939] border border-[#FFCDD2]' : 'bg-[#FFF9F0] text-[#F57F17] border border-[#FFE0B2]'
          }`}>
            {isDanger ? <Trash2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          
          <div className="flex-1 min-w-0 pr-2">
            <h3 id="confirm-modal-title" className="text-base font-bold text-[#111111] font-serif-luxury leading-snug">
              {title}
            </h3>
            <p className="mt-1 text-xs text-[#6B6B6B] leading-relaxed break-words font-mono-data">
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="text-[#6B6B6B] hover:text-[#111111] transition-colors p-1 rounded hover:bg-[#F8F5EF] disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-[#F8F5EF] flex items-center justify-end gap-3 border-t border-[#E8E0D4]">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-mono-data uppercase tracking-wider text-[#6B6B6B] hover:text-[#111111] hover:bg-[#FFFFFF] rounded border border-[#E8E0D4] transition-colors disabled:opacity-50 font-bold"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2 text-xs font-mono-data uppercase tracking-wider font-bold rounded flex items-center gap-1.5 transition-all shadow-md disabled:opacity-50 ${
              isDanger 
                ? 'bg-[#B33939] hover:bg-[#93000a] text-white' 
                : 'bg-[#111111] hover:bg-[#8A6D2F] text-[#FFE09D]'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{confirmLabel}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
