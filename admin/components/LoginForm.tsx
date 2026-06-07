'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
    } catch (err: any) {
      setError('Email yoki parol noto\'g\'ri');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="text-center">
          <h1 className="login-title">SUNNAH.UZ</h1>
          <p className="login-subtitle">Admin panelga kirish</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="login-error">{error}</div>
          )}

          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-dark"
              placeholder="admin@sunnah.uz"
            />
          </div>

          <div>
            <label className="form-label">Parol</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-dark"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center"
            style={{ opacity: loading ? 0.5 : 1 }}
          >
            {loading ? 'Kirish...' : 'Kirish'}
          </button>

          <div className="text-center">
            <Link href="/" className="primary-color hover:underline">
              ← Asosiy sahifaga qaytish
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
