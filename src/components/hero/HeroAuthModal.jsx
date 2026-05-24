import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import logoHeader from '../../assets/logo-header.png'

export default function HeroAuthModal({ open, onClose, account, platformLabel, platformColor }) {
  const [mode, setMode] = useState('signin')

  useEffect(() => {
    if (!open) return undefined
    setMode('signin')
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  const isSignIn = mode === 'signin'

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hero-auth-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close dialog"
      />

      <div className="relative w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.18)] ring-1 ring-zinc-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
          aria-label="Close"
        >
          <X className="h-4 w-4" strokeWidth={2.25} />
        </button>

        <div className="mb-6 flex justify-center">
          <img src={logoHeader} alt="Metriwo" className="h-8 w-auto" />
        </div>

        {account && (
          <div className="mb-5 rounded-xl bg-zinc-50 px-4 py-3 text-center ring-1 ring-zinc-100">
            <p className="text-xs text-zinc-500">You searched for</p>
            <p className="mt-1 text-sm font-semibold text-zinc-900">{account.name}</p>
            <p className="text-xs text-zinc-500">
              <span style={{ color: platformColor }}>@{account.username}</span>
              {' · '}
              {platformLabel}
            </p>
          </div>
        )}

        <h2 id="hero-auth-title" className="text-center text-xl font-semibold text-zinc-900">
          {isSignIn ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="mt-1.5 text-center text-sm font-light text-zinc-500">
          {isSignIn
            ? 'Sign in to unlock full analytics for this profile.'
            : 'Start your 14-day free trial. No credit card required.'}
        </p>

        <div className="mt-6 flex rounded-full bg-zinc-100 p-1">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
              isSignIn ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
              !isSignIn ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            Sign up
          </button>
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            onClose()
          }}
        >
          {!isSignIn && (
            <div>
              <label htmlFor="hero-auth-name" className="mb-1.5 block text-xs font-medium text-zinc-600">
                Full name
              </label>
              <input
                id="hero-auth-name"
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition-[border-color,box-shadow] placeholder:text-zinc-400 focus:border-[#5B3AFF] focus:ring-2 focus:ring-[#5B3AFF]/20"
              />
            </div>
          )}

          <div>
            <label htmlFor="hero-auth-email" className="mb-1.5 block text-xs font-medium text-zinc-600">
              Work email
            </label>
            <input
              id="hero-auth-email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition-[border-color,box-shadow] placeholder:text-zinc-400 focus:border-[#5B3AFF] focus:ring-2 focus:ring-[#5B3AFF]/20"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="hero-auth-password" className="text-xs font-medium text-zinc-600">
                Password
              </label>
              {isSignIn && (
                <button type="button" className="text-xs font-medium text-[#5B3AFF] hover:underline">
                  Forgot password?
                </button>
              )}
            </div>
            <input
              id="hero-auth-password"
              type="password"
              autoComplete={isSignIn ? 'current-password' : 'new-password'}
              placeholder="••••••••"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition-[border-color,box-shadow] placeholder:text-zinc-400 focus:border-[#5B3AFF] focus:ring-2 focus:ring-[#5B3AFF]/20"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-[#5B3AFF] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {isSignIn ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-zinc-200" />
          <span className="text-xs font-medium text-zinc-400">or continue with</span>
          <span className="h-px flex-1 bg-zinc-200" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <FcGoogle className="h-5 w-5" aria-hidden />
            Google
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            Apple
          </button>
        </div>

        <p className="mt-5 text-center text-[11px] leading-relaxed text-zinc-400">
          By continuing, you agree to Metriwo&apos;s{' '}
          <button type="button" className="text-zinc-500 underline hover:text-zinc-700">
            Terms
          </button>{' '}
          and{' '}
          <button type="button" className="text-zinc-500 underline hover:text-zinc-700">
            Privacy Policy
          </button>
          .
        </p>
      </div>
    </div>,
    document.body,
  )
}
