export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-5xl font-bold mb-4">
        CareerPilot AI
      </h1>

      <p className="text-xl text-gray-600 mb-8 text-center max-w-xl">
        Build the perfect CV and cover letter with AI.
      </p>

      <button className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700">
        Get Started
      </button>
    </main>
  );
}