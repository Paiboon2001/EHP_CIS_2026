import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import Dropdown from '../components/Dropdown.jsx'
import { logout } from '../auth.js'
import {
  UserIcon,
  ChevronDownIcon,
  UploadIcon,
  EditIcon,
  CheckIcon,
} from '../components/icons.jsx'
import idcardPhoto from '../assets/opd/idcard-photo.jpg'
import bookingPhoto from '../assets/opd/booking-photo.jpg'

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
  { label: 'อาชีพ', kind: 'select', span: 2 },
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
  'ที่ทำงาน',
]

// Sub-tabs and fields for the family/relatives section below the address card.
const RELATIVE_TABS = [
  'ข้อมูลญาติ',
  'ข้อมูลทางสังคม',
  'ประเภทบุคคล',
  'บุคคลต่างด้าว',
  'ข้อมูลการเกิด',
  'การเสียชีวิต',
  'ชื่อภาษาอังกฤษ',
  'ผู้ดูแล',
]

// Field sets for each relatives sub-tab — index matches RELATIVE_TABS.
// Only "ข้อมูลญาติ" is defined in Figma node 301:3501; the rest follow the
// same field/grid conventions for a Thai hospital CIS.
const RELATIVE_TAB_FIELDS = [
  // 0 — ข้อมูลญาติ (from Figma)
  [
    { label: 'ชื่อบิดา', kind: 'input' },
    { label: 'นามสกุลบิดา', kind: 'input' },
    { label: 'เลขบัตรประชาชน', kind: 'input' },
    { label: 'ชื่อมารดา', kind: 'input' },
    { label: 'นามสกุลมารดา', kind: 'input' },
    { label: 'เลขบัตรประชาชน', kind: 'input' },
    { label: 'ชื่อคู่สมรส', kind: 'input' },
    { label: 'นามสกุลคู่สมรส', kind: 'input' },
    { label: 'เลขบัตรประชาชน', kind: 'input' },
    { label: 'ชื่อผู้ติดต่อ', kind: 'input' },
    { label: 'นามสกุลผู้ติดต่อ', kind: 'input' },
    { label: 'ความสัมพันธ์', kind: 'select' },
  ],
  // 1 — ข้อมูลทางสังคม (from Figma node 365:669)
  [
    { label: 'สถานะครอบครัว', kind: 'select' },
    { label: 'สถานะบุคคล', kind: 'select' },
    { label: 'การศึกษา', kind: 'select' },
    { label: 'ชนิดบุคคลต่างด้าว', kind: 'select' },
    { label: 'ตำแหน่งในชุมชน', kind: 'select' },
    { label: 'ยังอยู่ในเขตรับผิดชอบ', kind: 'checkbox', defaultChecked: true },
  ],
  // 2 — ประเภทบุคคล (from Figma node 365:757)
  [
    { label: 'ประเภทบุคคล', kind: 'select' },
    { label: 'สังกัดหลัก', kind: 'input' },
    { label: 'สังกัดรอง', kind: 'input' },
    { label: 'เลขที่ข้าราชการ', kind: 'input' },
  ],
  // 3 — บุคคลต่างด้าว
  [
    { label: 'ประเทศ', kind: 'select' },
    { label: 'เลขที่หนังสือเดินทาง', kind: 'input' },
    { label: 'ประเภทวีซ่า', kind: 'select' },
    { label: 'วันที่ออกหนังสือเดินทาง', kind: 'input' },
    { label: 'วันที่หนังสือเดินทางหมดอายุ', kind: 'input' },
    { label: 'เลขที่วีซ่า', kind: 'input' },
    { label: 'วันที่เดินทางเข้าประเทศ', kind: 'input' },
    { label: 'เลขที่ใบอนุญาตทำงาน', kind: 'input' },
    { label: 'สถานะการพำนัก', kind: 'select' },
  ],
  // 4 — ข้อมูลการเกิด
  [
    { label: 'วันที่เกิด', kind: 'input' },
    { label: 'เวลาเกิด', kind: 'input' },
    { label: 'น้ำหนักแรกเกิด', kind: 'input', suffix: 'กรัม' },
    { label: 'สถานที่เกิด', kind: 'input' },
    { label: 'โรงพยาบาลที่เกิด', kind: 'input' },
    { label: 'จังหวัดที่เกิด', kind: 'select' },
    { label: 'ประเทศที่เกิด', kind: 'select' },
    { label: 'ลำดับการคลอด', kind: 'input' },
    { label: 'วิธีการคลอด', kind: 'select' },
  ],
  // 5 — การเสียชีวิต
  [
    { label: 'วันที่เสียชีวิต', kind: 'input' },
    { label: 'เวลาเสียชีวิต', kind: 'input' },
    { label: 'สถานที่เสียชีวิต', kind: 'select' },
    { label: 'สาเหตุการเสียชีวิต', kind: 'input', span: 2 },
    { label: 'เลขที่ใบมรณบัตร', kind: 'input' },
    { label: 'ผู้รับรองการเสียชีวิต', kind: 'input' },
    { label: 'ความสัมพันธ์กับผู้แจ้ง', kind: 'select' },
    { label: 'หมายเหตุ', kind: 'input', span: 3 },
  ],
  // 6 — ชื่อภาษาอังกฤษ
  [
    { label: 'Title', kind: 'select', placeholder: 'Please select' },
    { label: 'First Name', kind: 'input' },
    { label: 'Middle Name', kind: 'input' },
    { label: 'Last Name', kind: 'input' },
    { label: 'Previous Name', kind: 'input' },
    { label: 'Nickname', kind: 'input' },
  ],
  // 7 — ผู้ดูแล
  [
    { label: 'ชื่อผู้ดูแล', kind: 'input' },
    { label: 'นามสกุลผู้ดูแล', kind: 'input' },
    { label: 'เลขบัตรประชาชน', kind: 'input' },
    { label: 'ความสัมพันธ์', kind: 'select' },
    { label: 'เบอร์โทรศัพท์', kind: 'input' },
    { label: 'อาชีพผู้ดูแล', kind: 'input' },
    { label: 'ที่อยู่ผู้ดูแล', kind: 'input', span: 2 },
    { label: 'บุคคลติดต่อกรณีฉุกเฉิน', kind: 'input' },
    { label: 'เบอร์ติดต่อฉุกเฉิน', kind: 'input' },
  ],
]

