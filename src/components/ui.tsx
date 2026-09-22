"use client";

import { useEffect, useState } from "react";

type ToastType = "success" | "error";

export type ToastState = {
  type: ToastType;
  message: string;
} | null;

/** 保存成功トースト / エラー表示 */
export function Toast({ state }: { state: ToastState }) {
  if (!state) return null;
  const bg =
    state.type === "success"
      ? "bg-emerald-600"
      : "bg-red-600";
  return (
    <div className="fixed bottom-20 left-0 right-0 flex justify-center z-50 px-4">
      <div
        role="alert"
        className={`${bg} text-white text-sm rounded-full px-5 py-2.5 shadow-lg max-w-sm w-full text-center`}
      >
        {state.message}
      </div>
    </div>
  );
}

/** トーストを表示するフック（4秒後に自動で消える） */
export function useToast() {
  const [state, setState] = useState<ToastState>(null);
  const show = (type: ToastType, message: string) => {
    setState({ type, message });
    window.setTimeout(() => setState(null), 4000);
  };
  return { state, show };
}

export function Loading({ label = "読み込み中…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-ballet-200 border-t-ballet-600" />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
      {label}
    </div>
  );
}
