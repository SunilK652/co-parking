'use client';
import Link from 'next/link';
import "./globals.css";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Home Page</h1>
        <Link href="/login" className="text-indigo-600 hover:text-indigo-800">
          Go to Login
        </Link>
      </div>
    </main>
  );
}
