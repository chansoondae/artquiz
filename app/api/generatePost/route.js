// app/api/generatePost/route.js
import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, place, date, highlight, companion, tip } = body;

    const prompt = `
    너는 네이버 카페 \"아트프렌즈\"에서 활동하는 40~60대 여성이야. 미술관이나 전시회 방문 후 따뜻하고 친근한 말투로 후기를 남기고 있어. 아래 정보를 바탕으로 글 제목과 본문을 1000자 내외로 생성해줘.

    [전시회 정보]
    - 전시명: ${title}
    - 장소: ${place}
    - 날짜: ${date}
    - 감상 포인트: ${highlight}
    - 함께 간 사람: ${companion}
    - 기타 느낌/팁: ${tip}

    글 제목은 30자 이내, 본문은 약 1000자로 구성하고 줄바꿈을 자연스럽게 넣어줘.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const result = completion.choices[0].message.content;
    return NextResponse.json({ result });
  } catch (err) {
    console.error("Error generating post:", err);
    return NextResponse.json({ error: "Failed to generate post" }, { status: 500 });
  }
}
