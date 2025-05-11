"use client"

import { useState } from "react"
import { ExternalLink, Edit, Trash2, Tag } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

// Mock data
const recentHighlights = [
  {
    id: 1,
    text: "React Server Components allow developers to build applications that span the server and client.",
    website: "react.dev",
    timestamp: "2 hours ago",
    url: "#",
  },
  {
    id: 2,
    text: "Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.",
    website: "tailwindcss.com",
    timestamp: "Yesterday",
    url: "#",
  },
  {
    id: 3,
    text: "Next.js gives you the best developer experience with all the features you need for production.",
    website: "nextjs.org",
    timestamp: "3 days ago",
    url: "#",
  },
]

const recentNotes = [
  {
    id: 1,
    title: "React Server Components Notes",
    content: "Need to explore how RSC works with data fetching and state management.",
    tags: ["react", "nextjs"],
    timestamp: "1 day ago",
  },
  {
    id: 2,
    title: "Tailwind Project Setup",
    content: "Steps to configure Tailwind with PostCSS and custom theme.",
    tags: ["tailwind", "css"],
    timestamp: "2 days ago",
  },
  {
    id: 3,
    title: "Browser Extension Ideas",
    content: "Features to implement: screenshot capture, text selection, AI summarization.",
    tags: ["extension", "features"],
    timestamp: "1 week ago",
  },
]

export default function RecentActivity() {
  const [activeTab, setActiveTab] = useState("highlights")

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
      </div>

      <Tabs defaultValue="highlights" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-zinc-800/50 border border-zinc-700">
          <TabsTrigger value="highlights" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white">
            Highlights
          </TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white">
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="highlights" className="mt-6">
          <div className="space-y-4">
            {recentHighlights.map((highlight) => (
              <div
                key={highlight.id}
                className="group relative overflow-hidden rounded-xl bg-zinc-800/50 p-6 backdrop-blur-sm transition-all hover:bg-zinc-800/70"
              >
                <div className="space-y-3">
                  <blockquote className="text-zinc-200 italic">"{highlight.text}"</blockquote>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-zinc-400">{highlight.website}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-500">{highlight.timestamp}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700"
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
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <div className="space-y-4">
            {recentNotes.map((note) => (
              <div
                key={note.id}
                className="group relative overflow-hidden rounded-xl bg-zinc-800/50 p-6 backdrop-blur-sm transition-all hover:bg-zinc-800/70"
              >
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-zinc-100">{note.title}</h3>
                  <p className="text-zinc-300">{note.content}</p>
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag) => (
                      <div key={tag} className="flex items-center rounded-full bg-zinc-700/50 px-3 py-1 text-xs">
                        <Tag className="mr-1 h-3 w-3 text-violet-400" />
                        <span className="text-white">{tag}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">{note.timestamp}</span>
                    <div className="flex items-center space-x-2">
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
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
