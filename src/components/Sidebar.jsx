import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ehpWordmark from '../assets/ehp-wordmark.png'
import userAvatar from '../assets/user-avatar.png'
import profileCardBg from '../assets/profile-card-bg.png'
import { GridIcon, FolderIcon, LayoutRightIcon, LogoutIcon } from './icons.jsx'
import OpdMenu from './OpdMenu.jsx'

// Sidebar navigation items. `icon: 'grid'` marks the dashboard entry;
// `type: 'opd'` is the collapsible OPD Registery menu (own component);
// `path` items navigate and highlight when that route is active.
const NAV_ITEMS = [
  { label: 'Homepage', icon: 'grid', path: '/' },
  { label: 'OPD Registery', type: 'opd' },
  { label: 'WorkBench', icon: 'folder' },
  { label: 'Data Export', icon: 'folder' },
  { label: 'EPIDEM', icon: 'folder' },
  { label: 'Claims Submission', icon: 'folder' },
  { label: 'PCU', icon: 'folder' },
  { label: 'Referral', icon: 'folder' },
  { label: 'Report', icon: 'folder' },
  { label: 'Inventory', icon: 'folder' },
  { label: 'Telehealth', icon: 'folder' },
  { label: 'System', icon: 'folder' },
  { label: 'Settings', icon: 'folder' },
]

function NavLink({ item, active, onClick, collapsed }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={`flex w-full items-center gap-2 rounded-lg p-2 text-left transition-all ${
        collapsed ? 'justify-center' : ''
      } ${
        active
          ? 'bg-black text-white'
          : 'text-[#687a8f] hover:bg-white hover:shadow-[0px_2px_6px_0px_rgba(81,111,144,0.2)]'
      }`}
    >
      {item.icon === 'grid' ? (
        <GridIcon className="size-5 shrink-0" filled={active} />
      ) : (
        <FolderIcon className="size-5 shrink-0" />
      )}
      {!collapsed && (
        <span className="flex-1 font-sarabun text-[13px] font-medium leading-[18px] tracking-[0.26px]">
          {item.label}
        </span>
      )}
    </button>
  )
}

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('ehp-sidebar-collapsed') === '1',
  )

  function toggleCollapsed() {
    setCollapsed((v) => {
      const next = !v
      localStorage.setItem('ehp-sidebar-collapsed', next ? '1' : '0')
      return next
    })
  }

  return (
    <aside
      className={`flex h-screen shrink-0 flex-col border-r border-[#f2f9ff] pt-3 bg-[linear-gradient(180.5deg,#ffffff_16.31%,#79ddff_210%)] drop-shadow-[1px_0px_5px_rgba(81,111,144,0.15)] transition-[width] duration-200 ${
        collapsed ? 'w-[76px]' : 'w-[230px]'
      }`}
    >
      {/* Brand header */}
      <div
        className={`flex items-center pb-6 ${
          collapsed ? 'justify-center px-2' : 'justify-between px-4'
        }`}
      >
        {!collapsed && (
          <img
            src={ehpWordmark}
            alt="Excellent Health Platform"
            className="h-[39px] w-[120px] object-contain"
          />
        )}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="text-[#687a8f] transition-colors hover:text-[#1d212d]"
        >
          <LayoutRightIcon
            className={`size-5 transition-transform ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav
        className={`flex flex-1 flex-col gap-1.5 overflow-y-auto ${
          collapsed ? 'px-2' : 'px-4'
        }`}
      >
        {NAV_ITEMS.map((item) =>
          item.type === 'opd' ? (
            <OpdMenu key={item.label} collapsed={collapsed} />
          ) : (
            <NavLink
              key={item.label}
              item={item}
              active={item.path === location.pathname}
              onClick={() => item.path && navigate(item.path)}
              collapsed={collapsed}
            />
          ),
        )}
      </nav>

      {/* Profile card */}
      <div className={collapsed ? 'p-2' : 'p-3'}>
        <div className="relative overflow-hidden rounded-xl border-[0.5px] border-[#d6f5ff] shadow-[0px_2px_8px_2px_rgba(0,77,149,0.25)]">
          <img
            src={profileCardBg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 rounded-xl shadow-[inset_0px_2px_2px_1px_rgba(255,255,255,0.31)]" />

          <div className="relative">
            {/* User */}
            <div
              className={`flex gap-2 p-2 ${
                collapsed ? 'justify-center' : 'items-start'
              }`}
            >
              <div className="size-8 shrink-0 overflow-hidden rounded-full bg-white">
                <img src={userAvatar} alt="" className="size-full object-cover" />
              </div>
              {!collapsed && (
                <div className="flex flex-col justify-center">
                  <p className="font-sarabun text-sm font-medium leading-[18px] tracking-[0.26px] text-white [text-shadow:0px_0.5px_1px_rgba(0,68,137,0.25)]">
                    นพ. วิมลกร อมรศักดิ์
                  </p>
                  <p className="font-sarabun text-[10px] leading-[18px] tracking-[0.26px] text-white">
                    โรงพยาบาลนาลันทา
                  </p>
                  <p className="font-sarabun text-[10px] leading-[18px] tracking-[0.26px] text-white">
                    แพทย์
                  </p>
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={onLogout}
              title={collapsed ? 'Logout' : undefined}
              className="flex w-full items-center justify-center gap-2 border-t-[0.3px] border-[#e6f5ff] p-2 transition-colors hover:bg-white/10"
            >
              <LogoutIcon className="size-[15px] text-white" />
              {!collapsed && (
                <span className="font-sarabun text-[13px] font-medium leading-[18px] tracking-[0.26px] text-white">
                  Logout
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
