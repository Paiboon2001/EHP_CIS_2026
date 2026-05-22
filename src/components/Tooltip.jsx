import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'

/**
 * Hover tooltip — dark pill with a left-pointing beak, shown to the
 * RIGHT of the wrapped element (Figma node 374:895).
 * Used by the collapsed sidebar; pass `disabled` to turn it off
 * (e.g. when the sidebar is expanded and labels are already visible).
 */
export default function Tooltip({ label, children, disabled = false }) {
  const [pos, setPos] = useState(null)
  const ref = useRef(null)

  function show() {
    if (disabled || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    setPos({ top: r.top + r.height / 2, left: r.right + 4 })
  }
  function hide() {
    setPos(null)
  }

  return (
    <div
      ref={ref}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {pos &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[100] flex -translate-y-1/2 items-center"
            style={{ top: pos.top, left: pos.left }}
          >
            {/* beak — CSS triangle pointing left */}
            <div className="size-0 border-y-[6px] border-r-[8px] border-y-transparent border-r-[#1d212d]" />
            {/* text */}
            <div className="rounded bg-[#1d212d] px-2 py-1.5">
              <span className="whitespace-nowrap font-sarabun text-xs font-medium leading-[1.2] tracking-[0.48px] text-white">
                {label}
              </span>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
