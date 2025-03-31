"use client"

import type React from "react"

import { useState } from "react"
import { addNote } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Note } from "@/lib/types"

interface CreateNoteFormProps {
  onNoteCreated: (note: Note) => void
}

export function CreateNoteForm({ onNoteCreated }: CreateNoteFormProps) {
  const [content, setContent] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    setIsSubmitting(true)

    try {
      const note = await addNote({ content })
      onNoteCreated(note)
      setContent("")
      setIsOpen(false)
    } catch (error) {
      console.error("Error creating note:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-100 text-black hover:bg-yellow-200 font-semibold">
          <span className="mr-2">📌</span> Post a note
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            className="min-h-[150px] font-handwriting text-lg"
            required
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="bg-yellow-400 text-black hover:bg-yellow-500"
            >
              {isSubmitting ? "Posting..." : "Post Note"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

