import React from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ThemeToggle from './ThemeToggle';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <header className="shadow-sm" style={{ backgroundColor: 'var(--card)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Billy Trend</a>
          <div className="hidden sm:flex gap-4 items-center">
            <nav className="gap-4 text-sm" style={{ color: 'var(--muted)' }}>
              <a href="/about-me.html" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Archive</a>
            </nav>
            <ThemeToggle />
          </div>
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
              <div className="rounded-lg shadow-sm p-6 transition-colors" style={{ backgroundColor: 'var(--card)', color: 'var(--text)', border: '1px solid rgba(255,255,255,0.06)' }}>
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
