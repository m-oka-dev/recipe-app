"use client";

import { useMemo, useState } from "react";

type Recipe = {
  id: string;
  name: string;
  country: string;
  description: string;
  ingredients: string[];
  steps: string[];
};

const RECIPES: Recipe[] = [
  {
    id: "carbonara",
    name: "カルボナーラ",
    country: "イタリア",
    description: "卵・チーズ・胡椒で作る、濃厚でシンプルなパスタ。",
    ingredients: ["スパゲッティ", "卵", "チーズ", "黒胡椒", "ベーコン"],
    steps: ["パスタを茹でる", "ベーコンを炒める", "卵とチーズを混ぜる", "全部を和える"],
  },
  {
    id: "tacos",
    name: "タコス",
    country: "メキシコ",
    description: "トルティーヤに具材をのせて食べる。",
    ingredients: ["トルティーヤ", "ひき肉", "トマト", "レタス"],
    steps: ["具材を炒める", "トルティーヤにのせる"],
  },
  {
    id: "padthai",
    name: "パッタイ",
    country: "タイ",
    description: "甘酸っぱい米麺の炒め物。",
    ingredients: ["米麺", "卵", "えび", "もやし"],
    steps: ["具材を炒める", "麺を入れて混ぜる"],
  },
];

function pickRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function Home() {
  const [recipe, setRecipe] = useState(pickRandom(RECIPES));

  return (
    <main style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1>世界の料理ルーレット 🍽️</h1>

      <h2>{recipe.name}（{recipe.country}）</h2>
      <p>{recipe.description}</p>

      <h3>材料</h3>
      <ul>
        {recipe.ingredients.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>

      <h3>手順</h3>
      <ol>
        {recipe.steps.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ol>

      <button
        onClick={() => setRecipe(pickRandom(RECIPES))}
        style={{ marginTop: 20, padding: 10 }}
      >
        次のレシピ！
      </button>
    </main>
  );
}
