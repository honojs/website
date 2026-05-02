import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen bg-background'>
      <Sidebar className='hidden md:flex' />
      <div className='flex flex-1 flex-col'>
        <Navbar />
        <main className='flex-1 p-4 pb-20 md:p-6 md:pb-6'>
          {children}
        </main>
        <MobileNav className='fixed bottom-0 left-0 right-0 z-30 md:hidden' />
      </div>
    </div>
  )
}
