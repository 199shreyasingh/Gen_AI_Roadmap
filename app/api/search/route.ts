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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set" },
        { status: 500 }
      );
    }

    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!aiRes.ok) {
      const errorText = await aiRes.text();
      return NextResponse.json(
        { error: `Gemini API error: ${errorText}` },
        { status: aiRes.status }
      );
    }

    const aiData = await aiRes.json();

    let outputText = aiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // 1. Remove code fences if present
    outputText = outputText.replace(/```json|```/g, "").trim();

    // 2. Try parsing the cleaned text
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

    // 3. Return the parsed object
    return NextResponse.json(roadmap);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
