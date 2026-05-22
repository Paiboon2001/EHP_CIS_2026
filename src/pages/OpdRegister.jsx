import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import TextSlide from '../components/TextSlide.jsx'
import { logout } from '../auth.js'
import {
  UploadIcon,
  EditIcon,
  UserPlusIcon,
  ClockRotateIcon,
} from '../components/icons.jsx'

// Real-people avatars, loaded in filename order to match the HISTORY list.
const avatarModules = import.meta.glob('../assets/avatars/*.jpg', {
  eager: true,
  import: 'default',
})
const AVATARS = Object.keys(avatarModules)
  .sort()
  .map((key) => avatarModules[key])

// Selectable quick-action chips below the search bar.
const ACTIONS = [
  { id: 'edit', label: 'แก้ไขข้อมูลผู้ป่วย', Icon: EditIcon },
  { id: 'register', label: 'ลงทะเบียนผู้ป่วยใหม่', Icon: UserPlusIcon },
]

// Recent transaction history shown in the right-hand panel.
const HISTORY = [
  { hn: '09988764567', name: 'นายมงคลกิจ จิรอนันท์' },
  { hn: '09988764568', name: 'นางสาวสุชาดา ศรีประเสริฐ' },
  { hn: '09988764569', name: 'นายอนุชา วิศาลกิจ' },
  { hn: '09988764570', name: 'นางสาวกนกวรรณ จันทร์แสง' },
  { hn: '09988764571', name: 'นายปริญญา ศรีทอง' },
  { hn: '09988764572', name: 'นางสาววิไลลักษณ์ ชัยชนะ' },
  { hn: '09988764573', name: 'นายธีรภัทร ประเสริฐกิจ' },
  { hn: '09988764574', name: 'นางสาวอรวรรณ วงศ์สวัสดิ์' },
  { hn: '09988764575', name: 'นายสุรชัย แก้วทอง' },
  { hn: '09988764576', name: 'นางสาวปัทมา ศิริกุล' },
  { hn: '09988764577', name: 'นายจิรพันธ์ มณีโชติ' },
  { hn: '09988764578', name: 'นางสาวรัตนา วิทยานุภาพ' },
  { hn: '09988764579', name: 'นายสมชาย ศรีสวัสดิ์' },
  { hn: '09988764580', name: 'นางสาวอัญชลี นาคสุวรรณ' },
  { hn: '09988764581', name: 'นายวรวิทย์ กิตติวัฒน์' },
]

function HistoryPanel() {
  return (
    <aside className="flex h-screen w-[250px] shrink-0 flex-col bg-white">
      <div className="flex items-center gap-2 border-b border-[#e9f0f4] p-4">
        <ClockRotateIcon className="size-5 text-black" />
        <h2 className="font-sarabun text-base font-medium tracking-[0.26px] text-black">
          ประวัติการทำรายการ
        </h2>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        {HISTORY.map((item, index) => (
          <button
            key={item.hn}
            type="button"
            className="flex items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-[#f5fbff]"
          >
            <div className="size-8 shrink-0 overflow-hidden rounded-full bg-[#79ddff]">
              <img
                src={AVATARS[index]}
                alt=""
                className="size-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="font-sarabun text-sm font-medium leading-[18px] tracking-[0.26px] text-black">
                HN : {item.hn}
              </p>
              <p className="truncate font-sarabun text-[10px] leading-[18px] tracking-[0.26px] text-[#798aa3]">
                {item.name}
              </p>
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}

export default function OpdRegister() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedAction, setSelectedAction] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef(null)

  // Close the results dropdown on outside-click or Escape.
  useEffect(() => {
    if (!searchOpen) return
    function onPointerDown(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)
      }
    }
    function onKey(e) {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [searchOpen])

  const query = search.trim()
  const searchResults = query
    ? HISTORY.filter((p) => p.hn.includes(query) || p.name.includes(query))
    : HISTORY

  function selectPatient() {
    setSearchOpen(false)
    navigate('/opd/details')
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function handleSearch(e) {
    e.preventDefault()
    // TODO: look up the patient by HN, then open their record.
    console.log('search HN', search)
    navigate('/opd/details')
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f5fbff]">
      <Sidebar onLogout={handleLogout} />

      {/* Center workspace */}
      <main className="flex h-screen flex-1 flex-col items-center justify-center gap-14 overflow-hidden p-4 bg-[radial-gradient(47%_47%_at_50%_50%,#79ddff_0%,rgba(121,221,255,0.9)_20%,rgba(183,236,255,0.95)_47%,#f5fbff_75%)]">
        <h1 className="whitespace-nowrap text-center font-sarabun text-[clamp(18px,2.8vw,40px)] leading-tight tracking-[0.26px] text-black">
          สวัสดี 🙏 คุณ AUANCHAI เราจะทำอะไรกันดีวันนี้
        </h1>

        <div className="flex w-full max-w-[600px] flex-col items-center gap-8">
          {/* Search */}
          <div ref={searchRef} className="relative z-20 w-full">
            {/* Results dropdown — sits behind the search bar (Figma 374:709) */}
            {searchOpen && (
              <div className="absolute inset-x-0 top-0 flex max-h-[320px] flex-col overflow-hidden rounded-b-[24px] rounded-t-[32px] bg-white pt-[56px] shadow-[0px_16px_32px_0px_rgba(46,144,193,0.25)]">
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <p className="px-4 py-3 font-sarabun text-sm text-[#798aa3]">
                      ไม่พบเลข HN ที่ค้นหา
                    </p>
                  ) : (
                    searchResults.map((item, index) => (
                      <button
                        key={item.hn}
                        type="button"
                        onClick={selectPatient}
                        className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-[#f5fbff]"
                      >
                        <div className="size-8 shrink-0 overflow-hidden rounded-full bg-[#79ddff]">
                          <img
                            src={AVATARS[index % AVATARS.length]}
                            alt=""
                            className="size-full object-cover"
                          />
                        </div>
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <p className="min-w-0 flex-1 truncate font-sarabun text-sm font-medium leading-[18px] tracking-[0.26px] text-black">
                            HN : {item.hn}
                          </p>
                          <p className="shrink-0 font-sarabun text-sm leading-[18px] tracking-[0.26px] text-[#798aa3]">
                            {item.name}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className="relative flex w-full items-center gap-3 rounded-full bg-white py-1 pl-6 pr-1 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.05),0px_16px_32px_0px_rgba(46,144,193,0.25)]"
            >
              <div className="relative min-w-0 flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  aria-label="ค้นหาเลข HN ผู้ป่วย"
                  className="w-full bg-transparent font-sarabun text-xl text-[#1d212d] outline-none"
                />
                {search === '' && (
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                    <TextSlide />
                  </div>
                )}
              </div>
              <button
                type="submit"
                aria-label="ค้นหา"
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-90"
              >
                <UploadIcon className="size-6" />
              </button>
            </form>
          </div>

          {/* Quick actions — selectable chips */}
          <div className="flex flex-wrap justify-center gap-4">
            {ACTIONS.map(({ id, label, Icon }) => {
              const selected = selectedAction === id
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSelectedAction(selected ? null : id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors ${
                    selected
                      ? 'bg-black text-white'
                      : 'bg-white text-[#687a8f] hover:bg-[#f5f8fa]'
                  }`}
                >
                  <Icon className="size-5" />
                  <span className="font-sarabun text-[13px] font-medium tracking-[0.26px]">
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </main>

      <HistoryPanel />
    </div>
  )
}
