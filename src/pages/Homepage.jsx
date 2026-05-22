import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { logout } from '../auth.js'
import homepageHero from '../assets/homepage-hero.png'

export default function Homepage() {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen w-full bg-[#f5fbff]">
      <Sidebar onLogout={handleLogout} />

      <main className="flex flex-1 items-center justify-center overflow-hidden p-4 bg-[radial-gradient(47%_47%_at_50%_50%,#79ddff_0%,rgba(121,221,255,0.9)_20%,rgba(183,236,255,0.95)_47%,#f5fbff_75%)]">
        <img
          src={homepageHero}
          alt="EHP Web Application terms and conditions of use"
          className="max-h-[510px] w-auto max-w-[782px] object-contain"
        />
      </main>
    </div>
  )
}
