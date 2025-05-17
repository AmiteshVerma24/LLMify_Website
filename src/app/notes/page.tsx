"use client"
import { useState } from "react"
import NotesSitesList from "@/components/Notes/notes-site-list"
import NotesGroupsSection from "@/components/Notes/notes-group-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Folder } from "lucide-react"



export default function NotesPage() {
  const [activeTab, setActiveTab] = useState("websites")
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100">Your Notes</h1>
          <p className="text-zinc-400 mt-2">Organize and access your notes by website or custom groups</p>
        </div>

        <Tabs defaultValue="websites" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-zinc-800/50 border border-zinc-700 mb-8 w-full sm:w-auto">
            <TabsTrigger
              value="websites"
              className="flex-1 sm:flex-initial data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-100"
            >
              <Globe className="h-4 w-4 mr-2" />
              By Website
            </TabsTrigger>
            <TabsTrigger
              value="groups"
              className="flex-1 sm:flex-initial data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-100"
            >
              <Folder className="h-4 w-4 mr-2" />
              By Group
            </TabsTrigger>
          </TabsList>

          <TabsContent value="websites" className="mt-0">
            <NotesSitesList />
          </TabsContent>

          <TabsContent value="groups" className="mt-0">
            <NotesGroupsSection />
          </TabsContent>
        </Tabs>

        {/* <NotesSitesList /> */}
      </div>
    </div>
  )
}
