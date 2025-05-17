"use client"

import { useEffect, useState } from "react"
import { Edit, Trash2, ExternalLink, ImageIcon, Tag, Clock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import notesService from "@/services/notesService"
import { extractMainWebsite } from "@/utils/helperMethods"
import NoteDetailCard from "@/components/Notes/note-detail-card"

// Mock data for notes
const mockNotes = [
  {
    uuid: "jdsff",
    userNote: "User's annotation",
    text: "Highlighted text",
    website: "example.com",
    tags: ["highlight", "annotation"],
    color: "#FFFF00", // Highlight color
    textColor: "#000000", // Text color
    container: "article-container", // Container of the note
    anchorNode: "node-path", // Anchor node
    anchorOffset: 10, // Offset in the anchor node
    focusNode: "node-path", // Focus node
    focusOffset: 30, // Offset in the focus node
    hasScreenShot: false, // Indicates if a screenshot is available
    screenShotUrl: "", // URL of the screenshot
    createdAt: "2025-05-12T14:41:01.607Z", // Creation date
    updatedAt: "2025-05-12T14:41:01.607Z", // Last updated date
  },
];

type NotesGridProps = {
  id: string; // Base64 encoded
};

export default function NotesGrid({ id }: NotesGridProps) {
  const [notes, setNotes] = useState<typeof mockNotes>([]);
  const [error, setError] = useState<string | null>(null);
  const [domain, setDomain] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedNote, setSelectedNote] = useState<(typeof mockNotes)[0] | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const openNoteDetail = (note: (typeof mockNotes)[0]) => {
    setSelectedNote(note)
    setIsDetailOpen(true)
  }

  const closeNoteDetail = () => {
    setIsDetailOpen(false)
  }

  useEffect(() => {
    const fetchUserNotes = async () => {
      try {
        setLoading(true);
        // Decode the base64 ID to get the URL
        const decodedUrl = decodeURIComponent(id);
        const decodedIdUrl = atob(decodedUrl);
        setDomain(decodedIdUrl);

        console.log("Decoded URL:", decodedIdUrl);
        const mainWebsite = extractMainWebsite(decodedIdUrl);
        setWebsite(mainWebsite);

        // Fetch notes by website URL
        const fetchedNotes = await notesService.getNotesByWebsiteUrl(decodedIdUrl);
        console.log("Fetched notes:", fetchedNotes.notes);
        setNotes(fetchedNotes.notes || []);
      } catch (err: any) {
        console.error("Error fetching notes:", err);
        setError("Failed to load notes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserNotes();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <section className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100">
            Notes from <span className="text-violet-400">{website || '...'}</span>
          </h1>
          <p className="text-zinc-400 mt-2 break-all">
            All your notes from <span className="">{domain || '...'}</span>
          </p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl bg-zinc-800/50 p-20 text-center">
          <Loader2 className="h-12 w-12 text-violet-500 animate-spin" />
          <h3 className="mt-4 text-xl font-medium text-zinc-300">Loading your notes...</h3>
          <p className="mt-2 text-zinc-400">Please wait while we fetch your highlights.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100">
          Notes from <span className="text-violet-400">{website}</span>
        </h1>
        <p className="text-zinc-400 mt-2 break-all">All your notes from <span className="">{domain}</span></p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          
          <div
            key={note.uuid}
            className="group relative overflow-hidden rounded-xl bg-zinc-800/70 backdrop-blur-sm transition-all hover:bg-zinc-800 hover:shadow-lg cursor-pointer"
            onClick={() => openNoteDetail(note)}
          >
            <div className="p-6 space-y-4">
              {/* Highlight */}
              <blockquote className="border-l-2 border-violet-500 pl-4 italic text-zinc-300">
                "{note.text}"
              </blockquote>

              {/* Note */}
              <p className="text-zinc-400">{note.userNote}</p>

              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <div key={tag} className="flex items-center rounded-full bg-zinc-700/50 px-3 py-1 text-xs">
                      <Tag className="mr-1 h-3 w-3 text-violet-400" />
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              )}
              {/* Screenshot Preview (if available) */}
              {note.hasScreenShot && note.screenShotUrl && (
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="relative h-32 w-full cursor-pointer overflow-hidden rounded-md">
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button variant="secondary" size="sm" className="bg-zinc-800 hover:bg-zinc-700">
                          View Screenshot
                        </Button>
                      </div>
                      <Image
                        className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
                        src={note.screenShotUrl}
                        alt="Screenshot"
                        width={500}
                        height={300}
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-zinc-700">
                    <DialogHeader>
                      <DialogTitle>Screenshot from {note.website}</DialogTitle>
                      <DialogDescription className="text-zinc-400">{note.updatedAt}</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                      <img
                        src={note.screenShotUrl}
                        alt="Screenshot"
                        className="w-full rounded-md object-contain"
                      />
                      <p className="mt-2 text-zinc-400">
                        This screenshot was taken on {new Date(note.updatedAt).toLocaleDateString()} at{" "}
                        {new Date(note.updatedAt).toLocaleTimeString()}.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* Meta Information */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-zinc-500">
                    <Clock className="mr-1 h-3 w-3" />
                    {new Date(note.updatedAt).toLocaleDateString()} at{" "} {new Date(note.updatedAt).toLocaleTimeString()}
                  </span>
                </div>
                {note.hasScreenShot && (
                  <span className="flex items-center text-zinc-500">
                    <ImageIcon className="mr-1 h-3 w-3" />
                    Screenshot
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 pt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">View in page</span>
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

              <div className="absolute inset-0 bg-zinc-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button className="bg-violet-600 hover:bg-violet-700">View Details</Button>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-violet-500 to-violet-300 opacity-70"></div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {notes.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center rounded-xl bg-zinc-800/50 p-12 text-center">
          <div className="rounded-full bg-zinc-700/50 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-medium">No notes found</h3>
          <p className="mt-2 text-zinc-400">Start highlighting text on websites to create notes.</p>
          <Button className="mt-6 bg-violet-600 hover:bg-violet-700">Create Your First Note</Button>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      )}
      {selectedNote && <NoteDetailCard note={selectedNote} isOpen={isDetailOpen} onClose={closeNoteDetail} />}
    </section>
  );
}