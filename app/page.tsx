"use client";

import { useEffect, useMemo, useState } from "react";
import { RECIPES, type Recipe } from "@/lib/recipes";
import Link from "next/link";
import { loadFavoriteIds, saveFavoriteIds, toggleFavoriteId } from "@/lib/favorites";
import { useSearchParams } from "next/navigation";

function pickRandom<T>(arr: T[], exclude?: T) {
  if (arr.length === 0) throw new Error("empty array");
  if (arr.length === 1) return arr[0];
  let next = arr[Math.floor(Math.random() * arr.length)];
  if (exclude) while (next === exclude) next = arr[Math.floor(Math.random() * arr.length)];
  return next;
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

function clsx(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

export default function Home() {
  const searchParams = useSearchParams();
  const requestedId = searchParams.get("id");
  const all = useMemo(() => RECIPES, []);
  const [regionFilter, setRegionFilter] = useState<Recipe["region"] | "All">("All");

  const filtered = useMemo(
    () => (regionFilter === "All" ? all : all.filter((r) => r.region === regionFilter)),
    [all, regionFilter]
  );

  // SSR安定 → 初回だけクライアントでランダム化
  const [recipe, setRecipe] = useState<Recipe>(() => filtered[0] ?? all[0]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
useEffect(() => {
  if (!toast) return;
  const t = window.setTimeout(() => setToast(null), 1200);
  return () => window.clearTimeout(t);
}, [toast]);
  // --- Favorites (localStorage) ---
const [favorites, setFavorites] = useState<string[]>([]);
const [favReady, setFavReady] = useState(false);

useEffect(() => {
  if (!requestedId) return;

  const found = all.find((r) => r.id === requestedId);
  if (found) {
    setRecipe(found);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [requestedId]);

useEffect(() => {
  setFavorites(loadFavoriteIds());
  setFavReady(true);
}, []);

useEffect(() => {
  if (!favReady) return; // ★読み込み前の空配列で上書きしない
  saveFavoriteIds(favorites);
}, [favorites, favReady]);

const isFavorite = useMemo(() => favorites.includes(recipe.id), [favorites, recipe.id]);

const toggleFavorite = () => {
  setFavorites((prev) => {
    const wasFav = prev.includes(recipe.id);
    const next = toggleFavoriteId(prev, recipe.id);
    setToast(wasFav ? "お気に入りから外しました" : "お気に入りに追加しました");
    return next;
  });
};

  useEffect(() => {
  // /?id=xxx で来たときはランダム化しない（指定レシピを優先）
  if (requestedId) return;

  setRecipe((prev) => pickRandom(filtered, prev));
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [requestedId]);

  const refreshWithinFilter = (nextRegion: typeof regionFilter) => {
    setRegionFilter(nextRegion);
    const nextList = nextRegion === "All" ? all : all.filter((r) => r.region === nextRegion);
    setRecipe((prev) => pickRandom(nextList, prev));
  };

  const nextRecipe = () => {
    setIsShuffling(true);
    window.setTimeout(() => {
      setRecipe((prev) => pickRandom(filtered, prev));
      setIsShuffling(false);
    }, 140);
  };

  
  // カフェ配色（1箇所でまとめ管理）
  const C = {
    bg: "bg-[#f6f1ea]",
    text: "text-[#3b2f2f]",
    muted: "text-[#7a6a5d]",
    border: "border-[#eadfd4]",
    card: "bg-white",
    chip: "bg-[#f2e8de] text-[#4b3a34] border-[#eadfd4]",
    btn: "bg-[#6b4f4f] hover:bg-[#5a3f3f] text-white",
    btnGhost: "bg-white hover:bg-[#faf6f1] text-[#4b3a34] border-[#eadfd4]",
  };

  return (
    <main className={clsx("min-h-screen", C.bg, C.text)}>
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header（縦並び固定） */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Taste Daily
            </h1>
            <p className={clsx("mt-2 max-w-2xl text-sm leading-relaxed", C.muted)}>
              Discover what to cook today.
            </p>
          </div>

          {/* Controls（上は軽く：フィルター＋コピーだけ） */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className={clsx("text-xs", C.muted)}>地域</span>
              <select
                value={regionFilter}
                onChange={(e) => refreshWithinFilter(e.target.value as any)}
                className={clsx(
                  "rounded-xl border px-3 py-2 text-sm outline-none",
                  C.card,
                  C.border,
                  "focus:ring-2 focus:ring-[#d9b18a]/40"
                )}
              >
                <option value="All">すべて</option>
                <option value="Asia">アジア</option>
                <option value="Europe">ヨーロッパ</option>
                <option value="Americas">南北アメリカ</option>
                <option value="Middle East">中東</option>
                <option value="Africa">アフリカ</option>
                <option value="Oceania">オセアニア</option>
              </select>
            </div>
            <Link
              href="/favorites"
              className={clsx(
                "ml-auto inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition",
                C.btnGhost
              )}
            >
              <span>♥ お気に入り</span>
              {favorites.length > 0 && (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#6b4f4f] px-2 text-xs text-white">
                  {favorites.length}
                </span>
              )}
            </Link>

            <button
              onClick={toggleFavorite}
              className={clsx("rounded-xl border px-4 py-2 text-sm transition", C.btnGhost)}
              aria-pressed={isFavorite}
            >
              {isFavorite ? "♥ お気に入りに保存済み" : "♡ お気に入りに保存する"}
            </button>
          </div>
        </div>

        {/* Layout（常に縦並び） */}
        <div className="mt-8 flex flex-col gap-6">
          {/* Hero Card */}
          <div>
            <div
              className={clsx(
                "overflow-hidden rounded-2xl border shadow-sm",
                C.card,
                C.border,
                isShuffling && "opacity-80"
              )}
            >
              <div className="relative">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="h-64 w-full object-cover md:h-80"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3b2f2f]/90 via-[#3b2f2f]/45 to-transparent md:from-[#3b2f2f]/75 md:via-[#3b2f2f]/25" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl text-white">
                      {recipe.name}
                    </h2>
                    <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs text-white">
                      {recipe.country}
                    </span>
                    <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs text-white">
                      {regionLabel(recipe.region)}
                    </span>
                  </div>

                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/90">
                    {recipe.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs text-white">
                      ⏱ 約{recipe.timeMin}分
                    </span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs text-white">
                      ✨ {difficultyLabel(recipe.difficulty)}
                    </span>
                    {recipe.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/20 bg-black/10 px-3 py-1 text-xs text-white/95"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer：ボタンはここだけ（1つに統一） */}
              <div className={clsx("flex items-center gap-3 border-t p-4", C.border)}>
                <button
                  onClick={nextRecipe}
                  className={clsx("w-full sm:w-auto rounded-xl px-5 py-3 text-sm font-medium shadow-sm transition", C.btn)}
                >
                  次のレシピ
                </button>
                <div className={clsx("ml-auto text-xs", C.muted)}>{filtered.length} recipes</div>
              </div>
            </div>
          </div>

          {/* Ingredients + Steps（カードは分けて縦並び） */}
          <div className={clsx("rounded-2xl border p-6 shadow-sm", C.card, C.border)}>
            <h3 className="text-sm font-semibold">材料</h3>
            <ul className={clsx("mt-3 space-y-2 text-sm", C.muted)}>
              {recipe.ingredients.map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#cfa77a]" />
                  <span className="leading-relaxed">{x}</span>
                </li>
              ))}
            </ul>

            <div className={clsx("mt-6 border-t pt-5", C.border)}>
              <h3 className="text-sm font-semibold">手順</h3>
              <ol className={clsx("mt-3 space-y-3 text-sm", C.muted)}>
                {recipe.steps.map((x, i) => (
                  <li key={x} className="flex gap-3">
                    <span
                      className={clsx(
                        "flex h-6 w-6 items-center justify-center rounded-lg border text-xs",
                        C.border,
                        "bg-[#faf6f1]"
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{x}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    {toast && (
  <div className="fixed bottom-5 right-5 z-50">
    <div className={clsx("rounded-xl border px-4 py-3 text-sm shadow-sm", C.card, C.border)}>
      {toast}
    </div>
  </div>
)}
    </main>
  );
}