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

Return exactly this format:

🎯 Match Score
Give a percentage.

✅ Matching Skills
- ...

❌ Missing Skills
- ...

💡 Improvement Suggestions
- ...

📄 Resume Changes
- ...
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

    return NextResponse.json({
      result: completion.choices[0].message.content,
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