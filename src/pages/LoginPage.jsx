import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../auth.js'
import ehpLogo from '../assets/ehp-logo.png'
import skyBg from '../assets/login/sky-bg.png'
import doctorOrange from '../assets/login/doctor-orange.png'
import doctorGreen from '../assets/login/doctor-green.png'
import doctorBlue from '../assets/login/doctor-blue.png'
import squiggleTop from '../assets/login/squiggle-top.png'
import squiggleBottom from '../assets/login/squiggle-bottom.png'
import pointer1 from '../assets/login/pointer-1.png'
import pointer2 from '../assets/login/pointer-2.png'
import {
  UserIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
} from '../components/icons.jsx'

const BADGE_SHADOW =
  'shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15),0px_1px_1.5px_0px_rgba(0,0,0,0.3)]'

// Per-element hover: each decoration piece scales up on its own.
const HOVER_FX =
  'cursor-pointer transition-transform duration-300 ease-out hover:z-10 hover:scale-110'

// Decorative 4-point sparkles (Figma "Group 249" icons).
// Positions are % of the decoration group box.
const SPARKLES = [
  { left: '0%', top: '93.9%', size: 45, color: '#FF8A3D' },
  { left: '51.7%', top: '43.5%', size: 34, color: '#243657' },
  { left: '63.3%', top: '0%', size: 25, color: '#FF8A3D' },
  // Green sparkle — moved 72px to the left of its Figma position.
  { left: 'calc(7.64% - 72px)', top: '26.5%', size: 25, color: '#6CC04A' },
  { left: '83.7%', top: '79.7%', size: 29, color: '#3E9DFF' },
]

function Sparkle({ left, top, size, color }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`absolute ${HOVER_FX}`}
      style={{ left, top, width: size, height: size }}
      fill={color}
      aria-hidden="true"
    >
      <path d="M12 0C12.7 7 17 11.3 24 12C17 12.7 12.7 17 12 24C11.3 17 7 12.7 0 12C7 11.3 11.3 7 12 0Z" />
    </svg>
  )
}

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: wire up to the real authentication endpoint.
    console.log('login', { username, password, rememberMe })
    login()
    navigate('/')
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#bfe9fb]">
      {/* Sky background */}
      <div className="login-sky-enter absolute inset-0 overflow-hidden">
        <img
          src={skyBg}
          alt=""
          aria-hidden="true"
          className="login-sky-drift absolute left-[-6%] top-[-56px] h-[calc(100%_+_112px)] w-[112%] max-w-none object-cover"
        />
      </div>

      {/* Decorative artwork (Figma "Group 249") — desktop only.
          Inner layers handle the slide-in entrance and floating loop;
          each piece scales individually on hover. */}
      <div
        aria-hidden="true"
        className="absolute left-[44.6%] top-[8.6%] hidden h-[82.1%] w-[48.2%] lg:block"
      >
        <div className="login-decor-enter size-full">
          <div className="login-decor-float relative size-full">
            {/* Squiggle lines */}
            <img
              src={squiggleTop}
              alt=""
              className={`absolute left-[6.3%] top-[32%] w-[17.6%] ${HOVER_FX}`}
            />
            <img
              src={squiggleBottom}
              alt=""
              className={`absolute left-[52.5%] top-[76.5%] w-[23.4%] ${HOVER_FX}`}
            />

            {/* Badges (sit behind the doctor cards) */}
            <div
              className={`absolute left-[4%] top-[7%] rounded-xl bg-[#c4ff92] px-4 py-3 ${BADGE_SHADOW} ${HOVER_FX}`}
            >
              <span className="font-sarabun text-xl font-bold text-[#1d212d]">
                OPD ตรวจง่าย
              </span>
            </div>
            <div
              className={`absolute left-[82.4%] top-[calc(26.4%_-_80px)] rounded-xl bg-[#79ddff] px-4 py-3 ${BADGE_SHADOW} ${HOVER_FX}`}
            >
              <span className="font-sarabun text-xl font-bold text-[#1d212d]">
                ใส่ใจผู้ป่วย
              </span>
            </div>

            {/* Doctor cards */}
            <img
              src={doctorBlue}
              alt=""
              className={`absolute left-[-1.8%] top-[50%] w-[70.3%] ${HOVER_FX}`}
            />
            <img
              src={doctorOrange}
              alt=""
              className={`absolute left-[28.7%] top-[7%] w-[47.9%] ${HOVER_FX}`}
            />
            <img
              src={doctorGreen}
              alt=""
              className={`absolute left-[60.8%] top-[36.1%] w-[32%] ${HOVER_FX}`}
            />

            {/* Sparkles */}
            {SPARKLES.map((s, i) => (
              <Sparkle key={i} {...s} />
            ))}

            {/* Mouse-pointer icons */}
            <img
              src={pointer1}
              alt=""
              className={`absolute left-[29.3%] top-[14.7%] w-[23px] ${HOVER_FX}`}
            />
            <img
              src={pointer2}
              alt=""
              className={`absolute left-[80.7%] top-[calc(35.1%_-_80px)] w-[24px] ${HOVER_FX}`}
            />
          </div>
        </div>
      </div>

      {/* Login form — wrapper is click-through so the decoration stays hoverable */}
      <div className="pointer-events-none relative z-10 flex min-h-screen items-center justify-center px-6 py-10 lg:justify-start lg:pl-[8%]">
        <form
          onSubmit={handleSubmit}
          className="login-form-enter pointer-events-auto flex w-full max-w-[382px] flex-col gap-10 rounded-2xl border border-white px-8 py-6 bg-[linear-gradient(1deg,#ffffff_81%,#79ddff_134%)] shadow-[0px_16px_48px_-4px_rgba(17,152,220,0.33),0px_4px_4px_-4px_rgba(12,12,13,0.05)]"
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
    </div>
  )
}
