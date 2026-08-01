import Groq from "groq-sdk";

export async function GET() {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "Say hello to CareerPilot AI in one sentence.",
      },
    ],
    model: "llama-3.3-70b-versatile",
  });

  return Response.json({
    message: response.choices[0].message.content,
  });
}