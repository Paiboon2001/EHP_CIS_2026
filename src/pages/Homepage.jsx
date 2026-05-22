import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { logout } from '../auth.js'
import { UserPlusIcon, FileDownloadIcon } from '../components/icons.jsx'
import skyBg from '../assets/login/sky-bg.png'
import squiggleGreen from '../assets/homepage/squiggle-green.svg'
import squiggleBlue from '../assets/homepage/squiggle-blue.svg'

/* --- small page-specific icons --- */
function SearchIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
function XIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

/* --- hero decorations (Figma node 397:2593) --- */
function Sparkle({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 1c.8 5.5 5.5 10.2 11 11-5.5.8-10.2 5.5-11 11-.8-5.5-5.5-10.2-11-11C6.5 11.2 11.2 6.5 12 1Z" />
    </svg>
  )
}

function HeroBadge({ className = '', color, label, beakClassName = '' }) {
  return (
    <div className={`pointer-events-none absolute ${className}`}>
      <div
        className="rounded-xl px-4 py-3 shadow-[0px_4px_4px_rgba(0,0,0,0.15),0px_1px_1.5px_rgba(0,0,0,0.3)]"
        style={{ backgroundColor: color }}
      >
        <p className="whitespace-nowrap font-sarabun text-sm font-bold text-[#1d212d]">
          {label}
        </p>
      </div>
      {/* black beak — position/angle set per badge */}
      <svg
        className={`absolute h-6 w-[26px] ${beakClassName}`}
        viewBox="0 0 22 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M21.8188 19.9377L10.8632 -0.000118827L8.75816 9.42574L6.81629e-05 13.4968L21.8188 19.9377Z"
          fill="black"
        />
      </svg>
    </div>
  )
}

