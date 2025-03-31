"use client"

import { useState } from "react"
import type { Note as NoteType } from "@/lib/types"
import { Note } from "@/components/note"
import { CreateNoteForm } from "@/components/create-note-form"
import { useWebSocket } from "@/hooks/use-websocket"

interface PinboardProps {
  initialNotes: NoteType[]
}

export function Pinboard({ initialNotes }: PinboardProps) {
  const [notes, setNotes] = useState<NoteType[]>(initialNotes)

  const handleNoteEvent = (event: any) => {
    switch (event.type) {
      case "add":
        setNotes((prev) => [event.note, ...prev])
        break
      case "move":
        setNotes((prev) => prev.map((note) => (note.id === event.id ? { ...note, position: event.position } : note)))
        break
      case "delete":
        setNotes((prev) => prev.filter((note) => note.id !== event.id))
        break
    }
  }

  const { sendEvent } = useWebSocket(handleNoteEvent)

  const handleNoteCreated = (note: NoteType) => {
    setNotes((prev) => [note, ...prev])
    sendEvent({ type: "add", note })
  }

  const handleNoteMove = (id: string, position: { x: number; y: number }) => {
    setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, position } : note)))
    sendEvent({ type: "move", id, position })
  }

  const handleNoteDelete = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
    sendEvent({ type: "delete", id })
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <header className="fixed top-0 left-0 right-0 bg-white z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Pinboard</h1>
          <CreateNoteForm onNoteCreated={handleNoteCreated} />
        </div>
      </header>

      <div className="pt-20 pb-10 relative min-h-screen">
        {/* Decorative pin */}
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-4 h-4 bg-red-500 rounded-full shadow-md"></div>
          <div className="w-1 h-10 bg-gray-300 absolute top-4 left-1/2 transform -translate-x-1/2 shadow-sm"></div>
        </div>

        {/* Notes */}
        <div className="relative w-full h-full">
          {notes.map((note) => (
            <Note key={note.id} note={note} onMove={handleNoteMove} onDelete={handleNoteDelete} />
          ))}
        </div>
      </div>
    </div>
  )
}

