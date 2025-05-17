"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Calendar, FileText, ArrowUpRight, FolderPlus, Folder, Edit, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getColorClassesBasedOnName } from "@/utils/helperMethods"
import groupService from "@/services/groupService"
import { useAuth } from "@/components/AuthProvider"
import { LoadingSpinnerFullPage } from "@/components/global/Spinner"

interface Website {
  url: string
  href: string
}

interface Group {
  id: string
  name: string
  description: string
  websites: Website[]
  createdAt: string
  updatedAt: string
}

export default function NotesGroupsSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")
  const [selectedWebsites, setSelectedWebsites] = useState<string[]>([])
  const [searchWebsites, setSearchWebsites] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [groups, setGroups] = useState<Group[]>([])
  const { user, isLoading: isUserLoading } = useAuth()

  useEffect(() => {
    const fetchUserGroups = async () => {
      if (!user || isUserLoading) return
      
      try {
        setIsLoading(true)
        setError(null)
        const response = await groupService.getGroups()
        
        if (response && Array.isArray(response.groups)) {
          setGroups(response.groups)
        } else if (response && response.groups === undefined) {
          console.log("Response might be array directly:", response)
          if (Array.isArray(response)) {
            setGroups(response)
          } else {
            setError("Unexpected response structure")
            setGroups([])
          }
        } else {
          console.log("Response structure:", response)
          setError("No groups found")
          setGroups([])
        }
      } catch (err: any) {
        console.error("Error fetching groups:", err)
        console.error("Error response:", err.response)
        if (err.response?.status === 404) {
          console.log("404 - No groups found, setting empty array")
          setError("No groups found")
          setGroups([])
        } else {
          setError("Error loading groups: " + (err.message || "Unknown error"))
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    if (!isUserLoading) {
      fetchUserGroups()
      console.log("User groups fetched successfully")
      console.log("User groups:", groups)
    }
  }, [user, isUserLoading])

  // Filter groups based on search query
  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Navigate to group detail page
  const navigateToGroupDetail = (groupId: string) => {
    router.push(`/notes/group/${groupId}`)
  }

  // Mock available websites for selection
  const availableWebsites = [
    "vercel.com",
    "nextjs.org",
    "react.dev",
    "tailwindcss.com",
    "ui.shadcn.com",
    "figma.com",
    "openai.com",
    "huggingface.co",
    "research.google",
    "github.com",
    "developer.mozilla.org",
  ]

  // Filter websites based on search
  const filteredWebsites = availableWebsites.filter((website) =>
    website.toLowerCase().includes(searchWebsites.toLowerCase()),
  )

  // Toggle website selection
  const toggleWebsiteSelection = (website: string) => {
    if (selectedWebsites.includes(website)) {
      setSelectedWebsites(selectedWebsites.filter((site) => site !== website))
    } else {
      setSelectedWebsites([...selectedWebsites, website])
    }
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

  // Create new group
  const createNewGroup = async () => {
    if (!newGroupName.trim() || selectedWebsites.length === 0) return
    
    try {
      setIsLoading(true)
      // Format websites to match the expected structure
      const websitesData = selectedWebsites.map(url => ({
        url,
        href: `https://${url}`
      }))
      
      const newGroup = {
        name: newGroupName,
        description: newGroupDescription,
        websites: websitesData
      }
      
      const response = await groupService.saveNewGroup(newGroup)
      
      // Add the new group to the state
      if (response && response.id) {
        setGroups([...groups, response])
      }
      
      // Reset form and close dialog
      setNewGroupName("")
      setNewGroupDescription("")
      setSelectedWebsites([])
      setIsCreateDialogOpen(false)
    } catch (err: any) {
      console.error("Error creating group:", err)
      setError("Failed to create group: " + (err.message || "Unknown error"))
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || isUserLoading) {
    return <LoadingSpinnerFullPage message="Loading your note groups..." />
  }

  if (error && error !== "No groups found") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-zinc-800/50 p-12 text-center">
        <div className="rounded-full bg-red-500/10 p-4">
          <Folder className="h-10 w-10 text-red-500" />
        </div>
        <h3 className="mt-4 text-xl font-medium text-red-400">Error Loading Groups</h3>
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Note Groups</h2>
          <p className="text-zinc-400 mt-1">Organize your notes into custom groups</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0 bg-violet-600 hover:bg-violet-700">
              <FolderPlus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px] bg-zinc-900 border-zinc-700 p-0 gap-0">
            <DialogHeader className="p-6 border-b border-zinc-800">
              <DialogTitle className="text-zinc-100">Create Note Group</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Group related websites and notes together for better organization.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col md:flex-row h-[500px] overflow-hidden">
              {/* Left side - Group details */}
              <div className="p-6 border-b md:border-b-0 md:border-r border-zinc-800 flex-1 overflow-y-auto">
                <div className="space-y-4 text-zinc-300">
                  <div className="space-y-2">
                    <Label htmlFor="group-name" className="text-zinc-300">
                      Group Name
                    </Label>
                    <Input
                      id="group-name"
                      placeholder="e.g., Web Development"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 "
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="group-description" className="text-zinc-300">
                      Description
                    </Label>
                    <Textarea
                      id="group-description"
                      placeholder="Brief description of this group"
                      value={newGroupDescription}
                      onChange={(e) => setNewGroupDescription(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 min-h-[80px]"
                    />
                  </div>

                  <div className="pt-4">
                    <h4 className="text-sm font-medium text-zinc-300 mb-2">Group Preview</h4>
                    <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
                      {newGroupName ? (
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <div className="bg-violet-500/10 p-2 rounded-md mr-3">
                              <Folder className="h-5 w-5 text-violet-400" />
                            </div>
                            <div>
                              <h3 className="text-base font-medium text-zinc-100">{newGroupName}</h3>
                              {newGroupDescription && (
                                <p className="text-xs text-zinc-400 mt-1">{newGroupDescription}</p>
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs mb-2 text-zinc-300">Selected websites:</p>
                            <div className="flex flex-wrap gap-1">
                              {selectedWebsites.length > 0 ? (
                                selectedWebsites.map((website) => (
                                  <span
                                    key={website}
                                    className="text-xs bg-violet-500/10 border border-violet-500/30 rounded-full px-2 py-0.5 text-violet-400"
                                  >
                                    {website}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-zinc-500">No websites selected yet</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 text-zinc-500">
                          <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>Enter group details to see preview</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Website selection */}
              <div className="p-6 flex-1 flex flex-col overflow-hidden text-zinc-300">
                <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between">
                    <Label className="text-zinc-300">Select Websites</Label>
                    <span className="text-xs text-zinc-500">{selectedWebsites.length} selected</span>
                  </div>

                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      placeholder="Search websites..."
                      value={searchWebsites}
                      onChange={(e) => setSearchWebsites(e.target.value)}
                      className="pl-10 bg-zinc-800 border-zinc-700"
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto border border-zinc-700 rounded-md">
                    {filteredWebsites.length > 0 ? (
                      <div className="divide-y divide-zinc-700">
                        {filteredWebsites.map((website) => (
                          <div
                            key={website}
                            className={`flex items-center p-3 cursor-pointer transition-colors ${
                              selectedWebsites.includes(website) ? "bg-violet-500/10" : "hover:bg-zinc-800"
                            }`}
                            onClick={() => toggleWebsiteSelection(website)}
                          >
                            <div
                              className={`w-5 h-5 rounded-md mr-3 flex items-center justify-center ${
                                selectedWebsites.includes(website)
                                  ? "bg-violet-500 text-white"
                                  : "border border-zinc-600"
                              }`}
                            >
                              {selectedWebsites.includes(website) && <Check className="h-3.5 w-3.5" />}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center">
                                <img src={`/placeholder.svg?height=16&width=16`} alt="" className="h-4 w-4 mr-2" />
                                <span className="text-sm text-zinc-300 truncate">{website}</span>
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:bg-zinc-700 hover:text-zinc-300"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(`https://${website}`, "_blank")
                              }}
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span className="sr-only">Visit website</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full p-4 text-zinc-500">
                        No websites found matching your search
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <div>
                      {selectedWebsites.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs hover:text-zinc-300"
                          onClick={() => setSelectedWebsites([])}
                        >
                          Clear all
                        </Button>
                      )}
                    </div>
                    <div>Click on a website to select/deselect</div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="p-6 border-t border-zinc-800">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300"
              >
                Cancel
              </Button>
              <Button
                onClick={createNewGroup}
                disabled={!newGroupName.trim() || selectedWebsites.length === 0}
                className="bg-violet-600 hover:bg-violet-700"
              >
                Create Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          type="text"
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-zinc-800 border-zinc-700 focus-visible:ring-violet-500"
        />
      </div>

      {/* Groups grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => {
          const colorClasses = getColorClassesBasedOnName(group.name)
          const websiteUrls = group.websites.map(w => w.url)

          return (
            <div
              key={group.id}
              onClick={() => navigateToGroupDetail(group.id)}
              className={`group relative overflow-hidden rounded-xl bg-zinc-800/50 border ${colorClasses.border} p-6 backdrop-blur-sm transition-all hover:bg-zinc-800/70 hover:shadow-lg cursor-pointer after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:opacity-70 ${colorClasses.glow}`}
            >
              <div className="flex items-start gap-4">
                <div className={`shrink-0 rounded-md ${colorClasses.bg} p-2`}>
                  <Folder className={`h-8 w-8 ${colorClasses.text}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-zinc-100 truncate">{group.name}</h3>
                    <ArrowUpRight
                      className={`h-4 w-4 ${colorClasses.text} opacity-0 group-hover:opacity-100 transition-opacity`}
                    />
                  </div>

                  <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{group.description}</p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {websiteUrls.slice(0, 3).map((website) => (
                      <span
                        key={website}
                        className="text-xs bg-zinc-800 border border-zinc-700 rounded-full px-2 py-0.5 text-zinc-400"
                      >
                        {website}
                      </span>
                    ))}
                    {websiteUrls.length > 3 && (
                      <span className="text-xs bg-zinc-800 border border-zinc-700 rounded-full px-2 py-0.5 text-zinc-400">
                        +{websiteUrls.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <FileText className={`h-4 w-4 ${colorClasses.text} mr-1.5`} />
                      <span className="text-sm text-zinc-300">{websiteUrls.length} websites</span>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-zinc-500 mr-1.5" />
                      <span className="text-xs text-zinc-500">
                        {formatRelativeTime(group.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-zinc-700/50 hover:bg-zinc-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Edit group logic would go here
                  }}
                >
                  <Edit className="h-4 w-4 text-zinc-400" />
                  <span className="sr-only">Edit group</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-zinc-700/50 hover:bg-zinc-700 hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Delete group logic would go here
                  }}
                >
                  <Trash2 className="h-4 w-4 text-zinc-400" />
                  <span className="sr-only">Delete group</span>
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {filteredGroups.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl bg-zinc-800/50 p-12 text-center">
          <div className="rounded-full bg-zinc-700/50 p-4">
            <Folder className="h-10 w-10 text-zinc-500" />
          </div>
          <h3 className="mt-4 text-xl font-medium">No groups found</h3>
          <p className="mt-2 text-zinc-400">Create a new group to organize your notes by topic or project.</p>
          <Button className="mt-6 bg-violet-600 hover:bg-violet-700" onClick={() => setIsCreateDialogOpen(true)}>
            <FolderPlus className="h-4 w-4 mr-2" />
            Create Your First Group
          </Button>
        </div>
      )}
    </div>
  )
}

// Helper component for the check icon
function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}