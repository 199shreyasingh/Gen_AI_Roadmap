import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    if (!topic) {
      return NextResponse.json({ error: "topic required" }, { status: 400 });
    }

    const prompt = `You are an expert learning path generator. For the topic "${topic}" produce JSON with:
    {
      "title": "...",
      "overview": "...",
      "stages": [
        { "title": "Beginner", "duration": "4-6 weeks", "items": [{ "name": "...", "description":"...", "resources": [{ "label":"", "url":""}] }] },
        ...
      ]
    }
    Only return valid JSON with no extra text.`;

    // ✅ FIX 1: Check GROQ_API_KEY, not ANTHROPIC_API_KEY
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not set" },
        { status: 500 }
      );
    }

    const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2048,
      }),
    });

    if (!aiRes.ok) {
      const errorText = await aiRes.text();
      return NextResponse.json(
        { error: `Groq API error: ${errorText}` },
        { status: aiRes.status }
      );
    }

    const aiData = await aiRes.json();

    // ✅ FIX 2: Use `let` so we can reassign after stripping code fences
    let outputText = aiData?.choices?.[0]?.message?.content || "";

    // Remove code fences if present
    outputText = outputText.replace(/```json|```/g, "").trim();

    let roadmap;
    try {
      roadmap = JSON.parse(outputText);
    } catch (err) {
      console.error("JSON parse error:", err);
      return NextResponse.json(
        { error: "Invalid JSON from AI", raw: outputText },
        { status: 500 }
      );
    }

    return NextResponse.json(roadmap);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}