'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="header">
      <div className="container">
        <Link href="/dashboard" className="header-link">
          📚 SUNNAH.UZ Admin
        </Link>

        {user && (
          <div className="header-user">
            <span>{user.email}</span>
            <button onClick={signOut} className="btn-primary">
              Chiqish
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
