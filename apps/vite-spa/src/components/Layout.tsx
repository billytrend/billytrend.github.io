import React from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8 lg:flex lg:gap-8">
      <aside className="lg:w-72 hidden lg:block">
        <Sidebar />
      </aside>

      <main className="flex-1 border-l lg:pl-10">
        {children}

        <div className="mt-8">
          <Footer />
        </div>
      </main>
    </div>
  );
}
