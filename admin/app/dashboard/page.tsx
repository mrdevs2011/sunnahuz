'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import { FIXED_BOOKS } from '@/types';

const categoryLabels = {
  primary: 'Asosiy 9',
  other: 'Boshqa muhim',
  selected: 'Tanlab olingan'
};

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'primary' | 'other' | 'selected'>('primary');

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#1f2125' }}>
        <Navbar />
        <div className="loading">Yuklanmoqda...</div>
      </div>
    );
  }

  const filteredBooks = FIXED_BOOKS.filter(b => b.category === activeTab);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1f2125' }}>
      <Navbar />

      <main className="container safe-area">
        <div className="mb-8">
          <p className="p-m-h-q-o">Kitoblar</p>
          <p style={{ color: '#969595', textAlign: 'center' }}>
            Barcha kitoblar oldindan yaratilgan (o'zgartirib bo'lmaydi)
          </p>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {(Object.keys(categoryLabels) as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            >
              {categoryLabels[tab]}
            </button>
          ))}
        </div>

        {/* Books Grid */}
        <div className="books-grid">
          {filteredBooks.map((book) => (
            <Link key={book.id} href={`/dashboard/${book.slug}`}>
              <div className="book-card">
                <div className="book-name-uz">{book.name_uz}</div>
                <div className="book-name-ar">{book.name_ar}</div>
                <span className={`badge ${book.category}`}>
                  {categoryLabels[book.category]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
