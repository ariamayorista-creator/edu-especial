import BottomNav from '@/components/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <div className="max-w-2xl mx-auto">
        {children}
      </div>
      <BottomNav />
    </div>
  )
}