/* --- decorative hourglass for the "คิวปัจจุบัน" card --- */
function Hourglass({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 75 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M37.5 37.5L50.8528 48.6273C52.8367 50.2806 53.8286 51.1072 54.5418 52.1205C55.1736 53.0183 55.6428 54.0202 55.9281 55.0804C56.25 56.2769 56.25 57.5682 56.25 60.1506V68.75H18.75V60.1506C18.75 57.5682 18.75 56.2769 19.0719 55.0804C19.3572 54.0202 19.8264 53.0183 20.4582 52.1205C21.1714 51.1072 22.1633 50.2806 24.1472 48.6273L37.5 37.5L24.1472 26.3727C22.1633 24.7194 21.1714 23.8928 20.4582 22.8795C19.8264 21.9817 19.3572 20.9798 19.0719 19.9196C18.75 18.7231 18.75 17.4319 18.75 14.8494V6.25H56.25V14.8494C56.25 17.4319 56.25 18.7231 55.9281 19.9196C55.6428 20.9798 55.1736 21.9817 54.5418 22.8795C53.8286 23.8928 52.8367 24.7194 50.8528 26.3727L37.5 37.5Z"
        fill="url(#hourglass-grad)"
      />
      <path
        d="M37.5 37.5L50.8528 48.6273C52.8367 50.2806 53.8286 51.1072 54.5418 52.1205C55.1736 53.0183 55.6428 54.0202 55.9281 55.0804C56.25 56.2769 56.25 57.5682 56.25 60.1506V68.75M37.5 37.5L24.1472 48.6273C22.1633 50.2806 21.1714 51.1072 20.4582 52.1205C19.8264 53.0183 19.3572 54.0202 19.0719 55.0804C18.75 56.2769 18.75 57.5682 18.75 60.1506V68.75M37.5 37.5L50.8528 26.3727C52.8367 24.7194 53.8286 23.8928 54.5418 22.8795C55.1736 21.9817 55.6428 20.9798 55.9281 19.9196C56.25 18.7231 56.25 17.4318 56.25 14.8494V6.25M37.5 37.5L24.1472 26.3727C22.1633 24.7194 21.1714 23.8928 20.4582 22.8795C19.8264 21.9817 19.3572 20.9798 19.0719 19.9196C18.75 18.7231 18.75 17.4318 18.75 14.8494V6.25M62.5 68.75H12.5M62.5 6.25H12.5"
        stroke="#60C4F9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="hourglass-grad"
          x1="37.5"
          y1="68.75"
          x2="37.5"
          y2="6.25"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.0432692" stopColor="#00BEFF" />
          <stop offset="0.479963" stopColor="#79DDFF" />
          <stop offset="1" stopColor="#15A4F0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/* --- decorative person icon for the "รอตรวจ" card --- */
function WaitingIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 75 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M11.5 55L7 61V63.5L10 67L15 69H53.5L56 68V62L51.5 55.5L46 53.5H15.5L11.5 55Z"
        fill="url(#waiting-grad-0)"
      />
      <path
        d="M31.25 42.1875C38.1536 42.1875 43.75 36.5911 43.75 29.6875C43.75 22.7839 38.1536 17.1875 31.25 17.1875C24.3464 17.1875 18.75 22.7839 18.75 29.6875C18.75 36.5911 24.3464 42.1875 31.25 42.1875Z"
        fill="url(#waiting-grad-1)"
      />
      <path
        d="M59.375 6.25L50 15.625L59.375 25M50 15.625L68.75 15.625M68.75 37.5V53.75C68.75 59.0005 68.75 61.6257 67.7282 63.6312C66.8294 65.3952 65.3952 66.8294 63.6312 67.7282C61.6257 68.75 59.0005 68.75 53.75 68.75H21.25C15.9995 68.75 13.3743 68.75 11.3688 67.7282C9.60482 66.8294 8.17063 65.3952 7.27181 63.6312C6.25 61.6257 6.25 59.0005 6.25 53.75V21.25C6.25 15.9995 6.25 13.3743 7.27181 11.3688C8.17063 9.60482 9.60482 8.17063 11.3688 7.27181C13.3743 6.25 15.9995 6.25 21.25 6.25H37.5M6.70471 62.2697C8.17078 56.9956 13.008 53.125 18.7493 53.125H40.6243C43.5284 53.125 44.9804 53.125 46.1879 53.3652C51.1465 54.3515 55.0228 58.2277 56.0091 63.1864C56.2493 64.3939 56.2493 65.8459 56.2493 68.75M43.75 29.6875C43.75 36.5911 38.1536 42.1875 31.25 42.1875C24.3464 42.1875 18.75 36.5911 18.75 29.6875C18.75 22.7839 24.3464 17.1875 31.25 17.1875C38.1536 17.1875 43.75 22.7839 43.75 29.6875Z"
        stroke="#BD8AFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="waiting-grad-0"
          x1="18.5"
          y1="51.5"
          x2="50.5"
          y2="77"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E1A1FF" />
          <stop offset="1" stopColor="#BF64FF" />
        </linearGradient>
        <linearGradient
          id="waiting-grad-1"
          x1="26"
          y1="6"
          x2="45"
          y2="72"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F8CCFF" />
          <stop offset="1" stopColor="#8801FF" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/* --- decorative person icon for the "ผู้ป่วยวันนี้" card --- */
function TodayIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 75 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M11.5 55L7 61V63.5L10 67L15 69H53.5L56 68V62L51.5 55.5L46 53.5H15.5L11.5 55Z"
        fill="url(#today-grad-0)"
      />
      <path
        d="M31.25 42.1875C38.1536 42.1875 43.75 36.5911 43.75 29.6875C43.75 22.7839 38.1536 17.1875 31.25 17.1875C24.3464 17.1875 18.75 22.7839 18.75 29.6875C18.75 36.5911 24.3464 42.1875 31.25 42.1875Z"
        fill="url(#today-grad-1)"
      />
      <path
        d="M68.75 15.625L59.375 25L50 15.625M59.375 25V6.25M68.75 37.5V53.75C68.75 59.0005 68.75 61.6257 67.7282 63.6312C66.8294 65.3952 65.3952 66.8294 63.6312 67.7282C61.6257 68.75 59.0005 68.75 53.75 68.75H21.25C15.9995 68.75 13.3743 68.75 11.3688 67.7282C9.60482 66.8294 8.17063 65.3952 7.27181 63.6312C6.25 61.6257 6.25 59.0005 6.25 53.75V21.25C6.25 15.9995 6.25 13.3743 7.27181 11.3688C8.17063 9.60482 9.60482 8.17063 11.3688 7.27181C13.3743 6.25 15.9995 6.25 21.25 6.25H37.5M6.70544 62.2697C8.17151 56.9956 13.0087 53.125 18.75 53.125H40.625C43.5291 53.125 44.9811 53.125 46.1886 53.3652C51.1473 54.3515 55.0235 58.2277 56.0098 63.1864C56.25 64.3939 56.25 65.8459 56.25 68.75M43.75 29.6875C43.75 36.5911 38.1536 42.1875 31.25 42.1875C24.3464 42.1875 18.75 36.5911 18.75 29.6875C18.75 22.7839 24.3464 17.1875 31.25 17.1875C38.1536 17.1875 43.75 22.7839 43.75 29.6875Z"
        stroke="#FFA46F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="today-grad-0"
          x1="18.5"
          y1="51.5"
          x2="50.5"
          y2="77"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFC261" />
          <stop offset="1" stopColor="#FF892E" />
        </linearGradient>
        <linearGradient
          id="today-grad-1"
          x1="26.5"
          y1="8.5"
          x2="52.5"
          y2="49.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFDE7A" />
          <stop offset="1" stopColor="#FF5500" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/* --- decorative person icon for the "ผู้ป่วยใหม่" card --- */
function NewPatientIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 75 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M11.5 55L7 61V63.5L10 67L15 69H53.5L56 68V62L51.5 55.5L46 53.5H15.5L11.5 55Z"
        fill="url(#new-grad-0)"
      />
      <path
        d="M31.25 42.1875C38.1536 42.1875 43.75 36.5911 43.75 29.6875C43.75 22.7839 38.1536 17.1875 31.25 17.1875C24.3464 17.1875 18.75 22.7839 18.75 29.6875C18.75 36.5911 24.3464 42.1875 31.25 42.1875Z"
        fill="url(#new-grad-1)"
      />
      <path
        d="M59.375 25V6.25M50 15.625H68.75M68.75 37.5V53.75C68.75 59.0005 68.75 61.6257 67.7282 63.6312C66.8294 65.3952 65.3952 66.8294 63.6312 67.7282C61.6257 68.75 59.0005 68.75 53.75 68.75H21.25C15.9995 68.75 13.3743 68.75 11.3688 67.7282C9.60482 66.8294 8.17063 65.3952 7.27181 63.6312C6.25 61.6257 6.25 59.0005 6.25 53.75V21.25C6.25 15.9995 6.25 13.3743 7.27181 11.3688C8.17063 9.60482 9.60482 8.17063 11.3688 7.27181C13.3743 6.25 15.9995 6.25 21.25 6.25H37.5M6.70544 62.2697C8.17151 56.9956 13.0087 53.125 18.75 53.125H40.625C43.5291 53.125 44.9811 53.125 46.1886 53.3652C51.1473 54.3515 55.0235 58.2277 56.0098 63.1864C56.25 64.3939 56.25 65.8459 56.25 68.75M43.75 29.6875C43.75 36.5911 38.1536 42.1875 31.25 42.1875C24.3464 42.1875 18.75 36.5911 18.75 29.6875C18.75 22.7839 24.3464 17.1875 31.25 17.1875C38.1536 17.1875 43.75 22.7839 43.75 29.6875Z"
        stroke="#FFC76D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="new-grad-0"
          x1="18.5"
          y1="51.5"
          x2="50.5"
          y2="77"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFE26F" />
          <stop offset="1" stopColor="#FFAE00" />
        </linearGradient>
        <linearGradient
          id="new-grad-1"
          x1="26"
          y1="6"
          x2="48"
          y2="54.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFEB9A" />
          <stop offset="1" stopColor="#FFCC00" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/* --- decorative person icon for the "ตรวจเสร็จ" card --- */
function DoneIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 75 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M11.5 55L7 61V63.5L10 67L15 69H53.5L56 68V62L51.5 55.5L46 53.5H15.5L11.5 55Z"
        fill="url(#done-grad-0)"
      />
      <path
        d="M31.25 42.1875C38.1536 42.1875 43.75 36.5911 43.75 29.6875C43.75 22.7839 38.1536 17.1875 31.25 17.1875C24.3464 17.1875 18.75 22.7839 18.75 29.6875C18.75 36.5911 24.3464 42.1875 31.25 42.1875Z"
        fill="url(#done-grad-1)"
      />
      <path
        d="M50 15.625L56.25 21.875L68.75 9.375M68.75 37.5V53.75C68.75 59.0005 68.75 61.6257 67.7282 63.6312C66.8294 65.3952 65.3952 66.8294 63.6312 67.7282C61.6257 68.75 59.0005 68.75 53.75 68.75H21.25C15.9995 68.75 13.3743 68.75 11.3688 67.7282C9.60482 66.8294 8.17063 65.3952 7.27181 63.6312C6.25 61.6257 6.25 59.0005 6.25 53.75V21.25C6.25 15.9995 6.25 13.3743 7.27181 11.3688C8.17063 9.60482 9.60482 8.17063 11.3688 7.27181C13.3743 6.25 15.9995 6.25 21.25 6.25H37.5M6.70471 62.2697C8.17078 56.9956 13.008 53.125 18.7493 53.125H40.6243C43.5284 53.125 44.9804 53.125 46.1879 53.3652C51.1465 54.3515 55.0228 58.2277 56.0091 63.1864C56.2493 64.3939 56.2493 65.8459 56.2493 68.75M43.75 29.6875C43.75 36.5911 38.1536 42.1875 31.25 42.1875C24.3464 42.1875 18.75 36.5911 18.75 29.6875C18.75 22.7839 24.3464 17.1875 31.25 17.1875C38.1536 17.1875 43.75 22.7839 43.75 29.6875Z"
        stroke="#70D767"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="done-grad-0"
          x1="18.5"
          y1="51.5"
          x2="50.5"
          y2="77"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#84FF6F" />
          <stop offset="1" stopColor="#09990A" />
        </linearGradient>
        <linearGradient
          id="done-grad-1"
          x1="28.5"
          y1="14"
          x2="44"
          y2="48.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7BF767" />
          <stop offset="1" stopColor="#1AA718" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Dashboard summary cards — gradient + glow per Figma node 420:562.
const STATS = [
  {
    label: 'คิวปัจจุบัน',
    value: 'A-025',
    note: 'นางสาวปวีณา ศรีสุข',
    gradient: 'linear-gradient(146deg, #79d5ff 5%, #009aed 89%)',
    shadow: '0px 2px 15px 4px rgba(12,129,255,0.3)',
    icon: Hourglass,
  },
  {
    label: 'รอตรวจ',
    value: '124',
    unit: 'ราย',
    note: 'มีจำนวนคงที่ 13% ต่อ 1 ชั่วโมง',
    gradient: 'linear-gradient(164deg, #cea8ff 6%, #8426fe 77%)',
    shadow: '0px 2px 15px 4px rgba(151,71,255,0.3)',
    icon: WaitingIcon,
  },
  {
    label: 'ผู้ป่วยวันนี้',
    value: '150',
    unit: 'ราย',
    note: 'มีจำนวนเพิ่มขึ้น 10%',
    gradient: 'linear-gradient(142deg, #ffa85b 8%, #ff5e00 80%)',
    shadow: '0px 2px 10px 4px rgba(255,146,83,0.4)',
    icon: TodayIcon,
  },
  {
    label: 'ผู้ป่วยใหม่',
    value: '23',
    unit: 'ราย',
    note: 'ลงทะเบียนแล้วจาก IPD',
    gradient: 'linear-gradient(139deg, #ffcc00 17%, #ee8f00 94%)',
    shadow: '0px 2px 10px 4px rgba(255,200,0,0.3)',
    icon: NewPatientIcon,
  },
  {
    label: 'ตรวจเสร็จ',
    value: '34',
    unit: 'ราย',
    note: '40% ของผู้ป่วยวันนี้',
    gradient: 'linear-gradient(137deg, #68d84e 11%, #09990a 89%)',
    shadow: '0px 2px 10px 4px rgba(69,197,52,0.3)',
    icon: DoneIcon,
  },
]

// Today's queue rows — fictional data from Figma node 420:3143.
const QUEUE = [
  { no: 1, name: 'นางสาวกร อมรดน', hn: '123453', symptom: 'ไข้หวัดใหญ่', dept: 'พักผ่อนเยอะๆ', queue: 'A-025', time: '08:45 น.' },
  { no: 2, name: 'นายสมชาย ใจดี', hn: '123454', symptom: 'ปวดหัว', dept: 'ดื่มน้ำมากๆ', queue: 'B-014', time: '09:10 น.' },
  { no: 3, name: 'นางสาวศิริพร แสงทอง', hn: '123455', symptom: 'ท้องเสีย', dept: 'ทานอาหารอ่อน ย่อยง่าย', queue: 'C-037', time: '09:35 น.' },
  { no: 4, name: 'นายวีรพล แก้วมณี', hn: '123456', symptom: 'แพ้อากาศ', dept: 'สวมหน้ากากอนามัย', queue: 'D-020', time: '10:00 น.' },
  { no: 5, name: 'นางสาวปวีณา ศรีสุข', hn: '123457', symptom: 'ไข้หวัดธรรมดา', dept: 'พักผ่อนและดื่มน้ำอุ่น', queue: 'E-033', time: '10:25 น.' },
  { no: 6, name: 'นายธนพล พงษ์ประเสริฐ', hn: '123458', symptom: 'ปวดกล้ามเนื้อ', dept: 'ประคบร้อนและพักผ่อน', queue: 'F-009', time: '10:50 น.' },
  { no: 7, name: 'นางสาวพิมพ์ชนก วงศ์สวัสดิ์', hn: '123459', symptom: 'เบาหวาน', dept: 'ควบคุมอาหารและออกกำลังกาย', queue: 'G-015', time: '11:15 น.' },
  { no: 8, name: 'นายอรรถพล สุขใจ', hn: '123460', symptom: 'ความดันโลหิตสูง', dept: 'หลีกเลี่ยงเค็มและพักผ่อน', queue: 'H-028', time: '11:40 น.' },
  { no: 9, name: 'นางสาวดารินทร์ จันทร์ฉาย', hn: '123461', symptom: 'ภูมิแพ้', dept: 'หลีกเลี่ยงสารก่อภูมิแพ้', queue: 'I-042', time: '12:05 น.' },
  { no: 10, name: 'นายวิศรุต เชาวน์ดี', hn: '123462', symptom: 'เจ็บคอ', dept: 'กลั้วคอด้วยน้ำเกลือ', queue: 'J-011', time: '12:30 น.' },
  { no: 11, name: 'นางสาวสุชาดา สุขเกษม', hn: '123463', symptom: 'ท้องอืด', dept: 'ทานอาหารย่อยง่ายและเดินเล่น', queue: 'K-024', time: '12:55 น.' },
  { no: 12, name: 'นายกิตติพงษ์ ทองมี', hn: '123464', symptom: 'ปวดท้อง', dept: 'พักผ่อนและดื่มน้ำอุ่น', queue: 'L-038', time: '13:20 น.' },
  { no: 13, name: 'นางสาวมิ่งขวัญ ศรีสุวรรณ', hn: '123465', symptom: 'เหนื่อยล้า', dept: 'นอนหลับพักผ่อนให้เพียงพอ', queue: 'M-046', time: '13:45 น.' },
]

export default function Homepage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const query = search.trim()
  const rows = query
    ? QUEUE.filter((r) => r.name.includes(query) || r.hn.includes(query))
    : QUEUE

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f5fbff]">
      <Sidebar onLogout={handleLogout} />

      <main className="flex flex-1 flex-col overflow-hidden p-4">
        <div className="home-fade-up flex-1 overflow-y-auto rounded-xl bg-white shadow-[0px_1px_7px_0px_rgba(0,122,255,0.1)]">
          {/* Hero banner — Figma node 442:383, sky reused from login page */}
          <div className="relative h-[280px] overflow-hidden bg-gradient-to-b from-white via-[#88defc] via-[71.712%] to-white">
            {/* sky background — reused from login page */}
            <img
              src={skyBg}
              alt=""
              aria-hidden="true"
              className="home-sky-drift pointer-events-none absolute left-[-4%] top-[-480px] w-[108%] max-w-none"
            />
            {/* fade into the white card below */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-white" />

            {/* greeting */}
            <div className="absolute left-6 top-6 z-10 flex flex-col gap-6">
              <p className="font-sarabun text-base text-[#1d212d]">
                วันที่ 22 พฤษภาคม 2569
              </p>
              <h1 className="font-sarabun text-[32px] font-bold leading-none [text-shadow:0px_2px_2px_rgba(0,90,187,0.25)]">
                <span className="bg-gradient-to-r from-[#390dff] to-[#00a6ff] bg-clip-text text-transparent">
                  สวัสดียามเช้า
                </span>{' '}
                <span className="text-[#1d212d]">คุณไพบูลย์</span>
              </h1>
              <p className="font-sarabun text-xl font-semibold text-[#1d212d]">
                ขอให้วันนี้เป็นวันที่ดีสำหรับคุณ 🙏
              </p>
            </div>

            {/* action buttons */}
            <div className="absolute right-6 top-6 z-10 flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/opd/medical-records')}
                className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white shadow-[0px_1px_1px_rgba(0,0,0,0.05),0px_2px_5px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90"
              >
                <UserPlusIcon className="size-5" />
                <span className="font-sarabun text-[13px] font-medium tracking-[0.26px]">
                  ลงทะเบียนผู้ป่วยใหม่
                </span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/opd/details')}
                className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white shadow-[0px_1px_1px_rgba(0,0,0,0.05),0px_2px_5px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90"
              >
                <FileDownloadIcon className="size-5" />
                <span className="font-sarabun text-[13px] font-medium tracking-[0.26px]">
                  สร้าง Visit ใหม่
                </span>
              </button>
            </div>

            {/* decorative sparkles */}
            <Sparkle className="pointer-events-none absolute left-[23%] top-[7%] size-[11px] text-[#46d96f]" />
            <Sparkle className="pointer-events-none absolute left-[62%] top-[18%] size-[26px] text-[#ff8a1e]" />
            <Sparkle className="pointer-events-none absolute left-[12%] top-[57%] size-[22px] text-[#46d96f]" />
            <Sparkle className="pointer-events-none absolute left-[91%] top-[60%] size-[29px] text-[#2f7bff]" />

            {/* decorative squiggles */}
            <img
              src={squiggleGreen}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute left-[31%] top-[116px] h-[71px] w-[68px]"
            />
            <img
              src={squiggleBlue}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute left-[77%] top-[116px] h-[61px] w-[103px]"
            />

            {/* decorative badges */}
            <HeroBadge
              className="left-[41%] top-[44px]"
              color="#c4ff92"
              label="OPD ตรวจง่าย"
              beakClassName="-bottom-[26px] -right-[6px] rotate-[135deg]"
            />
            <HeroBadge
              className="left-[60%] top-[130px]"
              color="#03b6f3"
              label="ใส่ใจผู้ป่วย"
              beakClassName="-bottom-[26px] -left-[6px] -rotate-[135deg]"
            />
          </div>

          {/* Summary stat cards — overlap the hero bottom */}
          <div className="relative z-10 -mt-[72px] flex gap-4 px-6">
            {STATS.map((s) => {
              const Icon = s.icon
              return (
              <div
                key={s.label}
                className="relative h-[100px] flex-1 cursor-pointer overflow-hidden rounded-2xl border-[0.6px] border-white px-4 py-2 transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:brightness-105"
                style={{ backgroundImage: s.gradient, boxShadow: s.shadow }}
              >
                {Icon && (
                  <Icon className="pointer-events-none absolute bottom-0 right-0 size-[75px]" />
                )}
                <div className="relative flex h-full flex-col justify-between text-white [text-shadow:0px_1px_1px_rgba(0,0,0,0.3)]">
                  <p className="font-sarabun text-xs">{s.label}</p>
                  <p className="font-sarabun text-2xl font-bold">
                    {s.value}
                    {s.unit && (
                      <span className="text-base font-semibold"> {s.unit}</span>
                    )}
                  </p>
                  <p className="truncate font-sarabun text-xs">{s.note}</p>
                </div>
              </div>
              )
            })}
          </div>

          {/* Today's queue */}
          <div className="px-6 pb-6 pt-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-sarabun text-2xl font-bold text-black">
                คิวตรวจวันนี้
              </h2>
              <div className="flex h-9 w-[441px] items-center rounded-lg border border-[#d3dfe7] bg-white">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหา"
                  className="h-full min-w-0 flex-1 rounded-l-lg bg-transparent px-3 font-sarabun text-sm text-[#2e3748] outline-none placeholder:text-[#798aa3]"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    aria-label="ล้างการค้นหา"
                    className="px-1 text-[#798aa3] transition-colors hover:text-[#1d212d]"
                  >
                    <XIcon className="size-4" />
                  </button>
                )}
                <div className="h-9 w-px bg-[#d3dfe7]" />
                <span className="flex items-center px-3 text-[#1d212d]">
                  <SearchIcon className="size-4" />
                </span>
              </div>
            </div>

            {/* table */}
            <div className="mt-6 overflow-hidden rounded-lg">
              <div className="flex items-center gap-4 border-b border-black/10 bg-[#eff9fe] px-6 py-4 font-sarabun text-xs text-black">
                <span className="w-8 shrink-0 text-center">ลำดับ</span>
                <span className="flex-1">ชื่อผู้ป่วย</span>
                <span className="flex-1">HN</span>
                <span className="flex-1">อาการสำคัญ</span>
                <span className="flex-1">แผนก</span>
                <span className="flex-1">รหัสคิว</span>
                <span className="w-16 shrink-0 text-center">เวลา</span>
              </div>
              {rows.length === 0 ? (
                <p className="px-6 py-8 text-center font-sarabun text-sm text-[#798aa3]">
                  ไม่พบผู้ป่วยที่ค้นหา
                </p>
              ) : (
                rows.map((r, index) => (
                  <button
                    key={r.no}
                    type="button"
                    onClick={() => navigate('/opd/details')}
                    style={{ animationDelay: `${0.1 + index * 0.06}s` }}
                    className="home-fade-up flex w-full items-center gap-4 border-b-[0.6px] border-[#d3dfe7] px-6 py-4 text-left font-sarabun text-sm text-black transition-colors hover:bg-[#f5fbff]"
                  >
                    <span className="w-8 shrink-0 text-center">{r.no}</span>
                    <span className="flex-1">{r.name}</span>
                    <span className="flex-1">{r.hn}</span>
                    <span className="flex-1">{r.symptom}</span>
                    <span className="flex-1">{r.dept}</span>
                    <span className="flex-1">{r.queue}</span>
                    <span className="w-16 shrink-0 text-center">{r.time}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
