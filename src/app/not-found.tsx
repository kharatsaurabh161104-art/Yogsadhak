import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🙏</div>
        <h1 className="text-2xl font-bold text-[#1B4332]">
          Page Not Found
        </h1>
        <p className="text-gray-600 mt-2 text-sm">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
          <Link
            href="/"
            className="bg-[#1B4332] hover:bg-[#1B4332]/90 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/register"
            className="bg-[#F97316] hover:bg-[#F97316]/90 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
}
