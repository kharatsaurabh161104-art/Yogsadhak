"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🧘</div>
        <h1 className="text-2xl font-bold text-[#1B4332]">
          Something went wrong
        </h1>
        <p className="text-gray-600 mt-2 text-sm">
          Please try again. If the problem persists, contact us.
        </p>
        <button
          onClick={reset}
          className="mt-6 bg-[#1B4332] hover:bg-[#1B4332]/90 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
