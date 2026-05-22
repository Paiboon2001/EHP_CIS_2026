import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { logout } from '../auth.js'
import { UserIcon, ChevronDownIcon, UploadIcon, EditIcon } from '../components/icons.jsx'
import cardIdCard from '../assets/opd/card-idcard.png'
import cardBooking from '../assets/opd/card-booking.png'

const TABS = [
  'ข้อมูลทั่วไป',
  'สิทธิการรักษา',
  'การรักษา',
  'โรคประจำตัว',
  'การแพ้อาหาร',
  'สถานะพิเศษ',
  'ข้อมูลปกปิด',
  'การนัดหมาย',
  'Note',
  'การพิมพ์เอกสาร',
  'eprescription',
  'Audit',
  'ผู้ดูแล',
]

const GENERAL_FIELDS = [
  { label: 'คำนำหน้า', req: true, kind: 'select' },
  { label: 'ชื่อ', req: true, kind: 'input' },
  { label: 'นามสกุล', req: true, kind: 'input' },
  { label: 'บัตรประชาชน', req: true, kind: 'input' },
  { label: 'วันเกิด', req: true, kind: 'input' },
  { label: 'อายุ', kind: 'input', suffix: 'ปี' },
  { label: 'อาชีพ', kind: 'select' },
  { kind: 'spacer' },
  { label: 'เชื้อชาติ', req: true, kind: 'select' },
  { label: 'สัญชาติ', req: true, kind: 'select' },
  { label: 'ศาสนา', req: true, kind: 'select' },
  { label: 'จำนวนพี่น้อง', req: true, kind: 'select' },
  { label: 'หมู่เลือด', kind: 'select' },
  { label: 'Rh', kind: 'select' },
  { label: 'การแพ้ยา', req: true, kind: 'input' },
  { label: 'บุตรคนที่', req: true, kind: 'input' },
  { label: 'สถานะภาพ', kind: 'select' },
  { label: 'ผู้แจ้ง', kind: 'input' },
  { label: 'ความสัมพันธ์', kind: 'select' },
]

const ADDRESS_FIELDS = [
  { label: 'ประเทศ', kind: 'select' },
  { label: 'รหัสไปรษณีย์', kind: 'select' },
  { label: 'จังหวัด', kind: 'select' },
  { label: 'อำเภอ', kind: 'select' },
  { label: 'ตำบล', kind: 'select' },
  { label: 'บ้านเลขที่', kind: 'input' },
  { label: 'หมู่ที่', kind: 'input' },
  { label: 'บ้าน', kind: 'input' },
  { label: 'ซอย', kind: 'input' },
  { label: 'ถนน', kind: 'input' },
  { label: 'สิ่งที่จะสังเกตเห็น', kind: 'input' },
  { label: 'วันที่แฟ้มถูกทำลาย', kind: 'input' },
]

const OTHER_FIELDS = [
  'เบอร์มือถือ',
  'เบอร์โทรศัพท์ที่ทำงาน',
  'อีเมล',
  'เลขที่ Passport',
  'ภาษาหลัก',
  'สีผิว',
  'เลขที่อ้างอิง',
  'ชื่อเล่น',
]

/* --- small page-specific icons --- */
function SaveIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8M7 3v5h8" />
    </svg>
  )
}
function PinIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
function InfoIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  )
}
function CameraIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 7h3l1.5-2h5L16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  )
}

