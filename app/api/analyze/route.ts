import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import pdfParse from "pdf-parse/lib/pdf-parse.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const jobDescription = formData.get("jobDescription") as string;
    const cv = formData.get("cv") as File | null;

    if (!jobDescription || !cv) {
      return NextResponse.json(
        {
          result: "Missing CV or job description.",
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await cv.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    const pdfData = await pdfParse(buffer);

    const cvText = pdfData.text;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert technical recruiter.

Compare the candidate CV with the job description.

Return ONLY valid JSON.

Do not use markdown.
Do not add explanations.

Use exactly this structure:

{
  "score": 0,
  "matchingSkills": [
    "skill"
  ],
  "missingSkills": [
    "skill"
  ],
  "suggestions": [
    "suggestion"
  ],
  "resumeChanges": [
    "change"
  ]
}

Rules:
- score must be a number between 0 and 100.
- Keep skills short.
- Give practical resume advice.
`,
        },
        {
          role: "user",
          content: `
JOB DESCRIPTION:

${jobDescription}


CANDIDATE CV:

${cvText}
`,
        },
      ],
    });

    const aiResponse = completion.choices[0].message.content;

    const result = JSON.parse(aiResponse || "{}");

    return NextResponse.json({
      result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        result: "Something went wrong while analyzing the CV.",
      },
      { status: 500 }
    );
  }
}