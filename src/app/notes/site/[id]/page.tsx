import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import NotesGrid from "@/components/Notes/NotesGrid"


export default async function NotesSitePage({ params }: { params: { id: string } }) {

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/notes">
            <Button variant="ghost" className="pl-0 text-zinc-400 hover:text-zinc-100">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Websites
            </Button>
          </Link>
        </div>

        {/* Pass the notes data to NotesGrid */}
        <NotesGrid id={params.id}/>
      </div>
    </div>
  )
}