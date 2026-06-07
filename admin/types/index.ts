export interface Book {
  id: string;
  slug: string;
  name_uz: string;
  name_ar: string;
  category: 'primary' | 'other' | 'selected';
  order: number;
}

export interface Chapter {
  id: string;
  book_id: string;
  number: number;
  name_uz: string;
  name_ar?: string;
  created_at?: Date;
}

export interface Hadith {
  id: string;
  book_id: string;
  chapter_id: string;
  number: number;
  text_uz: string;
  text_ar?: string;
  narrator?: string;
  source?: string;
  sharh?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Pre-defined books (FIXED - cannot be changed)
export const FIXED_BOOKS: Book[] = [
  // Asosiy 9 ta
  { id: 'buxoriy', slug: 'buxoriy', name_uz: 'Sahih al-Buxoriy', name_ar: 'صحيح البخاري', category: 'primary', order: 1 },
  { id: 'muslim', slug: 'muslim', name_uz: 'Sahih Muslim', name_ar: 'صحيح مسلم', category: 'primary', order: 2 },
  { id: 'nasai', slug: 'nasai', name_uz: 'Sunan an-Nasaiy', name_ar: 'سنن النسائي', category: 'primary', order: 3 },
  { id: 'abudovud', slug: 'abudovud', name_uz: 'Sunan Abu Dovud', name_ar: 'سنن أبي داود', category: 'primary', order: 4 },
  { id: 'tirmiziy', slug: 'tirmiziy', name_uz: "Jomi' at-Tirmiziy", name_ar: 'جامع الترمذي', category: 'primary', order: 5 },
  { id: 'ibnmajah', slug: 'ibnmajah', name_uz: 'Sunan Ibn Majah', name_ar: 'سنن ابن ماجه', category: 'primary', order: 6 },
  { id: 'malik', slug: 'malik', name_uz: 'Muvatta Malik', name_ar: 'موطأ مالك', category: 'primary', order: 7 },
  { id: 'ahmad', slug: 'ahmad', name_uz: 'Musnad Ahmad', name_ar: 'مسند أحمد', category: 'primary', order: 8 },
  { id: 'darimiy', slug: 'darimiy', name_uz: 'Sunan ad-Darimiy', name_ar: 'سنن الدارمي', category: 'primary', order: 9 },
  // Boshqa muhim
  { id: 'ibn-xuzayma', slug: 'ibn-xuzayma', name_uz: 'Sahih Ibn Xuzayma', name_ar: 'صحيح ابن خزيمة', category: 'other', order: 10 },
  { id: 'ibn-hibban', slug: 'ibn-hibban', name_uz: 'Sahih Ibn Hibbon', name_ar: 'صحيح ابن حبان', category: 'other', order: 11 },
  { id: 'hokim', slug: 'hokim', name_uz: 'Mustadrok al-Hokim', name_ar: 'مستدرك الحاكم', category: 'other', order: 12 },
  { id: 'abdurazzoq', slug: 'abdurazzoq', name_uz: 'Musannaf Abdurazzoq', name_ar: 'مصنف عبد الرزاق', category: 'other', order: 13 },
  { id: 'ibn-abi-shayba', slug: 'ibn-abi-shayba', name_uz: 'Musannaf Ibn Abi Shayba', name_ar: 'مصنف ابن ابي شىيبة', category: 'other', order: 14 },
  { id: 'darqutni', slug: 'darqutni', name_uz: 'Sunan Darqutniy', name_ar: 'سنن الدارقطني', category: 'other', order: 15 },
  { id: 'bayhaqi', slug: 'bayhaqi', name_uz: 'As-Sunan al-Kubra li al-Bayhaqiy', name_ar: 'السُّنَن الْكُبْرَىٰ لِلْبَيْهَقِيّ', category: 'other', order: 16 },
  { id: 'nasai-kubra', slug: 'nasai-kubra', name_uz: 'Sunan Nasaiy al-Kubra', name_ar: 'السُّنَن الكُبْرَى النَّسَائي', category: 'other', order: 17 },
  { id: 'adab', slug: 'adab', name_uz: 'Al-Adab al-Mufrad', name_ar: 'الأدب المفرد', category: 'other', order: 18 },
  { id: 'shamail', slug: 'shamail', name_uz: 'Ash-Shamoil al-Muhammadiyyah', name_ar: 'الشمائل المحمدية', category: 'other', order: 19 },
  // Tanlab olingan
  { id: 'navavi-40', slug: 'navavi-40', name_uz: "An-Navaviyning 40 hadisi", name_ar: 'الأربعون النووية', category: 'selected', order: 20 },
  { id: 'riyoz', slug: 'riyoz', name_uz: 'Riyoz us-Solihin', name_ar: 'رياض الصالحين', category: 'selected', order: 21 },
  { id: 'mishkat', slug: 'mishkat', name_uz: 'Mishkat al-Masobih', name_ar: 'مشكاة المصابيح', category: 'selected', order: 22 },
  { id: 'bulug', slug: 'bulug', name_uz: 'Bulugh al-Maram', name_ar: 'بلوغ المرام', category: 'selected', order: 23 },
  { id: 'qirqtasi', slug: 'qirqtasi', name_uz: 'Qirqtasi hadis to\'plamlari', name_ar: 'الأربعينات', category: 'selected', order: 24 },
  { id: 'hisn', slug: 'hisn', name_uz: 'Hisn al-Muslim', name_ar: 'حصن المسلم', category: 'selected', order: 25 },
  { id: 'virtues', slug: 'virtues', name_uz: 'Virtues (Fazilatlar)', name_ar: 'الفضائل', category: 'selected', order: 26 },
];
