"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Edit, Trash2, Tag, ChevronDown, ArrowRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import userActivityService from "@/services/userActivityService"
import { LoadingSpinner } from "@/components/global/loading-spinner"
import { useRouter } from "next/navigation"

// Define TypeScript interfaces for the activity data
interface HighlightContent {
  uuid: string
  text: string
  container: string
  anchorNode: string
  anchorOffset: number
  focusNode: string
  focusOffset: number
  color: string
  textColor: string
  createdAt: string
  updatedAt: string
}

interface NoteContent extends HighlightContent {
  userNote: string
}

interface Activity {
  type: "highlight" | "note"
  url: string
  href: string
  content: HighlightContent | NoteContent
  createdAt: string
}

interface ActivityResponse {
  activities: Activity[]
  count: number
  success: boolean
}

export default function RecentActivity() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [allActivities, setAllActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const LIMIT = 5

  const fetchActivities = async (tabValue: string, reset: boolean = false) => {
    try {
      setLoading(true)
      
      // Convert UI tab value to API parameter
      let type: string | undefined;
      switch (tabValue) {
        case "highlights":
          type = "highlights";
          break;
        case "notes":
          type = "notes";
          break;
        default:
          type = undefined; // "all" tab
      }
      
      console.log(`Fetching activities with type: ${type || 'all'}`);
      
      const response = await userActivityService.activity(
        type,
        LIMIT
      )
      
      if (response.success) {
        // Store the fetched activities
        setAllActivities(response.activities)
        
        // Check if there are more activities to load based on count
        setHasMore(response.count > LIMIT)
      }
      setError(null)
    } catch (err) {
      setError("Failed to load activities. Please try again.")
      console.error("Error fetching activities:", err)
    } finally {
      setLoading(false)
    }
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Reset and fetch new data when tab changes
    fetchActivities(value, true)
  }

  useEffect(() => {
    // Initial data fetch
    fetchActivities(activeTab, true)
  }, [])

  // Extract the domain from a URL
  const extractDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return domain.replace(/^www\./, '')
    } catch {
      return url
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return "Unknown time"
    }
  }

  // Get filtered activities based on active tab
  const getFilteredActivities = () => {
    if (activeTab === "all") {
      return allActivities;
    } else if (activeTab === "highlights") {
      return allActivities.filter(activity => activity.type === "highlight");
    } else {
      return allActivities.filter(activity => activity.type === "note");
    }
  }

  // Get filtered activities for the current tab
  const filteredActivities = getFilteredActivities();

  // Check if an activity has a user note
  const hasUserNote = (activity: Activity): boolean => {
    return 'userNote' in activity.content;
  }

  // Handle button click based on the active tab
  const handleActionButton = () => {
    if (activeTab === "all") {
      if (hasMore) {
        // For "all" tab with more items, navigate to a page that shows all activities
        router.push('/activity')
      } else {
        // If there's nothing more to show, suggest checking other sections
        // This could be a UI message or navigation, keeping it as navigation for now
        router.push('/activity')
      }
    } else if (activeTab === "highlights") {
      // Navigate to highlights page
      router.push('/highlights')
    } else {
      // Navigate to notes page
      router.push('/notes')
    }
  }

  // Get the appropriate button text based on tab and hasMore state
  const getButtonText = () => {
    if (activeTab === "all") {
      return hasMore ? "View All Activities" : "Explore Notes & Highlights";
    } else if (activeTab === "highlights") {
      return "View All Highlights";
    } else {
      return "View All Notes";
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="bg-zinc-800/50 border border-zinc-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white">
            All
          </TabsTrigger>
          <TabsTrigger value="highlights" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white">
            Highlights
          </TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white">
            Notes
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {error && (
            <div className="p-4 mb-4 text-red-400 bg-red-900/20 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-10">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {filteredActivities.length === 0 ? (
                  <div className="text-center py-10 text-zinc-400">
                    No {activeTab !== "all" ? activeTab : "activities"} found.
                  </div>
                ) : (
                  filteredActivities.map((activity) => (
                    <div
                      key={activity.content.uuid}
                      className="group relative overflow-hidden rounded-xl bg-zinc-800/50 p-6 backdrop-blur-sm transition-all hover:bg-zinc-800/70"
                    >
                      <div className="space-y-3">
                        {activity.type === "highlight" ? (
                          <blockquote className="text-zinc-200 italic">"{activity.content.text}"</blockquote>
                        ) : (
                          <>
                            <h3 className="text-lg font-medium text-zinc-100">Note</h3>
                            <blockquote className="text-zinc-200 italic">"{activity.content.text}"</blockquote>
                            {hasUserNote(activity) && (
                              <p className="text-zinc-300">
                                {(activity.content as NoteContent).userNote}
                              </p>
                            )}
                          </>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-zinc-400">{extractDomain(activity.url)}</span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-500">{formatDate(activity.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700"
                              onClick={() => window.open(activity.href, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">Go to page</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-zinc-700"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Action button */}
              {filteredActivities.length > 0 && (
                <div className="mt-6 flex justify-center">
                  <Button
                    variant="outline"
                    className="border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                    onClick={handleActionButton}
                  >
                    <span>{getButtonText()}</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Tabs>
    </section>
  )
}