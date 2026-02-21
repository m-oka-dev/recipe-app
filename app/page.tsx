"use client";

import { useEffect, useMemo, useState } from "react";
import { RECIPES, type Recipe } from "@/lib/recipes";



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

export default function Home() {
  const all = useMemo(() => RECIPES, []);
  const [regionFilter, setRegionFilter] = useState<Recipe["region"] | "All">("All");
  const filtered = useMemo(
    () => (regionFilter === "All" ? all : all.filter((r) => r.region === regionFilter)),
    [all, regionFilter]
  );

  const [recipe, setRecipe] = useState<Recipe>(() => filtered[0] ?? all[0]);
  useEffect(() => {
  setRecipe((prev) => pickRandom(filtered, prev));
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const refreshWithinFilter = (nextRegion: typeof regionFilter) => {
    setRegionFilter(nextRegion);
    const nextList = nextRegion === "All" ? all : all.filter((r) => r.region === nextRegion);
    setRecipe((prev) => pickRandom(nextList, prev));
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">世界の料理ルーレット 🍽️</h1>

        <select
          value={regionFilter}
          onChange={(e) => refreshWithinFilter(e.target.value as any)}
          className="mb-6 p-2 rounded bg-zinc-800"
        >
          <option value="All">すべて</option>
          <option value="Asia">アジア</option>
          <option value="Europe">ヨーロッパ</option>
          <option value="Americas">南北アメリカ</option>
        </select>

        <div className="bg-zinc-900 p-6 rounded-xl shadow">
          <div className="mt-4 overflow-hidden rounded-xl border border-zinc-800">
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="h-56 w-full object-cover"
          loading="lazy"
  />
</div>
          <h2 className="text-2xl font-semibold">
            {recipe.name}（{recipe.country}）
          </h2>

          <p className="mt-3 text-zinc-300">{recipe.description}</p>

          <div className="mt-4 text-sm text-zinc-400">
            ⏱ {recipe.timeMin}分 / {difficultyLabel(recipe.difficulty)}
          </div>

          <h3 className="mt-6 font-semibold">材料</h3>
          <ul className="list-disc pl-6">
            {recipe.ingredients.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>

          <h3 className="mt-6 font-semibold">手順</h3>
          <ol className="list-decimal pl-6">
            {recipe.steps.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ol>

          <button
            onClick={() => setRecipe((prev) => pickRandom(filtered, prev))}
            className="mt-6 bg-white text-black px-4 py-2 rounded"
          >
            次のレシピ
          </button>
        </div>
      </div>
    </main>
  );
}
