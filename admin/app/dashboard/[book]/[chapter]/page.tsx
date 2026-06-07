'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import { getChapters, getHadiths, updateHadith } from '@/lib/firestore';
import { FIXED_BOOKS, Chapter, Hadith } from '@/types';

export default function ChapterPage() {
  const { book: bookSlug, chapter: chapterId } = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [editingSharh, setEditingSharh] = useState<string | null>(null);
  const [sharhText, setSharhText] = useState('');
  const [saving, setSaving] = useState(false);

  const book = FIXED_BOOKS.find(b => b.slug === bookSlug);

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const loadData = async () => {
      if (!bookSlug || !chapterId) return;
      try {
        const [chaptersData, hadithsData] = await Promise.all([
          getChapters(bookSlug as string),
          getHadiths(bookSlug as string, chapterId as string)
        ]);

        setChapter(chaptersData.find(c => c.id === chapterId) || null);
        setHadiths(hadithsData);
      } catch (error) {
        console.error('Malumot yuklashda xatolik:', error);
      } finally {
        setLoadingData(false);
      }
    };

    if (user) loadData();
  }, [bookSlug, chapterId, user]);

  const handleSaveSharh = async (hadithId: string) => {
    if (!bookSlug || !chapterId) return;
    setSaving(true);
    try {
      await updateHadith(bookSlug as string, chapterId as string, hadithId, {
        sharh: sharhText
      });
      setHadiths(hadiths.map(h =>
        h.id === hadithId ? { ...h, sharh: sharhText } : h
      ));
      setEditingSharh(null);
    } catch (error) {
      console.error('Sharh saqlashda xatolik:', error);
      alert('Xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  const startEditingSharh = (hadith: Hadith) => {
    setEditingSharh(hadith.id);
    setSharhText(hadith.sharh || '');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#1f2125' }}>
        <Navbar />
        <div className="loading">Yuklanmoqda...</div>
      </div>
    );
  }

  if (!book || !chapter) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#1f2125' }}>
        <Navbar />
        <main className="container safe-area">
          <div className="loading" style={{ color: '#ff6b6b' }}>Malumot topilmadi</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1f2125' }}>
      <Navbar />

      <main className="container safe-area" style={{ paddingBottom: '100px' }}>
        {/* Breadcrumbs */}
        <div className="breadcrumb">
          <Link href="/dashboard">Kitoblar</Link>
          <span className="breadcrumb-separator">/</span>
          <Link href={`/dashboard/${book.slug}`}>{book.name_uz}</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{chapter.name_uz}</span>
        </div>

        {/* Chapter Header */}
        <div className="page-header">
          <div
            className="inline-block px-4 py-1 mb-4"
            style={{
              backgroundColor: 'rgba(113, 186, 186, 0.2)',
              color: '#71baba',
              borderRadius: '20px',
              fontSize: '14px'
            }}
          >
            {chapter.number}-bob
          </div>
          <h1>{chapter.name_uz}</h1>
          <p className="arabic" dir="rtl">{chapter.name_ar}</p>
          <div style={{ color: '#969595', marginTop: '16px' }}>
            {hadiths.length} ta hadis
          </div>
        </div>

        {/* Actions - Hadith qo'shish TUGMASI */}
        <div className="action-bar">
          <h2>Hadislar</h2>
          <Link
            href={`/dashboard/${book.slug}/hadith/new?chapter=${chapterId}`}
            className="btn-primary"
          >
            + Hadis qo'shish
          </Link>
        </div>

        {/* Hadiths List */}
        {loadingData ? (
          <div className="loading">Yuklanmoqda...</div>
        ) : hadiths.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📜</div>
            <h3>Hali hadis yo'q</h3>
            <p>Birinchi hadisni qo'shing</p>
            <Link
              href={`/dashboard/${book.slug}/hadith/new?chapter=${chapterId}`}
              className="btn-primary"
            >
              Hadis qo'shish
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {hadiths.map((hadith) => (
              <div key={hadith.id} className="hadith-card">
                {/* Hadis Number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="hadith-number">
                    Hadis #{hadith.number}
                  </span>
                  {hadith.source && (
                    <span className="hadith-source">{hadith.source}</span>
                  )}
                </div>

                {/* Text UZ */}
                <div className="mb-4">
                  <div style={{ color: '#71baba', fontSize: '14px', marginBottom: '8px' }}>
                    Matn:
                  </div>
                  <div className="hadith-text">{hadith.text_uz}</div>
                </div>

                {/* Text AR */}
                {hadith.text_ar && (
                  <div className="mb-4">
                    <div style={{ color: '#71baba', fontSize: '14px', marginBottom: '8px' }}>
                      Arabcha:
                    </div>
                    <div className="hadith-text-ar">{hadith.text_ar}</div>
                  </div>
                )}

                {/* Raviyat */}
                {hadith.narrator && (
                  <div className="hadith-narrator mb-4">
                    <span>Raviyat: </span>
                    {hadith.narrator}
                  </div>
                )}

                {/* Sharh */}
                <div className="sharh-section">
                  <div className="sharh-title">
                    📝 Sharh (izoh):
                  </div>

                  {editingSharh === hadith.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={sharhText}
                        onChange={(e) => setSharhText(e.target.value)}
                        rows={4}
                        className="sharh-textarea"
                        placeholder="Sharh yozing..."
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingSharh(null)}
                          className="btn-secondary"
                        >
                          Bekor qilish
                        </button>
                        <button
                          onClick={() => handleSaveSharh(hadith.id)}
                          disabled={saving}
                          className="btn-primary"
                          style={{ opacity: saving ? 0.5 : 1 }}
                        >
                          {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {hadith.sharh ? (
                        <div className="sharh-content">
                          <p>{hadith.sharh}</p>
                          <button
                            onClick={() => startEditingSharh(hadith)}
                            className="primary-color hover:underline mt-3"
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            Sharhni tahrirlash
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditingSharh(hadith)}
                          className="primary-color hover:underline flex items-center gap-1"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          <span>+</span> Sharh qo'shish
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
