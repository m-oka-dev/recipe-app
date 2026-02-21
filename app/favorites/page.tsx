"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { RECIPES, type Recipe } from "@/lib/recipes";
import { loadFavoriteIds } from "@/lib/favorites";

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
    setFavoriteIds(loadFavoriteIds());
  }, []);

  const favorites = useMemo(() => {
    const byId: Record<string, Recipe> = Object.fromEntries(
      RECIPES.map((r) => [r.id, r])
    );
    return favoriteIds.map((id) => byId[id]).filter(Boolean);
  }, [favoriteIds]);

  const C = {
    bg: "bg-[#f6f1ea]",
    text: "text-[#3b2f2f]",
    muted: "text-[#7a6a5d]",
    border: "border-[#eadfd4]",
    card: "bg-white",
    btnGhost: "bg-white hover:bg-[#faf6f1] text-[#4b3a34] border-[#eadfd4]",
  };

  return (
    <main className={clsx("min-h-screen", C.bg, C.text)}>
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">お気に入り</h1>
          <span className={clsx("text-sm", C.muted)}>♥ {favorites.length}</span>

          <div className="ml-auto">
            <Link
              href="/"
              className={clsx(
                "rounded-xl border px-4 py-2 text-sm transition",
                C.btnGhost
              )}
            >
              ← 戻る
            </Link>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className={clsx("mt-8 rounded-2xl border p-6", C.card, C.border)}>
            <p className="font-medium">まだお気に入りがありません。</p>
            <p className={clsx("mt-2 text-sm", C.muted)}>
              トップに戻って「♡ 保存」を押すと、ここに追加されます。
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {favorites.map((r) => (
              <Link
                key={r.id}
                href={`/?id=${encodeURIComponent(r.id)}`}
                className={clsx(
                  "block overflow-hidden rounded-2xl border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                  C.card,
                  C.border
                )}
              >
                <img
                  src={r.imageUrl}
                  alt={r.name}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
                <div className="p-5">
                  <h2 className="text-lg font-semibold leading-snug">
                    {r.name}
                  </h2>
                  <p className={clsx("mt-1 text-xs", C.muted)}>
                    {r.country} ・ {regionLabel(r.region)} ・ ⏱ 約{r.timeMin}分 ・{" "}
                    {difficultyLabel(r.difficulty)}
                  </p>

                  <p className={clsx("mt-3 text-sm leading-relaxed", C.muted)}>
                    {r.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}