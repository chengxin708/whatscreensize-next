'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/admin');
    }
  }, [status, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push('/admin');
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--bg-main)' }}
    >
      {/* Background gradients */}
      <div className="bg-gradient-1" />
      <div className="bg-gradient-2" />

      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          background: 'var(--glass-surface)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Image
            src="/assets/logo.png"
            alt="WhatScreenSize"
            width={120}
            height={32}
            className="h-8 w-auto mx-auto mb-4"
          />
          <h1
            className="text-xl font-heading font-semibold"
            style={{ color: 'var(--text-main)' }}
          >
            Admin Login
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>
            Sign in to manage products
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="mb-6 px-4 py-3 rounded-lg text-sm"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#fca5a5',
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-[44px] px-4 rounded-lg text-sm outline-none transition-all duration-200"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-main)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#6366f1';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="admin@example.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="min-h-[44px] px-4 rounded-lg text-sm outline-none transition-all duration-200"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-main)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#6366f1';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="min-h-[44px] rounded-lg text-sm font-semibold text-white transition-all duration-200 mt-2 flex items-center justify-center gap-2"
            style={{
              background: loading ? '#4f46e5' : '#6366f1',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = '#4f46e5';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.background = '#6366f1';
            }}
          >
            {loading && (
              <div
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
              />
            )}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
