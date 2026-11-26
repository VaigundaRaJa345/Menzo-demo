import React from 'react';
import { Check, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ToastBanner: React.FC = () => {
  const { toast, dismissToast } = useStore();

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 left-4 md:left-6 z-50 bg-[#111111] text-[#FAF9F7] px-4 py-3 border border-white/15 shadow-xl flex items-center gap-3 max-w-sm"
    >
      <Check className="w-4 h-4 text-[#EAE6DF] shrink-0" />
      <p className="text-xs leading-snug flex-1">{toast.message}</p>
      {toast.actionLabel && toast.onAction && (
        <button
          type="button"
          onClick={() => {
            toast.onAction?.();
            dismissToast();
          }}
          className="text-xs font-medium underline underline-offset-4 text-white whitespace-nowrap shrink-0"
        >
          {toast.actionLabel}
        </button>
      )}
      <button
        type="button"
        onClick={dismissToast}
        aria-label="Dismiss notification"
        className="text-[#9A9389] hover:text-white p-0.5 shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
