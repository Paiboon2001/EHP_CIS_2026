import { useState } from 'react'
import ehpLogo from '../assets/ehp-logo.png'
import {
  UserIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
} from '../components/icons.jsx'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: wire up to the real authentication endpoint.
    console.log('login', { username, password, rememberMe })
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-[radial-gradient(124%_124%_at_50%_-4%,#ffffff_15%,#bde2f5_47%,#9adffa_65%,#76ddff_84%)]">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[382px] flex-col gap-10 rounded-2xl border border-white px-8 py-6 bg-[linear-gradient(1deg,#ffffff_81%,#79ddff_134%)] shadow-[0px_16px_32px_-4px_rgba(46,144,193,0.3),0px_4px_4px_-4px_rgba(12,12,13,0.05)]"
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-6">
          <img
            src={ehpLogo}
            alt="Excellent Health Platform logo"
            className="size-20 object-contain"
          />
          <h1 className="w-full text-center font-sarabun text-xl font-bold leading-[16.8px] text-ehp-title">
            EHP LOGIN
          </h1>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-12">
          {/* Fields */}
          <div className="flex flex-col gap-4">
            {/* Username */}
            <label className="flex w-full items-center gap-3 rounded-lg bg-ehp-input px-3 py-2 focus-within:ring-2 focus-within:ring-[#0d6fff]/30">
              <UserIcon className="shrink-0 text-ehp-placeholder" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                autoComplete="username"
                className="min-w-0 flex-1 bg-transparent font-sarabun text-base leading-6 tracking-[-0.176px] text-ehp-title outline-none placeholder:text-ehp-placeholder"
              />
            </label>

            {/* Password */}
            <label className="flex w-full items-center gap-3 rounded-lg bg-ehp-input px-3 py-2 focus-within:ring-2 focus-within:ring-[#0d6fff]/30">
              <LockIcon className="shrink-0 text-ehp-placeholder" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                className="min-w-0 flex-1 bg-transparent font-sarabun text-base leading-6 tracking-[-0.176px] text-ehp-title outline-none placeholder:text-ehp-placeholder"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="shrink-0 text-ehp-placeholder transition-colors hover:text-ehp-title"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </label>

            {/* Remember me */}
            <label className="flex cursor-pointer select-none items-center gap-[3px]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="peer sr-only"
              />
              <span
                className={`flex size-4 items-center justify-center rounded-[5.5px] border transition-colors ${
                  rememberMe
                    ? 'border-[#0d6fff] bg-[#0d6fff] text-white'
                    : 'border-[#d1d1d6] bg-white text-transparent'
                }`}
              >
                <CheckIcon />
              </span>
              <span className="font-sarabun text-[13px] font-medium leading-4 text-[#1a1a1a]">
                Remember Me
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              className="relative w-full rounded-lg border-[0.5px] border-[#242424] bg-gradient-to-t from-black to-[#666666] to-[136.25%] px-4 py-2 font-sarabun text-base font-semibold tracking-[-0.176px] text-white shadow-[inset_0px_4px_3px_0px_rgba(110,110,110,0.44)] transition-opacity hover:opacity-95 active:opacity-90"
            >
              Login
            </button>
            <button
              type="button"
              className="w-full rounded-lg border border-[#d1d1d6] bg-white px-4 py-2 font-sarabun text-base font-semibold tracking-[-0.176px] text-black transition-colors hover:bg-[#f5f8fa]"
            >
              Sign up
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