// Column count per relatives sub-tab, per Figma — ข้อมูลญาติ 3-col,
// ข้อมูลทางสังคม 2-col, ประเภทบุคคล 1-col.
const RELATIVE_TAB_COLS = [3, 2, 1, 3, 3, 3, 3, 3]

/* --- mock dropdown data, shared by repeated labels --- */
const PROVINCES = [
  'กรุงเทพมหานคร',
  'นนทบุรี',
  'ปทุมธานี',
  'สมุทรปราการ',
  'เชียงใหม่',
  'เชียงราย',
  'ขอนแก่น',
  'นครราชสีมา',
  'อุดรธานี',
  'ชลบุรี',
  'ภูเก็ต',
  'สงขลา',
  'สุราษฎร์ธานี',
]
const COUNTRIES = [
  'ไทย',
  'ลาว',
  'กัมพูชา',
  'เมียนมา',
  'มาเลเซีย',
  'สิงคโปร์',
  'เวียดนาม',
  'จีน',
  'อื่นๆ',
]
const RELATIONSHIPS = [
  'บิดา',
  'มารดา',
  'คู่สมรส',
  'บุตร',
  'พี่น้อง',
  'ปู่/ย่า/ตา/ยาย',
  'ญาติ',
  'เพื่อน',
  'อื่นๆ',
]

