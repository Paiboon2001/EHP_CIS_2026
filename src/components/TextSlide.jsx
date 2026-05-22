import { useEffect, useState } from 'react'

// Phrases cycled by the animated placeholder (Figma TextSlide variants).
const PHRASES = ['ค้นหาเลข HN ผู้ป่วย', 'กรอกเลข HN เพื่อลงทะเบียนใหม่']
// Tall enough to fully contain Thai tone marks / below-vowels at 20px,
// so adjacent sliding lines never visually overlap.
const LINE_HEIGHT = 36 // px
const INTERVAL = 3000 // ms each phrase stays visible
const DURATION = 550 // ms slide transition

/**
 * Vertically sliding text that loops through PHRASES.
 * A clone of the first phrase is appended so the wrap is seamless:
 * after sliding onto the clone, it snaps back to index 0 instantly.
 */
export default function TextSlide({ className = '' }) {
  const items = [...PHRASES, PHRASES[0]]
  const [step, setStep] = useState(0)
  const [animate, setAnimate] = useState(true)

  // Advance one phrase on a fixed interval.
  useEffect(() => {
    const id = setInterval(() => setStep((s) => s + 1), INTERVAL)
    return () => clearInterval(id)
  }, [])

  // Landed on the cloned phrase — snap back to the start without animating.
  useEffect(() => {
    if (step !== items.length - 1) return
    const id = setTimeout(() => {
      setAnimate(false)
      setStep(0)
    }, DURATION)
    return () => clearTimeout(id)
  }, [step, items.length])

  // Re-enable the transition on the frame after a snap.
  useEffect(() => {
    if (animate) return
    const id = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(id)
  }, [animate])

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ height: LINE_HEIGHT }}
      aria-hidden="true"
    >
      <div
        style={{
          transform: `translateY(-${step * LINE_HEIGHT}px)`,
          transition: animate ? `transform ${DURATION}ms ease` : 'none',
        }}
      >
        {items.map((text, i) => (
          <p
            key={i}
            className="flex items-center whitespace-nowrap font-sarabun text-xl text-[#727b8b]"
            style={{ height: LINE_HEIGHT }}
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  )
}
