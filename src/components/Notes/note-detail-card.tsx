"use client"
import { Button } from "@/components/ui/button"
import { Edit, ExternalLink, Tag, Trash2, X } from "lucide-react"

interface NoteDetailCardProps {
  note: {
    uuid: string;
    userNote: string;
    text: string;
    website: string;
    tags: string[];
    color: string; // Highlight color
    textColor: string; // Text color
    container: string; // Container of the note
    anchorNode: string; // Anchor node
    anchorOffset: number; // Offset in the anchor node
    focusNode: string; // Focus node
    focusOffset: number; // Offset in the focus node
    hasScreenShot: boolean; // Changed from `false` to `boolean`
    screenShotUrl: string; // URL of the screenshot
    createdAt: string; // Creation date
    updatedAt: string; // Last updated date
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function NoteDetailCard({ note, isOpen, onClose }: NoteDetailCardProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-700 rounded-xl shadow-lg overflow-hidden">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900">
          <h3 className="text-lg font-semibold text-zinc-100">Note Details</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4 text-zinc-300" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Website and timestamp */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-violet-400">{note.website}</span>
              </div>
              <span className="text-xs text-zinc-500">{new Date(note.updatedAt).toLocaleDateString() + " at " + new Date(note.updatedAt).toLocaleTimeString()} </span>
            </div>

            {/* Highlight */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-zinc-400">Highlighted Text</h4>
              <blockquote className="border-l-2 border-violet-500 pl-4 italic text-zinc-300">
                "{note.text}"
              </blockquote>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-zinc-400">Your Note</h4>
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                <p className="text-zinc-300">{note.userNote}</p>
              </div>
            </div>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-zinc-400">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <div key={tag} className="flex items-center rounded-full bg-zinc-700/50 px-3 py-1 text-xs">
                      <Tag className="mr-1 h-3 w-3 text-violet-400" />
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Screenshot */}
            {note.hasScreenShot && note.screenShotUrl && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-zinc-400">Screenshot</h4>
                <div className="relative rounded-lg overflow-hidden border border-zinc-700">
                  <img
                    src={note.screenShotUrl || "/placeholder.svg"}
                    alt="Screenshot"
                    className="w-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-zinc-800 text-zinc-300">
              <Button variant="outline" size="sm" className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700">
                <ExternalLink className="h-4 w-4 mr-2" />
                View in Page
              </Button>
              <Button variant="outline" size="sm" className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700">
                <Edit className="h-4 w-4 mr-2" />
                Edit Note
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}