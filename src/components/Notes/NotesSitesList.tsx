"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Calendar, FileText, ExternalLink, ArrowUpRight, Filter, SortAsc, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import notesService from "@/services/notesService"
import { useAuth } from "@/components/AuthProvider"

interface Website {
  url: string
  href: string
  title: string
  logo: string
  description: string
  notes_count: number  
  last_updated: string 
}

export default function NotesSitesList() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [filterBy, setFilterBy] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [websites, setWebsites] = useState<Website[]>([])
  const { user, isLoading: isUserLoading } = useAuth()

  useEffect(() => {
    const fetchUserNotes = async () => {
      if (!user || isUserLoading) return
      
      try {
        setIsLoading(true)
        setError(null)
        const response = await notesService.getNotes()
        
        if (response && Array.isArray(response.notes)) {
          setWebsites(response.notes)
        } else if (response && response.notes === undefined) {
          console.log("Response might be array directly:", response)
          if (Array.isArray(response)) {
            setWebsites(response)
          } else {
            setError("Unexpected response structure")
            setWebsites([])
          }
        } else {
          console.log("Response structure:", response)
          setError("No notes found")
          setWebsites([])
        }
      } catch (err: any) {
        console.error("Error fetching notes:", err)
        console.error("Error response:", err.response)
        if (err.response?.status === 404) {
          console.log("404 - No notes found, setting empty array")
          setError("No notes found")
          setWebsites([])
        } else {
          setError("Error loading notes: " + (err.message || "Unknown error"))
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    if (!isUserLoading) {
      fetchUserNotes()
    }
  }, [user, isUserLoading])

  // Filter websites based on search query
  const filteredWebsites = websites.filter(
    (website) =>
      website.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sort websites based on sort option
  const sortedWebsites = [...filteredWebsites].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
    } else if (sortBy === "notes") {
      return b.notes_count - a.notes_count
    } else if (sortBy === "alphabetical") {
      return a.title.localeCompare(b.title)
    }
    return 0
  })

  // Navigate to website notes page
  // In your navigation component
  const navigateToWebsiteNotes = (websiteUrl: string) => {
  const encoded = btoa(websiteUrl) // Base64 encode
  router.push(`/notes/site/${encoded}`)
}

  // Get color class based on website (you can customize this logic)
  const getColorClasses = (url: string) => {
    const colorMap: Record<string, { border: string; bg: string; text: string; glow: string }> = {
      violet: {
        border: "border-violet-500/30",
        bg: "bg-violet-500/10",
        text: "text-violet-400",
        glow: "after:bg-gradient-to-r after:from-violet-500 after:to-violet-300",
      },
      sky: {
        border: "border-sky-500/30",
        bg: "bg-sky-500/10",
        text: "text-sky-400",
        glow: "after:bg-gradient-to-r after:from-sky-500 after:to-sky-300",
      },
      emerald: {
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        glow: "after:bg-gradient-to-r after:from-emerald-500 after:to-emerald-300",
      },
      amber: {
        border: "border-amber-500/30",
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        glow: "after:bg-gradient-to-r after:from-amber-500 after:to-amber-300",
      },
      rose: {
        border: "border-rose-500/30",
        bg: "bg-rose-500/10",
        text: "text-rose-400",
        glow: "after:bg-gradient-to-r after:from-rose-500 after:to-rose-300",
      },
      indigo: {
        border: "border-indigo-500/30",
        bg: "bg-indigo-500/10",
        text: "text-indigo-400",
        glow: "after:bg-gradient-to-r after:from-indigo-500 after:to-indigo-300",
      },
    }

    // Simple hash function to assign colors based on domain
    const colors = Object.keys(colorMap)
    const hash = url.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const colorKey = colors[hash % colors.length]
    
    return colorMap[colorKey]
  }

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours === 1 ? '' : 's'} ago`
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days === 1 ? '' : 's'} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  // Extract domain from URL
  const extractDomain = (url: string) => {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }

  if (isLoading || isUserLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    )
  }

  if (error && error !== "No notes found") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-zinc-800/50 p-12 text-center">
        <div className="rounded-full bg-red-500/10 p-4">
          <FileText className="h-10 w-10 text-red-500" />
        </div>
        <h3 className="mt-4 text-xl font-medium text-red-400">Error Loading Notes</h3>
        <p className="mt-2 text-zinc-400">{error}</p>
        <Button 
          className="mt-6 bg-violet-600 hover:bg-violet-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div>
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            type="text"
            placeholder="Search websites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-800 border-zinc-700 focus-visible:ring-violet-500"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-zinc-800 border-zinc-700">
              <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer" onClick={() => setFilterBy("all")}>
                <span>All Websites</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer" onClick={() => setFilterBy("recent")}>
                <span>Recently Updated</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer" onClick={() => setFilterBy("most")}>
                <span>Most Notes</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700">
                <SortAsc className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-zinc-800 border-zinc-700">
              <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer" onClick={() => setSortBy("recent")}>
                <span>Most Recent</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer" onClick={() => setSortBy("notes")}>
                <span>Most Notes</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer" onClick={() => setSortBy("alphabetical")}>
                <span>Alphabetical</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Websites grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedWebsites.map((website, index) => {
          const colorClasses = getColorClasses(website.url)
          const domain = extractDomain(website.url)

          return (
            <div
              key={website.url}
              onClick={() => navigateToWebsiteNotes(website.url)}
              className={`group relative overflow-hidden rounded-xl bg-zinc-800/50 border ${colorClasses.border} p-6 backdrop-blur-sm transition-all hover:bg-zinc-800/70 hover:shadow-lg cursor-pointer after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:opacity-70 ${colorClasses.glow}`}
            >
              <div className="flex items-start gap-4">
                <div className={`shrink-0 rounded-md ${colorClasses.bg} p-2`}>
                  {website.logo ? (
                    <img
                      src={website.logo}
                      alt={`${domain} favicon`}
                      className="h-8 w-8 object-contain"
                      onError={(e) => {
                        // (e.target as HTMLImageElement).src = "/placeholder.svg"
                      }}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded flex items-center justify-center">
                      <span className="text-xl font-bold text-zinc-400">
                        {domain.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-zinc-100 truncate">
                      {website.title || domain}
                    </h3>
                    <ArrowUpRight
                      className={`h-4 w-4 ${colorClasses.text} opacity-0 group-hover:opacity-100 transition-opacity`}
                    />
                  </div>

                  <p className="text-sm text-zinc-400 mt-1">{domain}</p>

                  {website.description && (
                    <div className="mt-3 p-2 rounded-md bg-zinc-900/50 border border-zinc-700/50">
                      <p className="text-xs text-zinc-400 italic line-clamp-2">"{website.description}"</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <FileText className={`h-4 w-4 ${colorClasses.text} mr-1.5`} />
                      <span className="text-sm text-zinc-300">{website.notes_count} notes</span>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-zinc-500 mr-1.5" />
                      <span className="text-xs text-zinc-500">
                        {formatRelativeTime(website.last_updated)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-zinc-700/50 hover:bg-zinc-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(website.href || website.url, "_blank")
                  }}
                >
                  <ExternalLink className="h-4 w-4 text-zinc-400" />
                  <span className="sr-only">Visit website</span>
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {sortedWebsites.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center rounded-xl bg-zinc-800/50 p-12 text-center">
          <div className="rounded-full bg-zinc-700/50 p-4">
            <FileText className="h-10 w-10 text-zinc-500" />
          </div>
          <h3 className="mt-4 text-xl font-medium">
            {searchQuery ? "No matching websites found" : "No websites found"}
          </h3>
          <p className="mt-2 text-zinc-400">
            {searchQuery 
              ? "Try adjusting your search query." 
              : "Create notes on websites to get started."}
          </p>
          <Button className="mt-6 bg-violet-600 hover:bg-violet-700">
            {searchQuery ? "Clear Search" : "Install Browser Extension"}
          </Button>
        </div>
      )}
    </div>
  )
}