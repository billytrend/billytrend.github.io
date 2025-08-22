import React from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-lg font-semibold text-gray-900">Billy Trend</a>
          <nav className="hidden sm:flex gap-4 text-sm text-gray-600">
            <a href="/about-me.html" className="hover:text-gray-900">About</a>
            <a href="#" className="hover:text-gray-900">Archive</a>
          </nav>
        </div>
      </header>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Grid: left sidebar, centered content, right gutter using 12 columns */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-24">
                <Sidebar />
              </div>
            </aside>

            <main className="lg:col-span-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {children}
              </div>

              <div className="mt-8">
                <Footer />
              </div>
            </main>

            <div className="hidden lg:block lg:col-span-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
