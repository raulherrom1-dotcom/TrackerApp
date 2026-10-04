import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from '../components/ui/BottomNav'

export function Layout() {
  const location = useLocation()

  return (
    <>
      <main className="scroll-area flex-1 pt-[env(safe-area-inset-top)]">
        <div key={location.pathname} className="animate-page-in">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </>
  )
}