// Option lists keyed by field label — fictional data for each topic.
const FIELD_OPTIONS = {
  // ข้อมูลทั่วไปของผู้ป่วย
  คำนำหน้า: ['เด็กชาย', 'เด็กหญิง', 'นาย', 'นางสาว', 'นาง'],
  อาชีพ: [
    'รับราชการ',
    'พนักงานรัฐวิสาหกิจ',
    'พนักงานบริษัทเอกชน',
    'ธุรกิจส่วนตัว',
    'เกษตรกร',
    'รับจ้างทั่วไป',
    'นักเรียน/นักศึกษา',
    'แม่บ้าน',
    'ว่างงาน',
  ],
  เชื้อชาติ: ['ไทย', 'จีน', 'ลาว', 'เขมร', 'พม่า', 'มลายู', 'อื่นๆ'],
  สัญชาติ: ['ไทย', 'ลาว', 'กัมพูชา', 'เมียนมา', 'มาเลเซีย', 'จีน', 'อื่นๆ'],
  ศาสนา: [
    'พุทธ',
    'อิสลาม',
    'คริสต์',
    'ฮินดู',
    'ซิกข์',
    'ไม่นับถือศาสนา',
    'อื่นๆ',
  ],
  จำนวนพี่น้อง: ['1 คน', '2 คน', '3 คน', '4 คน', '5 คน', 'มากกว่า 5 คน'],
  หมู่เลือด: ['A', 'B', 'AB', 'O'],
  Rh: ['Rh+', 'Rh-'],
  สถานะภาพ: ['โสด', 'สมรส', 'หม้าย', 'หย่าร้าง', 'แยกกันอยู่'],
  ความสัมพันธ์: RELATIONSHIPS,
  // ที่อยู่ปัจจุบัน
  ประเทศ: COUNTRIES,
  รหัสไปรษณีย์: [
    '10110',
    '10120',
    '10200',
    '10310',
    '10400',
    '10500',
    '10600',
    '10900',
  ],
  จังหวัด: PROVINCES,
  อำเภอ: [
    'เมือง',
    'บางกะปิ',
    'ห้วยขวาง',
    'จตุจักร',
    'ดินแดง',
    'พระโขนง',
    'บางนา',
    'ลาดพร้าว',
  ],
  ตำบล: [
    'ในเมือง',
    'คลองตัน',
    'สามเสนนอก',
    'จอมพล',
    'ดินแดง',
    'บางจาก',
    'บางนา',
    'จระเข้บัว',
  ],
  // ข้อมูลทางสังคม
  สถานะครอบครัว: [
    'อยู่ด้วยกันพร้อมหน้า',
    'แยกกันอยู่',
    'หย่าร้าง',
    'บิดา/มารดาเสียชีวิต',
    'อื่นๆ',
  ],
  สถานะบุคคล: [
    'ปกติ',
    'ผู้พิการ',
    'ผู้สูงอายุ',
    'ผู้ป่วยติดเตียง',
    'เด็กกำพร้า',
    'อื่นๆ',
  ],
  การศึกษา: [
    'ไม่ได้รับการศึกษา',
    'ประถมศึกษา',
    'มัธยมศึกษาตอนต้น',
    'มัธยมศึกษาตอนปลาย/ปวช.',
    'อนุปริญญา/ปวส.',
    'ปริญญาตรี',
    'สูงกว่าปริญญาตรี',
  ],
  ชนิดบุคคลต่างด้าว: [
    'แรงงานต่างด้าว',
    'นักท่องเที่ยว',
    'ผู้ลี้ภัย',
    'ผู้ติดตาม',
    'นักเรียน/นักศึกษา',
    'อื่นๆ',
  ],
  ตำแหน่งในชุมชน: [
    'ประชาชนทั่วไป',
    'ผู้ใหญ่บ้าน',
    'กำนัน',
    'อสม.',
    'สมาชิก อบต.',
    'ผู้นำชุมชน',
    'อื่นๆ',
  ],
  // ประเภทบุคคล
  ประเภทบุคคล: [
    'ข้าราชการ',
    'พนักงานรัฐวิสาหกิจ',
    'พนักงานเอกชน',
    'ประชาชนทั่วไป',
    'พระภิกษุ/นักบวช',
    'นักเรียน/นักศึกษา',
  ],
  // บุคคลต่างด้าว
  ประเภทวีซ่า: [
    'Tourist Visa',
    'Non-Immigrant Visa',
    'Work Permit Visa',
    'Education Visa',
    'Retirement Visa',
    'Diplomatic Visa',
  ],
  สถานะการพำนัก: [
    'พำนักชั่วคราว',
    'พำนักถาวร',
    'อยู่ระหว่างขออยู่ต่อ',
    'เกินกำหนดพำนัก',
    'อื่นๆ',
  ],
  // ข้อมูลการเกิด
  จังหวัดที่เกิด: PROVINCES,
  ประเทศที่เกิด: COUNTRIES,
  วิธีการคลอด: [
    'คลอดธรรมชาติ',
    'ผ่าตัดคลอด',
    'ใช้เครื่องดูดสุญญากาศ',
    'ใช้คีมช่วยคลอด',
    'อื่นๆ',
  ],
  // การเสียชีวิต
  สถานที่เสียชีวิต: [
    'โรงพยาบาล',
    'บ้าน',
    'ระหว่างนำส่งโรงพยาบาล',
    'สถานที่สาธารณะ',
    'อื่นๆ',
  ],
  ความสัมพันธ์กับผู้แจ้ง: RELATIONSHIPS,
  // ชื่อภาษาอังกฤษ
  Title: ['Master', 'Miss', 'Mr.', 'Ms.', 'Mrs.'],
}