/* --- form field --- */
function Field({ field }) {
  if (field.kind === 'spacer') return <div className="hidden xl:block" />
  return (
    <div className="flex flex-col gap-1">
      <label className="font-sarabun text-[13px] text-[#1d212d]">
        {field.label}
        {field.req && <span className="text-[#ef4444]"> *</span>}
      </label>
      {field.kind === 'select' ? (
        <button
          type="button"
          className="flex items-center justify-between rounded-lg border border-[#d9e2ec] bg-white px-3 py-2 text-left transition-colors hover:border-[#9ec9e8]"
        >
          <span className="font-sarabun text-sm text-[#9aa7b8]">กรุณาเลือก</span>
          <ChevronDownIcon className="size-4 shrink-0 text-[#9aa7b8]" />
        </button>
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-[#d9e2ec] bg-white px-3 py-2 focus-within:border-[#9ec9e8]">
          <input
            type="text"
            className="w-full bg-transparent font-sarabun text-sm text-[#1d212d] outline-none"
          />
          {field.suffix && (
            <span className="shrink-0 font-sarabun text-sm text-[#9aa7b8]">
              {field.suffix}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

function SectionCard({ icon, title, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#e3edf5] bg-white shadow-[0px_1px_3px_rgba(81,111,144,0.08)]">
      <div className="flex items-center gap-2 bg-gradient-to-b from-[#e4f2fc] to-[#f6fbfe] px-4 py-3">
        <span className="text-[#1a8cff]">{icon}</span>
        <h3 className="font-sarabun text-base font-semibold text-[#1d212d]">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-4 md:grid-cols-4">
        {children}
      </div>
    </div>
  )
}

/* --- left media column --- */
function MediaColumn() {
  return (
    <aside className="flex w-[200px] shrink-0 flex-col gap-3">
      {/* Patient photo */}
      <div className="rounded-xl border border-[#e3edf5] bg-white p-3 shadow-[0px_1px_3px_rgba(81,111,144,0.08)]">
        <div className="flex flex-col items-center gap-1 rounded-lg border border-dashed border-[#c4d3e0] py-5">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#eef4f9] text-[#9aa7b8]">
            <UserIcon className="size-6" />
          </div>
          <p className="font-sarabun text-[13px] font-medium text-[#1d212d]">
            รูปภาพผู้ป่วย
          </p>
          <p className="font-sarabun text-[11px] text-[#9aa7b8]">
            JPG, PNG up to 5MB
          </p>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-black px-2 py-1.5 font-sarabun text-[12px] font-medium text-white">
            <UploadIcon className="size-3.5" /> อัปโหลด
          </button>
          <button className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-[#d9e2ec] bg-white px-2 py-1.5 font-sarabun text-[12px] font-medium text-[#1d212d]">
            <CameraIcon className="size-3.5" /> ถ่ายรูป
          </button>
        </div>
      </div>

      {/* Fingerprint */}
      <div className="rounded-xl border border-[#e3edf5] bg-white p-3 shadow-[0px_1px_3px_rgba(81,111,144,0.08)]">
        <h3 className="mb-2 font-sarabun text-[13px] font-semibold text-[#1d212d]">
          ลายนิ้วมือ
        </h3>
        <div className="flex items-center justify-center rounded-lg border border-dashed border-[#c4d3e0] py-6">
          <p className="font-sarabun text-[12px] text-[#9aa7b8]">
            ไม่มีการบันทึกลายนิ้วมือ
          </p>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-black px-2 py-1.5 font-sarabun text-[12px] font-medium text-white">
            <UploadIcon className="size-3.5" /> อัปโหลด
          </button>
          <button className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-[#d9e2ec] bg-white px-2 py-1.5 font-sarabun text-[12px] font-medium text-[#1d212d]">
            <EditIcon className="size-3.5" /> แก้ไข
          </button>
        </div>
      </div>

      {/* ID card reader */}
      <button type="button" className="overflow-hidden rounded-xl shadow-[0px_1px_3px_rgba(81,111,144,0.08)]">
        <img src={cardIdCard} alt="อ่านบัตรประชาชน" className="w-full" />
      </button>

      {/* Online booking */}
      <button type="button" className="overflow-hidden rounded-xl shadow-[0px_1px_3px_rgba(81,111,144,0.08)]">
        <img src={cardBooking} alt="จองนัดหมายออนไลน์" className="w-full" />
      </button>
    </aside>
  )
}

/* --- right "other info" panel --- */
function OtherInfoCheck({ title, sub }) {
  return (
    <label className="flex cursor-pointer items-start gap-2">
      <input type="checkbox" className="mt-0.5 size-4 accent-[#1a8cff]" />
      <span className="flex flex-col">
        <span className="font-sarabun text-[13px] font-medium text-[#1d212d]">
          {title}
        </span>
        <span className="font-sarabun text-[11px] text-[#9aa7b8]">{sub}</span>
      </span>
    </label>
  )
}

function RightPanel() {
  return (
    <aside className="w-[210px] shrink-0 overflow-hidden rounded-xl border border-[#e3edf5] bg-white shadow-[0px_1px_3px_rgba(81,111,144,0.08)]">
      <div className="flex items-center gap-2 bg-gradient-to-b from-[#e4f2fc] to-[#f6fbfe] px-4 py-3">
        <span className="text-[#1a8cff]">
          <InfoIcon />
        </span>
        <h3 className="font-sarabun text-base font-semibold text-[#1d212d]">
          ข้อมูลอื่นๆ
        </h3>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <OtherInfoCheck
          title="Area Responsibility"
          sub="อยู่ในเขตความรับผิดชอบ"
        />
        <OtherInfoCheck title="Legal Case Patient" sub="ผู้ป่วยคดีความ" />
        {OTHER_FIELDS.map((label) => (
          <div key={label} className="flex flex-col gap-1">
            <label className="font-sarabun text-[13px] text-[#1d212d]">
              {label}
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-[#d9e2ec] bg-white px-3 py-2 font-sarabun text-sm text-[#1d212d] outline-none focus:border-[#9ec9e8]"
            />
          </div>
        ))}
      </div>
    </aside>
  )
}

export default function OpdDetails() {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#eef5fa]">
      <Sidebar onLogout={handleLogout} />

      <main className="flex h-screen flex-1 flex-col overflow-hidden">
        {/* HN top bar */}
        <header className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-2 border-b border-[#e3edf5] bg-white px-5 py-3">
          <span className="font-sarabun text-base font-bold text-[#1a8cff]">
            HN : 09988764568
          </span>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" className="size-4 accent-[#1a8cff]" />
            <span className="font-sarabun text-[13px] text-[#1d212d]">
              เปิด Visit หลังจากบันทึก
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" className="size-4 accent-[#1a8cff]" />
            <span className="font-sarabun text-[13px] text-[#1d212d]">
              กำหนดเลข HN ใหม่
            </span>
          </label>
          <div className="ml-auto flex items-center gap-2">
            <button className="rounded-lg border border-[#d9e2ec] bg-white px-4 py-2 font-sarabun text-sm font-medium text-[#1d212d] transition-colors hover:bg-[#f5f8fa]">
              Tasks
            </button>
            <button className="rounded-lg bg-[#16a34a] px-5 py-2 font-sarabun text-sm font-semibold text-white transition-opacity hover:opacity-90">
              บันทึก
            </button>
          </div>
        </header>

        {/* Tabs */}
        <nav className="flex shrink-0 gap-2 overflow-x-auto border-b border-[#e3edf5] bg-white px-5 py-2.5">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              type="button"
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 font-sarabun text-[13px] font-medium transition-colors ${
                i === 0
                  ? 'bg-[#1a8cff] text-white'
                  : 'border border-[#e3edf5] bg-white text-[#5b6b7f] hover:bg-[#f5f8fa]'
              }`}
            >
              <SaveIcon className="size-3.5" />
              {tab}
            </button>
          ))}
        </nav>

        {/* Body */}
        <div className="flex flex-1 gap-4 overflow-y-auto p-4">
          <MediaColumn />

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <SectionCard
              icon={<UserIcon className="size-[18px]" />}
              title="ข้อมูลทั่วไปของผู้ป่วย"
            >
              {GENERAL_FIELDS.map((field, i) => (
                <Field key={i} field={field} />
              ))}
            </SectionCard>

            <SectionCard icon={<PinIcon />} title="ที่อยู่ปัจจุบัน">
              {ADDRESS_FIELDS.map((field, i) => (
                <Field key={i} field={field} />
              ))}
            </SectionCard>
          </div>

          <RightPanel />
        </div>
      </main>
    </div>
  )
}
