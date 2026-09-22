"use client";

import { useEffect, useState } from "react";
import { AuthContext } from "@/lib/user-context";
import { initLiff, getLiffProfile } from "@/lib/liff";
import { upsertUserOnLogin } from "@/lib/firestore";
import type { AppUser } from "@/lib/types";

/**
 * LIFF初期化 → LINEプロフィール取得 → users コレクション登録/更新 を行うプロバイダ。
 * LIFF SDK はブラウザでのみ動作するため、このプロバイダは dynamic(import, {ssr:false})
 * で読み込むこと（src/app/page.tsx を参照）。
 */
export default function LiffProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await initLiff();
        const profile = await getLiffProfile();
        const u = await upsertUserOnLogin(profile);
        if (!cancelled) {
          setUser(u);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "LIFFの初期化に失敗しました"
          );
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {error ? (
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