/* --- small page-specific icons --- */
function SaveIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8M7 3v5h8" />
    </svg>
  )
}
function ChevronLeftIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}
function TasksIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="15" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="4.5" />
      <path d="m7.5 12 3 3 6-6.5" />
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
function HelpCircleIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 0 1 4.85.83c0 1.67-2.35 2.5-2.35 2.5" />
      <path d="M12 16.5h.01" />
    </svg>
  )
}
function FingerprintIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 14 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6.74625 1.8375C8.07125 1.8375 9.32125 2.12187 10.4963 2.69062C11.6713 3.25938 12.6525 4.08125 13.44 5.15625C13.5275 5.26875 13.5556 5.36875 13.5244 5.45625C13.4931 5.54375 13.44 5.61875 13.365 5.68125C13.29 5.74375 13.2025 5.77187 13.1025 5.76562C13.0025 5.75938 12.915 5.70625 12.84 5.60625C12.1525 4.63125 11.2681 3.88437 10.1869 3.36562C9.10563 2.84687 7.95875 2.5875 6.74625 2.5875C5.53375 2.5875 4.39625 2.84687 3.33375 3.36562C2.27125 3.88437 1.39 4.63125 0.69 5.60625C0.615 5.71875 0.5275 5.78125 0.4275 5.79375C0.3275 5.80625 0.24 5.78125 0.165 5.71875C0.0775 5.65625 0.024375 5.57812 0.005625 5.48438C-0.013125 5.39062 0.015 5.29375 0.09 5.19375C0.865 4.13125 1.83687 3.30625 3.00563 2.71875C4.17438 2.13125 5.42125 1.8375 6.74625 1.8375ZM6.74625 3.6C8.43375 3.6 9.88375 4.1625 11.0962 5.2875C12.3087 6.4125 12.915 7.80625 12.915 9.46875C12.915 10.0938 12.6931 10.6156 12.2494 11.0344C11.8056 11.4531 11.265 11.6625 10.6275 11.6625C9.99 11.6625 9.44312 11.4531 8.98687 11.0344C8.53062 10.6156 8.3025 10.0938 8.3025 9.46875C8.3025 9.05625 8.14937 8.70938 7.84312 8.42813C7.53687 8.14688 7.17125 8.00625 6.74625 8.00625C6.32125 8.00625 5.95563 8.14688 5.64937 8.42813C5.34312 8.70938 5.19 9.05625 5.19 9.46875C5.19 10.6812 5.54938 11.6938 6.26813 12.5063C6.98688 13.3188 7.915 13.8875 9.0525 14.2125C9.165 14.25 9.24 14.3125 9.2775 14.4C9.315 14.4875 9.32125 14.5812 9.29625 14.6812C9.27125 14.7687 9.22125 14.8438 9.14625 14.9062C9.07125 14.9688 8.9775 14.9875 8.865 14.9625C7.565 14.6375 6.5025 13.9906 5.6775 13.0219C4.8525 12.0531 4.44 10.8687 4.44 9.46875C4.44 8.84375 4.665 8.31875 5.115 7.89375C5.565 7.46875 6.10875 7.25625 6.74625 7.25625C7.38375 7.25625 7.9275 7.46875 8.3775 7.89375C8.8275 8.31875 9.0525 8.84375 9.0525 9.46875C9.0525 9.88125 9.20875 10.2281 9.52125 10.5094C9.83375 10.7906 10.2025 10.9312 10.6275 10.9312C11.0525 10.9312 11.415 10.7906 11.715 10.5094C12.015 10.2281 12.165 9.88125 12.165 9.46875C12.165 8.01875 11.6337 6.8 10.5712 5.8125C9.50875 4.825 8.24 4.33125 6.765 4.33125C5.29 4.33125 4.02125 4.825 2.95875 5.8125C1.89625 6.8 1.365 8.0125 1.365 9.45C1.365 9.75 1.39313 10.125 1.44938 10.575C1.50563 11.025 1.64 11.55 1.8525 12.15C1.89 12.2625 1.88688 12.3625 1.84312 12.45C1.79937 12.5375 1.7275 12.6 1.6275 12.6375C1.5275 12.675 1.43062 12.6719 1.33687 12.6281C1.24312 12.5844 1.1775 12.5125 1.14 12.4125C0.9525 11.925 0.818125 11.4406 0.736875 10.9594C0.655625 10.4781 0.615 9.98125 0.615 9.46875C0.615 7.80625 1.21813 6.4125 2.42438 5.2875C3.63063 4.1625 5.07125 3.6 6.74625 3.6ZM6.74625 0C7.54625 0 8.3275 0.096875 9.09 0.290625C9.8525 0.484375 10.59 0.7625 11.3025 1.125C11.415 1.1875 11.4806 1.2625 11.4994 1.35C11.5181 1.4375 11.5087 1.525 11.4712 1.6125C11.4337 1.7 11.3712 1.76875 11.2837 1.81875C11.1962 1.86875 11.09 1.8625 10.965 1.8C10.3025 1.4625 9.61812 1.20312 8.91187 1.02188C8.20562 0.840625 7.48375 0.75 6.74625 0.75C6.02125 0.75 5.30875 0.834375 4.60875 1.00312C3.90875 1.17188 3.24 1.4375 2.6025 1.8C2.5025 1.8625 2.4025 1.87812 2.3025 1.84687C2.2025 1.81562 2.1275 1.75 2.0775 1.65C2.0275 1.55 2.015 1.45937 2.04 1.37812C2.065 1.29688 2.1275 1.225 2.2275 1.1625C2.9275 0.7875 3.65875 0.5 4.42125 0.3C5.18375 0.1 5.95875 0 6.74625 0ZM6.74625 5.41875C7.90875 5.41875 8.90875 5.80937 9.74625 6.59062C10.5837 7.37187 11.0025 8.33125 11.0025 9.46875C11.0025 9.58125 10.9681 9.67188 10.8994 9.74063C10.8306 9.80938 10.74 9.84375 10.6275 9.84375C10.5275 9.84375 10.44 9.80938 10.365 9.74063C10.29 9.67188 10.2525 9.58125 10.2525 9.46875C10.2525 8.53125 9.90563 7.74687 9.21187 7.11562C8.51812 6.48438 7.69625 6.16875 6.74625 6.16875C5.79625 6.16875 4.98063 6.48438 4.29938 7.11562C3.61812 7.74687 3.2775 8.53125 3.2775 9.46875C3.2775 10.4812 3.4525 11.3406 3.8025 12.0469C4.1525 12.7531 4.665 13.4625 5.34 14.175C5.415 14.25 5.4525 14.3375 5.4525 14.4375C5.4525 14.5375 5.415 14.625 5.34 14.7C5.265 14.775 5.1775 14.8125 5.0775 14.8125C4.9775 14.8125 4.89 14.775 4.815 14.7C4.0775 13.925 3.51187 13.1344 3.11812 12.3281C2.72438 11.5219 2.5275 10.5688 2.5275 9.46875C2.5275 8.33125 2.94 7.37187 3.765 6.59062C4.59 5.80937 5.58375 5.41875 6.74625 5.41875ZM6.7275 9.09375C6.84 9.09375 6.93062 9.13125 6.99937 9.20625C7.06812 9.28125 7.1025 9.36875 7.1025 9.46875C7.1025 10.4062 7.44 11.175 8.115 11.775C8.79 12.375 9.5775 12.675 10.4775 12.675C10.5525 12.675 10.6588 12.6687 10.7963 12.6562C10.9338 12.6438 11.0775 12.625 11.2275 12.6C11.34 12.575 11.4369 12.5906 11.5181 12.6469C11.5994 12.7031 11.6525 12.7875 11.6775 12.9C11.7025 13 11.6838 13.0875 11.6213 13.1625C11.5588 13.2375 11.4775 13.2875 11.3775 13.3125C11.1525 13.375 10.9556 13.4094 10.7869 13.4156C10.6181 13.4219 10.515 13.425 10.4775 13.425C9.365 13.425 8.39937 13.05 7.58063 12.3C6.76188 11.55 6.3525 10.6062 6.3525 9.46875C6.3525 9.36875 6.38688 9.28125 6.45563 9.20625C6.52437 9.13125 6.615 9.09375 6.7275 9.09375Z" />
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

