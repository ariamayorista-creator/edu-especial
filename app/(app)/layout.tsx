import TutorialOverlay from '@/components/TutorialOverlay'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import BottomNav from '@/components/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 pb-20 transition-colors duration-300">
        <div className="max-w-2xl mx-auto">
          {children}
        </div>
        <BottomNav />
        <TutorialOverlay />
        <Toaster />
      </div>
    </ThemeProvider>
  )
}


