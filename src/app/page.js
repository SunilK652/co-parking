'use client';

import Link from 'next/link';
import Layout from "./components/layout/page";

const Home = () => {
  const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;

  return (
    <Layout>
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Home Page</h1>
        {isLocalStorageAvailable && localStorage.getItem('authToken') && (
          <Link href={localStorage.getItem('role') === 'parking-owner' ? '/owner-dashboard' : '/dashboard'}>
            <p className="text-indigo-600 hover:text-indigo-800">Go to Dashboard</p>
          </Link>
        )}
      </div>
    </main>
    </Layout>
  );
}

export default Home;
