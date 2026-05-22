import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDownIcon } from './icons.jsx'

/**
 * Select-style dropdown — Figma node 365:3327.
 * - closed: grey border #d3dfe7
 * - open:   blue border #0d6fff, chevron flipped, floating menu below
 * The menu is portaled to <body> so it is never clipped by the
 * scrolling card columns; it closes on outside-click or page scroll.
 */
export default function Dropdown({
  options = [],
  placeholder = 'กรุณาเลือก',
  defaultValue = '',
}) {
  const [value, setValue] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const [rect, setRect] = useState(null)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)

  const place = useCallback(() => {
    if (triggerRef.current) {
      setRect(triggerRef.current.getBoundingClientRect())
    }
  }, [])

  useEffect(() => {
    if (!open) return
    place()
    function onScroll(e) {
      if (menuRef.current && menuRef.current.contains(e.target)) return
      setOpen(false)
    }
    function onPointerDown(e) {
      if (
        triggerRef.current?.contains(e.target) ||
        menuRef.current?.contains(e.target)
      )
        return
      setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', () => setOpen(false))
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, place])

  // Decide whether the menu opens up or down based on available space.
  const below = rect ? window.innerHeight - rect.bottom : 0
  const above = rect ? rect.top : 0
  const openUp = rect ? below < 260 && above > below : false
  const maxHeight = Math.min(280, (openUp ? above : below) - 16)

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-10 w-full items-center justify-between gap-3 rounded-lg border bg-white px-3 text-left transition-colors ${
          open ? 'border-[#0d6fff]' : 'border-[#d3dfe7] hover:border-[#9ec9e8]'
        }`}
      >
        <span
          className={`min-w-0 flex-1 truncate font-sarabun text-sm tracking-[-0.084px] ${
            value ? 'text-[#1d212d]' : 'text-[#798aa3]'
          }`}
        >
          {value || placeholder}
        </span>
        <ChevronDownIcon
          className={`size-4 shrink-0 text-[#798aa3] transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open &&
        rect &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-50 flex flex-col overflow-y-auto rounded-xl bg-white p-2 shadow-[0px_0px_1px_0px_rgba(29,33,45,0.2),0px_1px_4px_0px_rgba(29,33,45,0.15),0px_16px_32px_0px_rgba(29,33,45,0.1)]"
            style={{
              left: rect.left,
              width: rect.width,
              maxHeight,
              ...(openUp
                ? { bottom: window.innerHeight - rect.top + 8 }
                : { top: rect.bottom + 8 }),
            }}
          >
            {options.length === 0 && (
              <p className="px-2 py-1 font-sarabun text-sm text-[#798aa3]">
                ไม่มีข้อมูล
              </p>
            )}
            {options.map((opt) => {
              const selected = opt === value
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setValue(opt)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center rounded px-2 py-1 text-left font-sarabun text-sm leading-6 tracking-[-0.084px] transition-colors ${
                    selected
                      ? 'bg-[#eff9fe] text-[#0485f7]'
                      : 'text-[#1d212d] hover:bg-[#f3f7fa]'
                  }`}
                >
                  {opt}
                </button>
              )
            })}
          </div>,
          document.body,
        )}
    </div>
  )
}
