"use client";

import { useState } from "react";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function analyzeJob() {
    if (!selectedFile || !jobDescription.trim()) {
      alert("Please upload a PDF and paste a job description.");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("cv", selectedFile);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data.result);

    } catch {
      setResult(null);
      alert("Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl w-full">

        <h1 className="text-4xl font-bold mb-3">
          CareerPilot AI
        </h1>

        <p className="text-gray-600 mb-6">
          Upload your CV and paste the job description.
        </p>


        <label className="block mb-2 font-semibold">
          Upload your CV (PDF)
        </label>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setSelectedFile(e.target.files[0]);
            }
          }}
          className="mb-4"
        />


        {selectedFile && (
          <p className="mb-6 text-green-600">
            📄 Selected: {selectedFile.name}
          </p>
        )}


        <label className="block mb-2 font-semibold">
          Job Description
        </label>

        <textarea
          className="w-full border rounded-xl p-4 h-56"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />


        <button
          onClick={analyzeJob}
          className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
        >
          {loading ? "Analyzing..." : "Analyze Job"}
        </button>


        {result && (
          <div className="mt-8 space-y-5">


            <div className="border rounded-xl p-5">
              <h2 className="text-xl font-bold">
                🎯 Match Score
              </h2>

              <p className="text-5xl font-bold text-blue-600 mt-3">
                {result.score}%
              </p>
            </div>



            <div className="grid md:grid-cols-2 gap-5">


              <div className="border rounded-xl p-5">
                <h2 className="text-xl font-bold">
                  ✅ Matching Skills
                </h2>

                <ul className="mt-3 list-disc ml-5">
                  {result.matchingSkills?.map(
                    (skill: string) => (
                      <li key={skill}>
                        {skill}
                      </li>
                    )
                  )}
                </ul>
              </div>



              <div className="border rounded-xl p-5">
                <h2 className="text-xl font-bold">
                  ❌ Missing Skills
                </h2>

                <ul className="mt-3 list-disc ml-5">
                  {result.missingSkills?.map(
                    (skill: string) => (
                      <li key={skill}>
                        {skill}
                      </li>
                    )
                  )}
                </ul>
              </div>


            </div>



            <div className="border rounded-xl p-5">
              <h2 className="text-xl font-bold">
                💡 Improvement Suggestions
              </h2>

              <ul className="mt-3 list-disc ml-5">
                {result.suggestions?.map(
                  (item: string) => (
                    <li key={item}>
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>



            <div className="border rounded-xl p-5">
              <h2 className="text-xl font-bold">
                📄 Resume Changes
              </h2>

              <ul className="mt-3 list-disc ml-5">
                {result.resumeChanges?.map(
                  (item: string) => (
                    <li key={item}>
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>


          </div>
        )}

      </div>
    </main>
  );
}