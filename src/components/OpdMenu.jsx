import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  FolderIcon,
  FolderOpenIcon,
  ChevronDownIcon,
  BookOpenIcon,
  FileHeartIcon,
  FileHeart3Icon,
  FileDownloadIcon,
  FileCheckIcon,
  FileAttachmentIcon,
  FileMinusIcon,
} from './icons.jsx'

// Sub-menu entries shown when the OPD Registery menu is expanded.
// `path` items navigate to a real page; the rest are placeholders.
const SUBMENU = [
  { label: 'เวชระเบียนผู้ป่วย', Icon: BookOpenIcon, path: '/opd/medical-records' },
  { label: 'ทะเบียนผู้ป่วย', Icon: FileHeartIcon },
  { label: 'ส่งตรวจผู้ป่วย', Icon: FileDownloadIcon },
  { label: 'ทะเบียนผู้มารับบริการ', Icon: FileCheckIcon },
  { label: 'ทะเบียนนัดหมาย', Icon: FileAttachmentIcon },
  { label: 'ทะเบียนผู้ป่วยโรคเรื้อรัง', Icon: FileMinusIcon },
  { label: 'ทะเบียนนัดฟอกเลือด', Icon: FileHeart3Icon },
]

/**
 * Collapsible "OPD Registery" sidebar menu.
 * Mirrors the Figma OpdMenu component: OPD_01 (collapsed) and
 * OPD_02 (expanded, black header + white dropdown).
 * Auto-expands when the current route is under /opd.
 */
export default function OpdMenu({ className = '', collapsed = false }) {
  const navigate = useNavigate()
  const location = useLocation()
  const onOpdRoute = location.pathname.startsWith('/opd')
  const [open, setOpen] = useState(onOpdRoute)

  // Collapsed sidebar: icon-only button that jumps to the OPD section.
  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => navigate('/opd/medical-records')}
        title="OPD Registery"
        className={`flex w-full items-center justify-center rounded-lg p-2 transition-all ${
          onOpdRoute
            ? 'bg-black text-white'
            : 'text-[#687a8f] hover:bg-white hover:shadow-[0px_2px_6px_0px_rgba(81,111,144,0.2)]'
        }`}
      >
        {onOpdRoute ? (
          <FolderOpenIcon className="size-5" />
        ) : (
          <FolderIcon className="size-5" />
        )}
      </button>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Trigger row */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex w-full items-center gap-2 rounded-lg border p-2 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 ${
          open
            ? 'border-[#8ca0b6] bg-white text-black'
            : 'border-transparent text-[#687a8f] hover:bg-white hover:shadow-[0px_2px_6px_0px_rgba(81,111,144,0.2)]'
        }`}
      >
        {open ? (
          <FolderOpenIcon className="size-5 shrink-0" />
        ) : (
          <FolderIcon className="size-5 shrink-0" />
        )}
        <span className="flex-1 font-sarabun text-[13px] font-medium leading-[18px] tracking-[0.26px]">
          OPD Registery
        </span>
        <ChevronDownIcon
          className={`size-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Expanded sub-menu */}
      {open && (
        <div className="mt-1 flex flex-col rounded-lg bg-white p-2 shadow-[0px_0px_4px_0px_rgba(5,53,131,0.1),0px_4px_4px_0px_rgba(5,53,131,0.15),0px_16px_32px_0px_rgba(5,53,131,0.1)]">
          {SUBMENU.map((item) => {
            const ItemIcon = item.Icon
            const active = item.path && location.pathname === item.path
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => item.path && navigate(item.path)}
                className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 ${
                  active
                    ? 'bg-black text-white'
                    : 'text-[#1d212d] hover:bg-[#f5f8fa]'
                }`}
              >
                <ItemIcon className="size-4 shrink-0" />
                <span className="flex-1 font-sarabun text-sm leading-6 tracking-[-0.084px]">
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
