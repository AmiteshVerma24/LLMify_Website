import NotesSitesList from "@/components/Notes/NotesSitesList"

export default function NotesPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100">Your Notes</h1>
          <p className="text-zinc-400 mt-2">Select a website to view your notes</p>
        </div>

        <NotesSitesList />
      </div>
    </div>
  )
}
