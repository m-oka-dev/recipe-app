"use client";

import { useState } from "react";

const REGIONS = ["Asia", "Europe", "Americas", "Middle East", "Africa", "Oceania"] as const;
const DIFFS = ["Easy", "Medium", "Hard"] as const;

export default function SubmitPage() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState<(typeof REGIONS)[number]>("Asia");
  const [timeMin, setTimeMin] = useState(30);
  const [difficulty, setDifficulty] = useState<(typeof DIFFS)[number]>("Medium");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setMsg(null);
    const payload = {
      name,
      country,
      region,
      timeMin,
      difficulty,
      description,
      ingredients: ingredients.split("\n").map((s) => s.trim()).filter(Boolean),
      steps: steps.split("\n").map((s) => s.trim()).filter(Boolean),
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
      imageUrl,
    };

    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 401) {
      // ログインへ（ログイン後に /submit に戻す）
      const cb = encodeURIComponent("/submit");
      window.location.href = `/api/auth/signin?callbackUrl=${cb}`;
      return;
    }

    if (!res.ok) {
      const t = await res.text();
      setMsg(`投稿失敗: ${t}`);
      setBusy(false);
      return;
    }

    setMsg("投稿できました！トップに戻って確認してね。");
    setBusy(false);
  };

  return (
    <main className="min-h-screen bg-[#f6f1ea] text-[#3b2f2f]">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">レシピ投稿</h1>
        <p className="mt-2 text-sm text-[#7a6a5d]">
          hogehoge
        </p>

        <div className="mt-8 space-y-4 rounded-2xl border border-[#eadfd4] bg-white p-6 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              名前
              <input className="mt-1 w-full rounded-xl border border-[#eadfd4] px-3 py-2"
                value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="text-sm">
              国/地域
              <input className="mt-1 w-full rounded-xl border border-[#eadfd4] px-3 py-2"
                value={country} onChange={(e) => setCountry(e.target.value)} />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="text-sm">
              地域
              <select className="mt-1 w-full rounded-xl border border-[#eadfd4] px-3 py-2"
                value={region} onChange={(e) => setRegion(e.target.value as any)}>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>
            <label className="text-sm">
              時間（分）
              <input type="number" className="mt-1 w-full rounded-xl border border-[#eadfd4] px-3 py-2"
                value={timeMin} onChange={(e) => setTimeMin(Number(e.target.value))} />
            </label>
            <label className="text-sm">
              難易度
              <select className="mt-1 w-full rounded-xl border border-[#eadfd4] px-3 py-2"
                value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)}>
                {DIFFS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </label>
          </div>

          <label className="text-sm">
            説明
            <textarea className="mt-1 w-full rounded-xl border border-[#eadfd4] px-3 py-2"
              rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>

          <label className="text-sm">
            材料（改行区切り）
            <textarea className="mt-1 w-full rounded-xl border border-[#eadfd4] px-3 py-2"
              rows={5} value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
          </label>

          <label className="text-sm">
            手順（改行区切り）
            <textarea className="mt-1 w-full rounded-xl border border-[#eadfd4] px-3 py-2"
              rows={6} value={steps} onChange={(e) => setSteps(e.target.value)} />
          </label>

          <label className="text-sm">
            タグ（カンマ区切り）
            <input className="mt-1 w-full rounded-xl border border-[#eadfd4] px-3 py-2"
              value={tags} onChange={(e) => setTags(e.target.value)} />
          </label>

          <label className="text-sm">
            画像URL
            <input className="mt-1 w-full rounded-xl border border-[#eadfd4] px-3 py-2"
              value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </label>

          <button
            onClick={submit}
            disabled={busy}
            className="w-full rounded-xl bg-[#6b4f4f] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#5a3f3f] disabled:opacity-60"
          >
            {busy ? "送信中…" : "投稿する"}
          </button>

          {msg && <p className="text-sm text-[#7a6a5d]">{msg}</p>}
        </div>
      </div>
    </main>
  );
}