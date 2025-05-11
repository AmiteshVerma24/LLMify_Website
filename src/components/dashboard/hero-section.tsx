"use client"
import { BarChart3, BookOpen, FileText, Zap } from "lucide-react"
import { useAuth } from "../AuthProvider"
import { useEffect, useState } from "react"
import userActivityService from "@/services/userActivityService"

export default function HeroSection() {
  const { user, isLoading: isUserLoading } = useAuth()
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return
      
      try {
        setIsLoading(true)
        const response = await userActivityService.stats()
        if (response.success) {
          setStats(response.stats)
        } else {
          setError("Failed to fetch stats")
        }
      } catch (err) {
        setError("Error loading statistics")
        console.error("Error fetching stats:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [user])

  // Handle loading state
  if (isUserLoading || (isLoading && !stats)) {
    return (
      <section className="space-y-6 text-white">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Loading your dashboard...</h1>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-32 rounded-xl bg-zinc-800/30 animate-pulse"></div>
          ))}
        </div>
      </section>
    )
  }

  // Handle error state
  if (error) {
    return (
      <section className="space-y-6 text-white">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Welcome back, {user?.name}!</h1>
          <p className="text-red-400">Unable to load your dashboard data. Please try again later.</p>
        </div>
      </section>
    )
  }

  // Default fallback data in case API returns incomplete data
  const safeStats = stats || {
    totalHighlights: 0,
    totalNotes: 0,
    mostActiveSite: { url: "No data available" },
    recentActivity: 0
  }

  // Get last query from localStorage as it's not in the API response
  const lastAiQuery = localStorage.getItem("lastAiQuery") || "No recent queries"

  return (
    <section className="space-y-6 text-white">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Welcome back, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-zinc-400">Here's an overview of your activity and recent highlights.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Highlights Card */}
        <div className="group relative overflow-hidden rounded-xl bg-zinc-800/50 p-6 backdrop-blur-sm transition-all hover:bg-zinc-800/70 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400">Total Highlights</p>
              <h3 className="mt-2 text-3xl font-bold">{safeStats.totalHighlights}</h3>
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
              <h3 className="mt-2 text-3xl font-bold">{safeStats.totalNotes}</h3>
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
              <h3 className="mt-2 text-xl font-bold truncate">
                {safeStats.mostActiveSite?.url?.replace(/(^\w+:|^)\/\//, "").split("/")[0] || "No data"}
              </h3>
            </div>
            <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-500">
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 to-emerald-300 opacity-70"></div>
        </div>

        {/* Recent Activity Card (replacing Last AI Query with Recent Activity from API) */}
        <div className="group relative overflow-hidden rounded-xl bg-zinc-800/50 p-6 backdrop-blur-sm transition-all hover:bg-zinc-800/70 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400">Last AI Query</p>
              <h3 className="mt-2 text-xl font-bold truncate">
                {lastAiQuery || "No recent queries"}
              </h3>
            </div>
            <div className="rounded-full bg-amber-500/10 p-3 text-amber-500">
              <Zap className="h-6 w-6" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-amber-500 to-amber-300 opacity-70"></div>
        </div>
      </div>
    </section>
  )
}