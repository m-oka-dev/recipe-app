import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";

function supabaseAdmin() {
  const url = process.env.SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey);
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.email ?? session?.user?.name;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  // 超ざっくり必須チェック（MVP）
  const required = [
    "name",
    "country",
    "region",
    "timeMin",
    "difficulty",
    "description",
    "ingredients",
    "steps",
    "tags",
    "imageUrl",
  ] as const;

  for (const k of required) {
    if (body?.[k] == null) return new Response(`Bad Request: ${k}`, { status: 400 });
  }

  const row = {
    author_id: userId,
    name: String(body.name).trim(),
    country: String(body.country).trim(),
    region: String(body.region),
    time_min: Number(body.timeMin),
    difficulty: String(body.difficulty),
    description: String(body.description).trim(),
    ingredients: Array.isArray(body.ingredients) ? body.ingredients.map(String) : [],
    steps: Array.isArray(body.steps) ? body.steps.map(String) : [],
    tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
    image_url: String(body.imageUrl).trim(),
  };

  if (!row.name || !row.country || !row.description || !row.image_url) {
    return new Response("Bad Request: empty fields", { status: 400 });
  }

  const sb = supabaseAdmin();
  const { data, error } = await sb.from("recipes").insert(row).select("id").single();

  if (error) return new Response(error.message, { status: 500 });

  return Response.json({ id: data.id });
}

export async function GET() {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return new Response(error.message, { status: 500 });

  // フロント側に合わせてキー名を変換
  const mapped =
    data?.map((r) => ({
      id: String(r.id),
      name: r.name,
      country: r.country,
      region: r.region,
      timeMin: r.time_min,
      difficulty: r.difficulty,
      description: r.description,
      ingredients: r.ingredients ?? [],
      steps: r.steps ?? [],
      tags: r.tags ?? [],
      imageUrl: r.image_url,
      // 投稿レシピの印
      _source: "user",
    })) ?? [];

  return Response.json(mapped);
}