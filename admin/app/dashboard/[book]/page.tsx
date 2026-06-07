'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import { getChapters, addChapter } from '@/lib/firestore';
import { FIXED_BOOKS, Chapter } from '@/types';

export default function BookPage() {
  const { book: bookSlug } = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newChapterName, setNewChapterName] = useState('');
  const [newChapterNameAr, setNewChapterNameAr] = useState('');
  const [adding, setAdding] = useState(false);

  const book = FIXED_BOOKS.find(b => b.slug === bookSlug);

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const loadChapters = async () => {
      if (!bookSlug) return;
      try {
        const data = await getChapters(bookSlug as string);
        setChapters(data);
      } catch (error) {
        console.error('Bob yuklashda xatolik:', error);
      } finally {
        setLoadingData(false);
      }
    };

    if (user) loadChapters();
  }, [bookSlug, user]);

  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookSlug || !newChapterName.trim()) return;

    setAdding(true);
    try {
      const nextNumber = chapters.length > 0 ? Math.max(...chapters.map(c => c.number)) + 1 : 1;

      await addChapter(bookSlug as string, {
        number: nextNumber,
        name_uz: newChapterName.trim(),
        name_ar: newChapterNameAr.trim() || undefined,
      });

      const data = await getChapters(bookSlug as string);
      setChapters(data);

      setNewChapterName('');
      setNewChapterNameAr('');
      setShowAddModal(false);
    } catch (error) {
      console.error('Bob qoshishda xatolik:', error);
      alert('Xatolik yuz berdi');
    } finally {
      setAdding(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#1f2125' }}>
        <Navbar />
        <div className="loading">Yuklanmoqda...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#1f2125' }}>
        <Navbar />
        <main className="container safe-area">
          <div className="loading" style={{ color: '#ff6b6b' }}>Kitob topilmadi</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1f2125' }}>
      <Navbar />

      <main className="container safe-area">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link href="/dashboard">← Kitoblar</Link>
        </div>

        {/* Book Header */}
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
            {book.category === 'primary' ? 'Asosiy 9' :
             book.category === 'other' ? 'Boshqa muhim' : 'Tanlab olingan'}
          </div>
          <h1>{book.name_uz}</h1>
          <p className="arabic" dir="rtl">{book.name_ar}</p>
          <div style={{ color: '#969595', marginTop: '16px' }}>
            {chapters.length} bob
          </div>
        </div>

        {/* Actions */}
        <div className="action-bar">
          <h2>Boblar</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            + Bob qo'shish
          </button>
        </div>

        {/* Chapters List */}
        {loadingData ? (
          <div className="loading">Yuklanmoqda...</div>
        ) : chapters.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h3>Hali bob yo'q</h3>
            <p>Birinchi bobni qo'shing</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              Bob qo'shish
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/dashboard/${book.slug}/${chapter.id}`}
                className="chapter-item"
              >
                <div className="chapter-number">{chapter.number}</div>
                <div className="chapter-info flex-1">
                  <h3>{chapter.name_uz}</h3>
                  {chapter.name_ar && (
                    <p className="arabic" dir="rtl">{chapter.name_ar}</p>
                  )}
                </div>
                <div style={{ color: '#71baba', fontSize: '20px' }}>→</div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Add Chapter Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">
              {chapters.length + 1}-bob qo'shish
            </h2>
            <form onSubmit={handleAddChapter} className="space-y-4">
              <div>
                <label className="form-label">Bob nomi (O'zbekcha) *</label>
                <input
                  type="text"
                  value={newChapterName}
                  onChange={(e) => setNewChapterName(e.target.value)}
                  className="input-dark"
                  placeholder="Masalan: Iymon kitobi"
                  required
                />
              </div>
              <div>
                <label className="form-label">Bob nomi (Arabcha)</label>
                <input
                  type="text"
                  value={newChapterNameAr}
                  onChange={(e) => setNewChapterNameAr(e.target.value)}
                  className="input-dark arabic"
                  dir="rtl"
                  placeholder="كتاب الإيمان"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary flex-1 justify-center"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={adding || !newChapterName.trim()}
                  className="btn-primary flex-1 justify-center"
                  style={{ opacity: adding ? 0.5 : 1 }}
                >
                  {adding ? 'Qoshilmoqda...' : "Qo'shish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
