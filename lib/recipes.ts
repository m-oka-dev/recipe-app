export type Recipe = {
  id: string;
  name: string;
  country: string;
  region: "Asia" | "Europe" | "Americas" | "Middle East" | "Africa" | "Oceania";
  timeMin: number;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  ingredients: string[];
  steps: string[];
  tags: string[];
  imageUrl: string;
};

export const RECIPES = [
  {
    id: "carbonara",
    name: "ローマ風カルボナーラ",
    country: "イタリア（ローマ）",
    region: "Europe",
    timeMin: 25,
    difficulty: "Medium",
    description:
      "生クリーム不使用。卵黄とチーズ、黒胡椒で作る“ローマの定番”。余熱でソースを乳化させるのがコツ。",
    imageUrl:
      "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=1600&q=80",
    ingredients: [
      "スパゲッティ 160g",
      "卵黄 3個",
      "ペコリーノorパルミジャーノ 40g",
      "厚切りベーコン 80g",
      "黒胡椒 たっぷり",
      "塩（茹で湯用）",
    ],
    steps: [
      "チーズと卵黄、黒胡椒をボウルで混ぜる。",
      "ベーコンを弱中火で焼き脂を出す。",
      "塩を入れた湯でパスタを少し硬めに茹でる。",
      "ベーコンのフライパンに茹で汁を少し加え乳化させる。",
      "パスタを入れて火を止め、卵液を加えて余熱で和える。",
      "皿に盛り追い胡椒とチーズ。",
    ],
    tags: ["Pasta", "Roman Classic"],
  },
  {
    id: "tacos",
    name: "タコス・アル・パストール風",
    country: "メキシコ",
    region: "Americas",
    timeMin: 35,
    difficulty: "Medium",
    description:
      "豚肉をスパイスと柑橘でマリネして焼く家庭版アル・パストール。ライムで一気に完成度アップ。",
    imageUrl:
      "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=1600&q=80",
    ingredients: [
      "トルティーヤ 6枚",
      "豚こま 300g",
      "玉ねぎ 1/2",
      "パクチー",
      "ライム 1個",
      "チリパウダー 小さじ2",
      "にんにく 1片",
      "酢 大さじ1",
    ],
    steps: [
      "豚肉にスパイスと酢を揉み込む。",
      "フライパンで香ばしく焼く。",
      "トルティーヤを温める。",
      "肉・玉ねぎ・パクチーをのせる。",
      "ライムを絞って完成。",
    ],
    tags: ["Street Food", "Pork"],
  },
  {
    id: "padthai",
    name: "パッタイ",
    country: "タイ",
    region: "Asia",
    timeMin: 30,
    difficulty: "Medium",
    description:
      "甘酸っぱいタレで仕上げるタイの定番米麺。ナッツとライムで香りを立たせる。",
    imageUrl:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1600&q=80",
    ingredients: [
      "米麺 180g",
      "えび 150g",
      "卵 2個",
      "もやし 1袋",
      "ニラ",
      "ナンプラー 大さじ1",
      "砂糖 大さじ1",
      "酢 大さじ1",
    ],
    steps: [
      "米麺を戻す。",
      "にんにくとえびを炒める。",
      "卵を加えスクランブルに。",
      "麺とタレを入れて炒める。",
      "もやしとニラをさっと火入れ。",
      "皿に盛りライムを添える。",
    ],
    tags: ["Noodles", "Thai"],
  },
] satisfies Recipe[];