import React from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ThemeToggle from './ThemeToggle';
import { Link } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <header
        className="border-b"
        style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--line)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="text-xl font-black tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            style={{ color: 'var(--text)' }}
          >
            Billy Trend
          </Link>
          <div className="flex gap-3 items-center">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="py-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Grid: left sidebar, centered content, right gutter using 12 columns */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <aside className="hidden lg:block lg:col-span-3">
              <div className="lg:sticky lg:top-24">
                <Sidebar />
              </div>
            </aside>

            <main id="content" className="lg:col-span-6" role="main">
              <div className="card p-8 transition-colors">{children}</div>

              <div className="mt-10">
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
