"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Calendar, FileText, ExternalLink, ArrowUpRight, Filter, SortAsc, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import notesService from "@/services/notesService"
import { useAuth } from "@/components/AuthProvider"
import { getColorClasses } from "@/utils/helperMethods"

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
  const [currentPage, setCurrentPage] = useState(1)
  const { user, isLoading: isUserLoading } = useAuth()
  
  const itemsPerPage = 12

  // Fetch notes of user
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

  // Reset to first page when search/filter/sort changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, sortBy, filterBy])

  // Filter websites based on search query
  const getFilteredWebsites = () => {
    let filtered = websites.filter(
      (website) =>
        website.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        website.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        website.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    // Apply filter
    if (filterBy === "recent") {
      // Filter websites updated in the last 7 days
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      filtered = filtered.filter(website => new Date(website.last_updated) > weekAgo)
    } else if (filterBy === "most") {
      // Filter websites with more than average notes
      const avgNotes = websites.reduce((sum, site) => sum + site.notes_count, 0) / websites.length
      filtered = filtered.filter(website => website.notes_count > avgNotes)
    }

    return filtered
  }

  // Sort websites based on sort option
  const getSortedWebsites = (filtered: Website[]) => {
    return [...filtered].sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
      } else if (sortBy === "notes") {
        return b.notes_count - a.notes_count
      } else if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title)
      }
      return 0
    })
  }

  // Get paginated websites
  const getPaginatedWebsites = () => {
    const filtered = getFilteredWebsites()
    const sorted = getSortedWebsites(filtered)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return {
      websites: sorted.slice(startIndex, endIndex),
      totalCount: sorted.length,
      totalPages: Math.ceil(sorted.length / itemsPerPage)
    }
  }

  const { websites: paginatedWebsites, totalCount, totalPages } = getPaginatedWebsites()

  // Navigate to website notes page
  const navigateToWebsiteNotes = (websiteUrl: string) => {
    const encoded = btoa(websiteUrl) // Base64 encode
    router.push(`/notes/site/${encoded}`)
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
            className="pl-10 bg-zinc-800 border-zinc-700 focus-visible:ring-violet-500 text-zinc-300"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300">
                <Filter className="mr-2 h-4 w-4" />
                <span>Filter: {filterBy === "all" ? "All" : filterBy === "recent" ? "Recent" : "Most Notes"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-zinc-800 border-zinc-700 text-zinc-300">
              <DropdownMenuItem 
                className="hover:bg-zinc-700 cursor-pointer" 
                onClick={() => setFilterBy("all")}
              >
                <span>All Websites</span>
                {filterBy === "all" && <span className="ml-auto text-violet-400">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-zinc-700 cursor-pointer" 
                onClick={() => setFilterBy("recent")}
              >
                <span>Recently Updated</span>
                {filterBy === "recent" && <span className="ml-auto text-violet-400">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-zinc-700 cursor-pointer" 
                onClick={() => setFilterBy("most")}
              >
                <span>Most Notes</span>
                {filterBy === "most" && <span className="ml-auto text-violet-400">✓</span>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300">
                <SortAsc className="mr-2 h-4 w-4" />
                <span>Sort: {sortBy === "recent" ? "Recent" : sortBy === "notes" ? "Notes" : "A-Z"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-zinc-800 border-zinc-700 text-zinc-300">
              <DropdownMenuItem 
                className="hover:bg-zinc-700 cursor-pointer" 
                onClick={() => setSortBy("recent")}
              >
                <span>Most Recent</span>
                {sortBy === "recent" && <span className="ml-auto text-violet-400">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-zinc-700 cursor-pointer" 
                onClick={() => setSortBy("notes")}
              >
                <span>Most Notes</span>
                {sortBy === "notes" && <span className="ml-auto text-violet-400">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-zinc-700 cursor-pointer" 
                onClick={() => setSortBy("alphabetical")}
              >
                <span>Alphabetical</span>
                {sortBy === "alphabetical" && <span className="ml-auto text-violet-400">✓</span>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Results summary */}
      {!isLoading && totalCount > 0 && (
        <div className="mb-4 text-sm text-zinc-400">
          Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
        </div>
      )}

      {/* Websites grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedWebsites.map((website, index) => {
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1
              const isActive = pageNum === currentPage
              
              // Show first page, last page, current page, and surrounding pages
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={pageNum}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className={
                      isActive
                        ? "bg-violet-600 text-white"
                        : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300"
                    }
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              } else if (
                (pageNum === currentPage - 2 && currentPage > 3) ||
                (pageNum === currentPage + 2 && currentPage < totalPages - 2)
              ) {
                return <span key={pageNum} className="text-zinc-500">...</span>
              }
              return null
            })}
          </div>
          
          <Button
            variant="outline"
            className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Empty state */}
      {paginatedWebsites.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center rounded-xl bg-zinc-800/50 p-12 text-center">
          <div className="rounded-full bg-zinc-700/50 p-4">
            <FileText className="h-10 w-10 text-zinc-500" />
          </div>
          <h3 className="mt-4 text-xl font-medium">
            {searchQuery ? "No matching websites found" : "No websites found"}
          </h3>
          <p className="mt-2 text-zinc-400">
            {searchQuery 
              ? "Try adjusting your search query or filter settings." 
              : "Create notes on websites to get started."}
          </p>
          <div className="mt-6 flex gap-3">
            {searchQuery && (
              <Button 
                variant="outline"
                className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300"
                onClick={() => {
                  setSearchQuery("")
                  setFilterBy("all")
                  setSortBy("recent")
                }}
              >
                Clear Filters
              </Button>
            )}
            <Button className="bg-violet-600 hover:bg-violet-700">
              Install Browser Extension
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}