'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import { getChapters, addHadith } from '@/lib/firestore';
import { FIXED_BOOKS, Chapter } from '@/types';

export default function AddHadithPage() {
  const { book: bookSlug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterIdFromQuery = searchParams.get('chapter');
  const { user, loading } = useAuth();

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string>(chapterIdFromQuery || '');
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [textUz, setTextUz] = useState('');
  const [textAr, setTextAr] = useState('');
  const [narrator, setNarrator] = useState('');
  const [source, setSource] = useState('');
  const [sharh, setSharh] = useState('');

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
        if (!selectedChapter && data.length > 0) {
          setSelectedChapter(data[0].id);
        }
      } catch (error) {
        console.error('Bob yuklashda xatolik:', error);
      } finally {
        setLoadingData(false);
      }
    };

    if (user) loadChapters();
  }, [bookSlug, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookSlug || !selectedChapter || !textUz.trim()) return;

    setSaving(true);
    try {
      const { getHadiths } = await import('@/lib/firestore');
      const currentHadiths = await getHadiths(bookSlug as string, selectedChapter);
      const nextNumber = currentHadiths.length + 1;

      await addHadith(bookSlug as string, selectedChapter, {
        number: nextNumber,
        text_uz: textUz.trim(),
        text_ar: textAr.trim() || undefined,
        narrator: narrator.trim() || undefined,
        source: source.trim() || undefined,
        sharh: sharh.trim() || undefined,
      });

      router.push(`/dashboard/${bookSlug}/${selectedChapter}`);
    } catch (error) {
      console.error('Hadis qoshishda xatolik:', error);
      alert('Xatolik yuz berdi');
    } finally {
      setSaving(false);
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

      <main className="container safe-area" style={{ maxWidth: '800px' }}>
        {/* Breadcrumbs */}
        <div className="breadcrumb">
          <Link href="/dashboard">Kitoblar</Link>
          <span className="breadcrumb-separator">/</span>
          <Link href={`/dashboard/${book.slug}`}>{book.name_uz}</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Yangi hadis</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <p className="p-m-h-q-o">Yangi hadis qo'shish</p>
          <p style={{ color: '#969595', textAlign: 'center' }}>
            {book.name_uz} kitobiga yangi hadis qo'shing
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="content padding-30px"
          style={{ border: '2px solid #71baba' }}
        >
          {/* Chapter Selection */}
          <div className="mb-6">
            <label className="form-label">Bobni tanlang *</label>
            {loadingData ? (
              <div className="loading">Yuklanmoqda...</div>
            ) : chapters.length === 0 ? (
              <div style={{ color: '#ff6b6b' }}>
                Avval bob qo'shing! <Link href={`/dashboard/${book.slug}`} className="primary-color hover:underline">Bob qo'shish</Link>
              </div>
            ) : (
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="input-dark"
                required
              >
                {chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.number}-bob: {chapter.name_uz}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Text UZ */}
          <div className="mb-6">
            <label className="form-label">Hadis matni (O'zbekcha) *</label>
            <textarea
              value={textUz}
              onChange={(e) => setTextUz(e.target.value)}
              rows={5}
              className="sharh-textarea"
              placeholder="Hadis matnini kiriting..."
              required
            />
          </div>

          {/* Text AR */}
          <div className="mb-6">
            <label className="form-label">Hadis matni (Arabcha)</label>
            <textarea
              value={textAr}
              onChange={(e) => setTextAr(e.target.value)}
              rows={5}
              dir="rtl"
              className="sharh-textarea arabic"
              style={{ fontSize: '18px' }}
              placeholder="أدخل نص الحديث بالعربية..."
            />
          </div>

          {/* Two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Narrator */}
            <div>
              <label className="form-label">Rivoyat qilgan</label>
              <input
                type="text"
                value={narrator}
                onChange={(e) => setNarrator(e.target.value)}
                className="input-dark"
                placeholder="Masalan: Abu Bakr"
              />
            </div>

            {/* Source */}
            <div>
              <label className="form-label">Manba</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="input-dark"
                placeholder="Masalan: Al-Buxoriy"
              />
            </div>
          </div>

          {/* Sharh */}
          <div className="mb-6">
            <label className="form-label">Sharh (izoh)</label>
            <textarea
              value={sharh}
              onChange={(e) => setSharh(e.target.value)}
              rows={4}
              className="sharh-textarea"
              placeholder="Hadisga sharh yozing..."
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href={`/dashboard/${book.slug}`}
              className="btn-secondary"
            >
              Bekor qilish
            </Link>
            <button
              type="submit"
              disabled={saving || !selectedChapter || !textUz.trim()}
              className="btn-primary"
              style={{ opacity: saving ? 0.5 : 1 }}
            >
              <span>+</span>
              <span>{saving ? 'Saqlanmoqda...' : "Hadisni qo'shish"}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
