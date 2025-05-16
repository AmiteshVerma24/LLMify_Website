"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Calendar, Bookmark, ExternalLink, ArrowUpRight, Filter, SortAsc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for websites with highlights
const mockWebsites = [
  {
    id: 1,
    domain: "react.dev",
    title: "React Documentation",
    description: "Official React documentation and guides",
    highlightsCount: 24,
    lastHighlighted: "2 hours ago",
    favicon: "/placeholder.svg?height=32&width=32",
    color: "violet",
  },
  {
    id: 2,
    domain: "nextjs.org",
    title: "Next.js Documentation",
    description: "The React Framework for Production",
    highlightsCount: 18,
    lastHighlighted: "Yesterday",
    favicon: "/placeholder.svg?height=32&width=32",
    color: "sky",
  },
  {
    id: 3,
    domain: "tailwindcss.com",
    title: "Tailwind CSS",
    description: "Rapidly build modern websites without ever leaving your HTML",
    highlightsCount: 15,
    lastHighlighted: "3 days ago",
    favicon: "/placeholder.svg?height=32&width=32",
    color: "emerald",
  },
  {
    id: 4,
    domain: "developer.mozilla.org",
    title: "MDN Web Docs",
    description: "Resources for developers, by developers",
    highlightsCount: 32,
    lastHighlighted: "1 week ago",
    favicon: "/placeholder.svg?height=32&width=32",
    color: "amber",
  },
  {
    id: 5,
    domain: "github.com",
    title: "GitHub",
    description: "Where the world builds software",
    highlightsCount: 9,
    lastHighlighted: "2 weeks ago",
    favicon: "/placeholder.svg?height=32&width=32",
    color: "rose",
  },
  {
    id: 6,
    domain: "vercel.com",
    title: "Vercel",
    description: "Develop. Preview. Ship.",
    highlightsCount: 12,
    lastHighlighted: "3 weeks ago",
    favicon: "/placeholder.svg?height=32&width=32",
    color: "indigo",
  },
]

export default function HighlightsSitesList() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [filterBy, setFilterBy] = useState("all")

  // Filter websites based on search query
  const filteredWebsites = mockWebsites.filter(
    (website) =>
      website.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sort websites based on sort option
  const sortedWebsites = [...filteredWebsites].sort((a, b) => {
    if (sortBy === "recent") {
      // This is a mock sort - in a real app, you'd compare actual dates
      return a.id < b.id ? 1 : -1
    } else if (sortBy === "highlights") {
      return b.highlightsCount - a.highlightsCount
    } else if (sortBy === "alphabetical") {
      return a.domain.localeCompare(b.domain)
    }
    return 0
  })

  // Navigate to website highlights page
  const navigateToWebsiteHighlights = (websiteId: number) => {
    // In a real app, you'd navigate to a dynamic route
    router.push(`/highlights/site/${websiteId}`)
  }

  // Get color class based on website color
  const getColorClasses = (color: string) => {
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

    return colorMap[color] || colorMap.violet
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
                <span>Recently Highlighted</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer" onClick={() => setFilterBy("most")}>
                <span>Most Highlights</span>
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
              <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer" onClick={() => setSortBy("highlights")}>
                <span>Most Highlights</span>
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
        {sortedWebsites.map((website) => {
          const colorClasses = getColorClasses(website.color)

          return (
            <div
              key={website.id}
              onClick={() => navigateToWebsiteHighlights(website.id)}
              className={`group relative overflow-hidden rounded-xl bg-zinc-800/50 border ${colorClasses.border} p-6 backdrop-blur-sm transition-all hover:bg-zinc-800/70 hover:shadow-lg cursor-pointer after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:opacity-70 ${colorClasses.glow}`}
            >
              <div className="flex items-start gap-4">
                <div className={`shrink-0 rounded-md ${colorClasses.bg} p-2`}>
                  <img
                    src={website.favicon || "/placeholder.svg"}
                    alt={`${website.domain} favicon`}
                    className="h-8 w-8 object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-zinc-100 truncate">{website.title}</h3>
                    <ArrowUpRight
                      className={`h-4 w-4 ${colorClasses.text} opacity-0 group-hover:opacity-100 transition-opacity`}
                    />
                  </div>

                  <p className="text-sm text-zinc-400 mt-1">{website.domain}</p>
                  <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{website.description}</p>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <Bookmark className={`h-4 w-4 ${colorClasses.text} mr-1.5`} />
                      <span className="text-sm text-zinc-300">{website.highlightsCount} highlights</span>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-zinc-500 mr-1.5" />
                      <span className="text-xs text-zinc-500">{website.lastHighlighted}</span>
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
                    window.open(`https://${website.domain}`, "_blank")
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
      {filteredWebsites.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl bg-zinc-800/50 p-12 text-center">
          <div className="rounded-full bg-zinc-700/50 p-4">
            <Bookmark className="h-10 w-10 text-zinc-500" />
          </div>
          <h3 className="mt-4 text-xl font-medium">No websites found</h3>
          <p className="mt-2 text-zinc-400">Try adjusting your search or highlight text on websites to get started.</p>
          <Button className="mt-6 bg-violet-600 hover:bg-violet-700">Install Browser Extension</Button>
        </div>
      )}
    </div>
  )
}