/* --- header checkbox (custom-styled, Figma controls/tint #0d6fff) --- */
function HeaderCheckbox({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-[3px]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={`flex size-4 items-center justify-center rounded-[5.5px] border transition-colors ${
          checked
            ? 'border-[#0d6fff] bg-[#0d6fff] text-white'
            : 'border-[#c4d3e0] bg-white text-transparent'
        }`}
      >
        <CheckIcon className="size-[10px]" />
      </span>
      <span className="font-sarabun text-[13px] leading-4 text-[#1a1a1a]">
        {label}
      </span>
    </label>
  )
}

/* --- checkbox form field (bottom-aligned to match input rows) --- */
function CheckboxField({ field }) {
  const [checked, setChecked] = useState(field.defaultChecked ?? false)
  return (
    <div className="flex h-[60px] flex-col justify-end">
      <div className="flex h-10 items-center">
        <HeaderCheckbox
          checked={checked}
          onChange={() => setChecked((v) => !v)}
          label={field.label}
        />
      </div>
    </div>
  )
}

/* --- form field --- */
function Field({ field }) {
  if (field.kind === 'checkbox') return <CheckboxField field={field} />
  const span =
    field.span === 3
      ? 'col-span-2 md:col-span-3'
      : field.span === 2
        ? 'col-span-2 md:col-span-2'
        : ''
  return (
    <div className={`flex h-[60px] flex-col justify-between ${span}`}>
      <label className="font-sarabun text-xs text-[#798aa3]">
        {field.label}
        {field.req && <span className="text-red-500"> *</span>}
      </label>
      {field.kind === 'select' ? (
        <Dropdown
          options={field.options || FIELD_OPTIONS[field.label] || []}
          placeholder={field.placeholder || 'กรุณาเลือก'}
        />
      ) : (
        <div className="flex h-10 items-center gap-2 rounded-lg border border-[#d3dfe7] bg-white px-3 focus-within:border-[#9ec9e8]">
          <input
            type="text"
            className="w-full bg-transparent font-sarabun text-sm text-[#191c1e] outline-none"
          />
          {field.suffix && (
            <span className="shrink-0 font-sarabun text-sm text-[#798aa3]">
              {field.suffix}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

function SectionCard({ icon, title, children, cols = 4 }) {
  return (
    <div className="shrink-0 overflow-hidden rounded-xl bg-white shadow-[0px_1px_4px_0px_rgba(0,122,255,0.15)]">
      <div className="flex items-center gap-2 border-b border-[#e9f6ff] bg-gradient-to-b from-[#e9f6ff] to-white px-4 pb-[13px] pt-3 shadow-[inset_0px_4px_7px_0px_#c9f1ff]">
        <span className="text-[#1a8cff]">{icon}</span>
        <h3 className="font-sarabun text-base font-semibold leading-6 text-[#191c1e]">
          {title}
        </h3>
      </div>
      <div
        className={`grid gap-x-4 gap-y-3 p-4 ${
          cols === 3
            ? 'grid-cols-2 md:grid-cols-3'
            : 'grid-cols-2 md:grid-cols-4'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

/* --- family/relatives card with its own sub-tab bar --- */
function RelativesSection() {
  const [tab, setTab] = useState(0)
  return (
    <div className="shrink-0 overflow-hidden rounded-xl bg-white shadow-[0px_1px_4px_0px_rgba(0,122,255,0.15)]">
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#e9f0f4] p-2">
        {RELATIVE_TABS.map((t, i) => {
          const active = tab === i
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(i)}
              className={`flex shrink-0 items-center gap-1 rounded-md px-2 py-1 font-sarabun text-sm font-semibold tracking-[-0.154px] transition-colors ${
                active
                  ? 'border border-[#79d5ff] bg-gradient-to-t from-[#0d6fff] to-[#00a6ff] text-white'
                  : 'bg-[#e9f0f4] text-[#687a8f] hover:bg-[#dfe8ef]'
              }`}
            >
              <SaveIcon className="size-4" />
              {t}
            </button>
          )
        })}
      </div>
      <div
        className={`grid gap-x-4 gap-y-3 p-4 ${
          { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-2 md:grid-cols-3' }[
            RELATIVE_TAB_COLS[tab]
          ]
        }`}
      >
        {RELATIVE_TAB_FIELDS[tab].map((field, i) => (
          <Field key={`${tab}-${i}`} field={field} />
        ))}
      </div>
    </div>
  )
}

/* --- media card with blurred photo background (ID reader / booking) --- */
function MediaActionCard({ image, title, subtitle }) {
  return (
    <button
      type="button"
      className="relative min-h-[88px] flex-1 overflow-hidden rounded-xl p-3 text-left shadow-[0px_1px_7px_0px_rgba(0,122,255,0.15)]"
      style={{
        backgroundImage: 'linear-gradient(130deg, #2e9ae2 32.8%, #97d0f6 100%)',
      }}
    >
      {/* blurred photo + dark gradient, scoped to a 207×138 box as in Figma */}
      <div className="pointer-events-none absolute left-1/2 top-[calc(50%+6.5px)] h-[138px] w-[207px] -translate-x-1/2 -translate-y-1/2 blur-[5px]">
        <img src={image} alt="" className="absolute inset-0 size-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(151deg, rgba(0,0,0,0.5) 6%, rgba(102,102,102,0) 78%)',
          }}
        />
      </div>
      <div className="relative flex flex-col">
        <span className="font-sarabun text-sm font-semibold leading-[18px] tracking-[0.26px] text-white">
          {title}
        </span>
        <span className="font-sarabun text-[10px] leading-[18px] tracking-[0.26px] text-white">
          {subtitle}
        </span>
      </div>
    </button>
  )
}

/* --- camera capture modal (getUserMedia) --- */
function CameraModal({ onCapture, onClose }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'user' } })
      .then((stream) => {
        if (!active) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
      })
      .catch(() =>
        setError('ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการใช้งานกล้อง'),
      )
    return () => {
      active = false
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  function capture() {
    const video = videoRef.current
    if (!video || !video.videoWidth) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    onCapture(canvas.toDataURL('image/jpeg', 0.92))
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4"
      onMouseDown={onClose}
    >
      <div
        className="flex w-full max-w-[420px] flex-col gap-3 rounded-2xl bg-white p-4"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h3 className="font-sarabun text-base font-semibold text-[#191c1e]">
          ถ่ายรูปผู้ป่วย
        </h3>
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black">
          {error ? (
            <div className="flex size-full items-center justify-center px-6 text-center font-sarabun text-sm text-white">
              {error}
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="size-full object-cover"
            />
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 flex-1 rounded-lg border border-[#c5d3dc] bg-white font-sarabun text-sm font-medium text-[#191c1e] transition-colors hover:bg-[#f5f8fa]"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={capture}
            disabled={!!error}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-black font-sarabun text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <CameraIcon className="size-4" /> ถ่ายรูป
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

/* --- left media column --- */
function MediaColumn() {
  const [photo, setPhoto] = useState(null)
  const [fingerprint, setFingerprint] = useState(null)
  const [cameraOpen, setCameraOpen] = useState(false)
  const photoInputRef = useRef(null)
  const fingerprintInputRef = useRef(null)

  function readImage(e, setter) {
    const file = e.target.files?.[0]
    if (file) setter(URL.createObjectURL(file))
    e.target.value = '' // allow re-selecting the same file
  }

  return (
    <aside className="flex w-[200px] shrink-0 flex-col gap-3 pb-4">
      {/* Patient photo */}
      <div className="flex shrink-0 flex-col gap-3 rounded-xl bg-white p-3 shadow-[0px_1px_7px_0px_rgba(0,122,255,0.15)]">
        <div
          className={`flex h-[170px] flex-col items-center justify-center gap-1 overflow-hidden rounded-lg ${
            photo
              ? 'border border-[#c5d3dc]'
              : 'border border-dashed border-[#687a8f] bg-gradient-to-b from-[#fafafa] to-[#e9f0f4]'
          }`}
        >
          {photo ? (
            <img
              src={photo}
              alt="รูปภาพผู้ป่วย"
              className="size-full object-cover"
            />
          ) : (
            <>
              <UserIcon className="size-[33px] text-[#9aa7b8]" />
              <p className="font-sarabun text-[13px] font-semibold tracking-[0.26px] text-[#434652]">
                รูปภาพผู้ป่วย
              </p>
              <p className="font-sarabun text-[10px] leading-[15px] text-[#434652] opacity-70">
                JPG, PNG up to 5MB
              </p>
            </>
          )}
        </div>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => readImage(e, setPhoto)}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="flex h-[30px] flex-1 items-center justify-center gap-2 rounded-lg bg-black font-sarabun text-[13px] font-medium tracking-[0.26px] text-white transition-opacity hover:opacity-90"
          >
            <UploadIcon className="size-[11px]" /> อัปโหลด
          </button>
          <button
            type="button"
            onClick={() => setCameraOpen(true)}
            className="flex h-[30px] flex-1 items-center justify-center gap-2 rounded-lg border border-[#c5d3dc] bg-white font-sarabun text-[13px] font-medium tracking-[0.26px] text-[#191c1e] transition-colors hover:bg-[#f5f8fa]"
          >
            <CameraIcon className="size-4" /> ถ่ายรูป
          </button>
        </div>
      </div>

      {/* Fingerprint */}
      <div className="flex shrink-0 flex-col gap-3 rounded-xl bg-white p-3 shadow-[0px_1px_7px_0px_rgba(0,122,255,0.15)]">
        <div className="flex items-center gap-2">
          <FingerprintIcon className="h-[15px] w-[14px] text-[#0d6fff]" />
          <h3 className="font-sarabun text-[13px] font-semibold tracking-[0.26px] text-[#191c1e]">
            ลายนิ้วมือ
          </h3>
        </div>
        <div className="flex h-24 items-center justify-center overflow-hidden rounded-lg border border-[#c5d3dc] bg-white">
          {fingerprint ? (
            <img
              src={fingerprint}
              alt="ลายนิ้วมือ"
              className="size-full object-contain"
            />
          ) : (
            <p className="font-sarabun text-[11px] italic leading-[16.5px] text-[#737783]">
              ไม่มีการบันทึกลายนิ้วมือ
            </p>
          )}
        </div>
        <input
          ref={fingerprintInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => readImage(e, setFingerprint)}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fingerprintInputRef.current?.click()}
            className="flex h-[30px] flex-1 items-center justify-center gap-2 rounded-lg bg-black font-sarabun text-[13px] font-medium tracking-[0.26px] text-white transition-opacity hover:opacity-90"
          >
            <UploadIcon className="size-[11px]" /> อัปโหลด
          </button>
          <button
            type="button"
            onClick={() => fingerprintInputRef.current?.click()}
            className="flex h-[30px] flex-1 items-center justify-center gap-2 rounded-lg border border-[#c5d3dc] bg-white font-sarabun text-[13px] font-medium tracking-[0.26px] text-[#191c1e] transition-colors hover:bg-[#f5f8fa]"
          >
            <EditIcon className="size-4" /> แก้ไข
          </button>
        </div>
      </div>

      {/* ID card reader */}
      <MediaActionCard
        image={idcardPhoto}
        title="อ่านบัตรประชาชน"
        subtitle="นำบัตรประชาใส่เครื่อง"
      />

      {/* Online booking */}
      <MediaActionCard
        image={bookingPhoto}
        title="จองนัดหมายออนไลน์"
        subtitle="เลือกผู้ป่วยสำหรับการจอง"
      />

      {cameraOpen && (
        <CameraModal
          onCapture={(dataUrl) => {
            setPhoto(dataUrl)
            setCameraOpen(false)
          }}
          onClose={() => setCameraOpen(false)}
        />
      )}
    </aside>
  )
}

/* --- right "other info" panel --- */
function OtherInfoCheck({ title, sub }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-[#d3dfe7] p-[9px]">
      <input
        type="checkbox"
        className="mt-0.5 size-[14px] shrink-0 rounded-[4px] border border-[#6b7280] accent-[#0d6fff]"
      />
      <span className="flex flex-col gap-1.5">
        <span className="font-sarabun text-xs font-semibold leading-[15px] text-[#191c1e]">
          {title}
        </span>
        <span className="font-sarabun text-[10px] leading-[10px] text-[#798aa3]">
          {sub}
        </span>
      </span>
    </label>
  )
}

function RightPanel() {
  return (
    <aside className="flex w-[200px] shrink-0 flex-col overflow-hidden rounded-xl bg-white shadow-[0px_1px_7px_0px_rgba(0,122,255,0.15)]">
      <div className="flex shrink-0 items-center gap-2 border-b border-[#e9f6ff] px-4 pb-[13px] pt-3">
        <HelpCircleIcon className="size-5 text-[#1a8cff]" />
        <h3 className="font-sarabun text-base font-semibold leading-6 text-[#191c1e]">
          ข้อมูลอื่นๆ
        </h3>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
        <OtherInfoCheck
          title="Area Responsibility"
          sub="อยู่ในเขตความรับผิดชอบ"
        />
        <OtherInfoCheck title="Legal Case Patient" sub="ผู้ป่วยคดีความ" />
        {OTHER_FIELDS.map((label) => (
          <div key={label} className="flex flex-col gap-2">
            <label className="font-sarabun text-xs text-[#798aa3]">
              {label}
            </label>
            <input
              type="text"
              className="h-10 w-full rounded-lg border border-[#d3dfe7] bg-white px-3 font-sarabun text-sm text-[#191c1e] outline-none focus:border-[#9ec9e8]"
            />
          </div>
        ))}
      </div>
    </aside>
  )
}

/* --- header "Tasks" dropdown menu (Figma node 374:608) --- */
const TASKS_ITEMS = [
  'พิมพ์เอกสาร',
  'ลบข้อมูลเวชระเบียน',
  'รวมข้อมูลเวชระเบียน',
  'Reset',
  'Mobile QR Code',
  'ส่งตรวจอุบัติเหตุ',
]

function TasksMenu() {
  const [open, setOpen] = useState(false)
  const [rect, setRect] = useState(null)
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return
    if (btnRef.current) setRect(btnRef.current.getBoundingClientRect())
    function onScroll(e) {
      if (menuRef.current && menuRef.current.contains(e.target)) return
      setOpen(false)
    }
    function onPointerDown(e) {
      if (
        btnRef.current?.contains(e.target) ||
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
  }, [open])

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-10 shrink-0 items-center gap-2 rounded-lg border bg-[#e9f0f4] px-4 py-2.5 text-[#57657a] transition-colors ${
          open ? 'border-[#0d6fff]' : 'border-transparent hover:bg-[#dfe8ef]'
        }`}
      >
        <TasksIcon className="size-4" />
        <span className="text-base leading-6">Tasks</span>
        <ChevronDownIcon
          className={`size-3 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open &&
        rect &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-50 flex w-[191px] flex-col rounded-xl bg-white p-2 shadow-[0px_0px_1px_0px_rgba(29,33,45,0.2),0px_1px_4px_0px_rgba(29,33,45,0.15),0px_16px_32px_0px_rgba(29,33,45,0.1)]"
            style={{ top: rect.bottom + 8, right: window.innerWidth - rect.right }}
          >
            {TASKS_ITEMS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setOpen(false)}
                className="flex w-full items-center rounded px-2 py-1 text-left font-sarabun text-sm leading-6 tracking-[-0.084px] text-[#1d212d] transition-colors hover:bg-[#eff9fe] hover:text-[#0485f7]"
              >
                {item}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  )
}

export default function OpdDetails() {
  const navigate = useNavigate()
  const [openVisit, setOpenVisit] = useState(true)
  const [newHn, setNewHn] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#eef5fa]">
      <Sidebar onLogout={handleLogout} />

      <main className="flex h-screen flex-1 flex-col overflow-hidden">
        {/* HN top bar */}
        <header className="flex shrink-0 items-start gap-6 border-b border-[#e9f0f4] bg-white px-6 py-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="ย้อนกลับ"
            className="flex size-6 shrink-0 items-center justify-center rounded-md border border-[#e9f0f4] text-[#1d212d] transition-colors hover:bg-[#f5f8fa]"
          >
            <ChevronLeftIcon className="size-4" />
          </button>

          <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
            <h2 className="font-sarabun text-xl font-bold leading-[18px] tracking-[0.26px] text-black">
              HN : 09988764568
            </h2>
            <div className="flex items-start gap-4">
              <HeaderCheckbox
                checked={openVisit}
                onChange={() => setOpenVisit((v) => !v)}
                label="เปิด Visit หลังจากบันทึก"
              />
              <HeaderCheckbox
                checked={newHn}
                onChange={() => setNewHn((v) => !v)}
                label="กำหนดเลข HN ใหม่"
              />
            </div>
          </div>

          <TasksMenu />

          <button
            type="button"
            onClick={() => navigate('/opd/medical-records')}
            className="flex shrink-0 items-center gap-2 rounded-lg border-[0.5px] border-[#242424] bg-gradient-to-t from-black to-[#666] px-4 py-2 text-white shadow-[inset_0px_4px_3px_0px_rgba(110,110,110,0.44)] transition-opacity hover:opacity-95"
          >
            <SaveIcon className="size-5" />
            <span className="font-sarabun text-base font-semibold tracking-[-0.176px]">
              บันทึก
            </span>
          </button>
        </header>

        {/* Tabs */}
        <div className="shrink-0 px-4 pt-4">
          <div className="flex items-center gap-2 overflow-x-auto rounded-lg border border-[#e9f0f4] bg-white p-2">
            {TABS.map((tab, i) => {
              const active = activeTab === i
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(i)}
                  className={`flex shrink-0 items-center gap-1 rounded-md px-2 py-1 font-sarabun text-sm font-semibold tracking-[-0.154px] transition-colors ${
                    active
                      ? 'border border-[#79d5ff] bg-gradient-to-t from-[#0d6fff] to-[#00a6ff] text-white'
                      : 'bg-[#e9f0f4] text-[#687a8f] hover:bg-[#dfe8ef]'
                  }`}
                >
                  <SaveIcon className="size-4" />
                  {tab}
                </button>
              )
            })}
          </div>
        </div>

        {/* Body — only the middle column scrolls; side columns stay fixed */}
        <div className="flex flex-1 gap-4 overflow-hidden p-4">
          <MediaColumn />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-y-auto">
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

            <RelativesSection />
          </div>

          <RightPanel />
        </div>
      </main>
    </div>
  )
}
