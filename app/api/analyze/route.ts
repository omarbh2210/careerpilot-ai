import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { supabase } from "@/lib/supabase";


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
          error: "Missing CV or job description."
        },
        {
          status: 400
        }
      );

    }



    // Read PDF

    const arrayBuffer = await cv.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    const pdfData = await pdfParse(buffer);

    const cvText = pdfData.text;



    // AI ANALYSIS

    const completion = await groq.chat.completions.create({

      model: "llama-3.3-70b-versatile",

      messages: [

        {
          role: "system",

          content: `
You are a professional technical recruiter.

Compare the CV with the job description.

Return ONLY valid JSON.

Rules:
- score must be integer 0-100
- arrays must contain strings
- no markdown
- no explanations outside JSON


Example:

{
 "score":75,
 "matchingSkills":[
   "JavaScript",
   "Git"
 ],
 "missingSkills":[
   "Docker"
 ],
 "suggestions":[
   "Add React projects"
 ],
 "resumeChanges":[
   "Highlight backend experience"
 ]
}

`
        },

        {
          role:"user",

          content:`

JOB DESCRIPTION:

${jobDescription}


CV:

${cvText}

`
        }

      ]

    });



    let aiText =
      completion.choices[0].message.content || "{}";


    console.log("RAW AI:", aiText);



    // remove accidental markdown

    aiText = aiText
      .replace("```json","")
      .replace("```","")
      .trim();



    const analysis = JSON.parse(aiText);



    // protect score

    const score = Math.round(Number(analysis.score));



    const finalAnalysis = {

      score: isNaN(score) ? 0 : score,

      matchingSkills:
        analysis.matchingSkills || [],

      missingSkills:
        analysis.missingSkills || [],

      suggestions:
        analysis.suggestions || [],

      resumeChanges:
        analysis.resumeChanges || []

    };



    console.log("FINAL:", finalAnalysis);



    // SAVE DATABASE

    const { error } = await supabase
      .from("analyses")
      .insert({

        job_description: jobDescription,

        score: finalAnalysis.score,

        matching_skills:
          finalAnalysis.matchingSkills,

        missing_skills:
          finalAnalysis.missingSkills,

        suggestions:
          finalAnalysis.suggestions,

        resume_changes:
          finalAnalysis.resumeChanges,

      });



    if(error){

      console.log("SUPABASE ERROR:", error);

      return NextResponse.json(
        {
          error:"Database error",
          details:error.message
        },
        {
          status:500
        }
      );

    }



    return NextResponse.json({

      result: finalAnalysis

    });



  }

  catch(error:any){

    console.error("SERVER ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || "Something went wrong"
      },
      {
        status:500
      }
    );

}

}