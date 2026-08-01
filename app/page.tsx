"use client";

import { useState } from "react";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function analyzeJob() {
    if (!jobDescription.trim()) return;

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescription,
        }),
      });

      const data = await response.json();
      setResult(data.result);
    } catch {
      setResult("Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full">
        <h1 className="text-4xl font-bold mb-3">
          CareerPilot AI
        </h1>

        <p className="text-gray-600 mb-6">
          Paste a job description and let AI analyze it.
        </p>

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
          <div className="mt-8 border rounded-xl p-5 whitespace-pre-wrap">
            {result}
          </div>
        )}
      </div>
    </main>
  );
}