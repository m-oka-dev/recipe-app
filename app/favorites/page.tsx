"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { RECIPES, type Recipe } from "@/lib/recipes";

const FAV_KEY = "taste-daily:favorites:v1";

function clsx(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

function regionLabel(r: Recipe["region"]) {
  switch (r) {
    case "Asia":
      return "アジア";
    case "Europe":
      return "ヨーロッパ";
    case "Americas":
      return "南北アメリカ";
    case "Middle East":
      return "中東";
    case "Africa":
      return "アフリカ";
    case "Oceania":
      return "オセアニア";
  }
}

function difficultyLabel(d: Recipe["difficulty"]) {
  switch (d) {
    case "Easy":
      return "かんたん";
    case "Medium":
      return "ふつう";
    case "Hard":
      return "むずい";
  }
}

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) setFavoriteIds(parsed.filter((x) => typeof x === "string"));
    } catch {
      setFavoriteIds([]);
    }
  }, []);

  const favorites = useMemo(() => {
    const set = new Set(favoriteIds);
    // 保存順（先頭が最新）を保つ
    const byId: Record<string, Recipe> = Object.fromEntries(RECIPES.map((r) => [r.id, r]));
    return favoriteIds.map((id) => byId[id]).filter(Boolean);
  }, [favoriteIds]);

  const removeFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const next = prev.filter((x) => x !== id);
      try {
        localStorage.setItem(FAV_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const clearAll = () => {
    setFavoriteIds([]);
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify([]));
    } catch {}
  };

  const C = {
    bg: "bg-[#f6f1ea]",
    text: "text-[#3b2f2f]",
    muted: "text-[#7a6a5d]",
    border: "border-[#eadfd4]",
    card: "bg-white",
    btn: "bg-[#6b4f4f] hover:bg-[#5a3f3f] text-white",
    btnGhost: "bg-white hover:bg-[#faf6f1] text-[#4b3a34] border-[#eadfd4]",
  };

  return (
    <main className={clsx("min-h-screen", C.bg, C.text)}>
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">お気に入り</h1>
          <span className={clsx("text-sm", C.muted)}>♥ {favorites.length}</span>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/"
              className={clsx("rounded-xl border px-4 py-2 text-sm transition", C.btnGhost)}
            >
              ← 戻る
            </Link>
            <button
              onClick={clearAll}
              className={clsx("rounded-xl border px-4 py-2 text-sm transition", C.btnGhost)}
              disabled={favorites.length === 0}
              title="お気に入りを全削除"
            >
              全削除
            </button>
          </div>
        </div>

        <p className={clsx("mt-2 text-sm", C.muted)}>
          ブラウザに保存されています（別PC/別ブラウザでは共有されません）。
        </p>

        {favorites.length === 0 ? (
          <div className={clsx("mt-8 rounded-2xl border p-6", C.card, C.border)}>
            <p className="font-medium">まだお気に入りがありません。</p>
            <p className={clsx("mt-2 text-sm", C.muted)}>
              トップに戻って「♡ お気に入り」を押すと、ここに追加されます。
            </p>
            <Link
              href="/"
              className={clsx("mt-5 inline-block rounded-xl px-5 py-3 text-sm font-medium shadow-sm transition", C.btn)}
            >
              レシピを見に行く
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {favorites.map((r) => (
              <div key={r.id} className={clsx("overflow-hidden rounded-2xl border shadow-sm", C.card, C.border)}>
                <img src={r.imageUrl} alt={r.name} className="h-40 w-full object-cover" loading="lazy" />
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold leading-snug">{r.name}</h2>
                      <p className={clsx("mt-1 text-xs", C.muted)}>
                        {r.country} ・ {regionLabel(r.region)} ・ ⏱ 約{r.timeMin}分 ・ {difficultyLabel(r.difficulty)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFavorite(r.id)}
                      className={clsx("ml-auto shrink-0 rounded-xl border px-3 py-2 text-xs transition", C.btnGhost)}
                      title="お気に入りから外す"
                    >
                      ♥ 外す
                    </button>
                  </div>

                  <p className={clsx("mt-3 text-sm leading-relaxed", C.muted)}>{r.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}