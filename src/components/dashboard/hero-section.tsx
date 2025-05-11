import { BarChart3, BookOpen, FileText, Zap } from "lucide-react"
import Sidebar from "../global/SideBar"
import { useAuth } from "../AuthProvider"

export default function HeroSection() {
  const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth()


  // Mock user data
  const userData = {
    name: "Alex",
    stats: {
      totalHighlights: 128,
      totalNotes: 47,
      mostActiveWebsite: "docs.example.com",
      lastAiQuery: "Summarize my highlights about React hooks",
    },
  }

  return (
    <>

    <section className="space-y-6 text-white">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Welcome back, Amitesh!</h1>
        <p className="text-zinc-400">Here's an overview of your activity and recent highlights.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Highlights Card */}
        <div className="group relative overflow-hidden rounded-xl bg-zinc-800/50 p-6 backdrop-blur-sm transition-all hover:bg-zinc-800/70 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400">Total Highlights</p>
              <h3 className="mt-2 text-3xl font-bold">{userData.stats.totalHighlights}</h3>
            </div>
            <div className="rounded-full bg-violet-500/10 p-3 text-violet-500">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-violet-500 to-violet-300 opacity-70"></div>
        </div>

        {/* Total Notes Card */}
        <div className="group relative overflow-hidden rounded-xl bg-zinc-800/50 p-6 backdrop-blur-sm transition-all hover:bg-zinc-800/70 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400">Total Notes</p>
              <h3 className="mt-2 text-3xl font-bold">{userData.stats.totalNotes}</h3>
            </div>
            <div className="rounded-full bg-blue-500/10 p-3 text-blue-500">
              <FileText className="h-6 w-6" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-blue-300 opacity-70"></div>
        </div>

        {/* Most Active Website Card */}
        <div className="group relative overflow-hidden rounded-xl bg-zinc-800/50 p-6 backdrop-blur-sm transition-all hover:bg-zinc-800/70 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400">Most Active Website</p>
              <h3 className="mt-2 text-xl font-bold truncate">{userData.stats.mostActiveWebsite}</h3>
            </div>
            <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-500">
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 to-emerald-300 opacity-70"></div>
        </div>

        {/* Last AI Query Card */}
        <div className="group relative overflow-hidden rounded-xl bg-zinc-800/50 p-6 backdrop-blur-sm transition-all hover:bg-zinc-800/70 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400">Last AI Query</p>
              <h3 className="mt-2 text-sm font-medium line-clamp-2">{userData.stats.lastAiQuery}</h3>
            </div>
            <div className="rounded-full bg-amber-500/10 p-3 text-amber-500">
              <Zap className="h-6 w-6" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-amber-500 to-amber-300 opacity-70"></div>
        </div>
      </div>
    </section>
    </>
  )
}
