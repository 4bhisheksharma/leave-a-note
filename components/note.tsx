"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { Note as NoteType } from "@/lib/types"
import { moveNote, removeNote } from "@/app/actions"
import { X } from "lucide-react"

interface NoteProps {
  note: NoteType
  onMove: (id: string, position: { x: number; y: number }) => void
  onDelete: (id: string) => void
}

export function Note({ note, onMove, onDelete }: NoteProps) {
  const [position, setPosition] = useState(note.position)
  const [isDragging, setIsDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const rect = e.currentTarget.getBoundingClientRect()
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    e.preventDefault()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newPosition = {
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      }
      setPosition(newPosition)
    }
  }

  const handleMouseUp = async () => {
    if (isDragging) {
      setIsDragging(false)
      onMove(note.id, position)
      await moveNote(note.id, position)
    }
  }

  const handleDelete = async () => {
    onDelete(note.id)
    await removeNote(note.id)
  }

  return (
    <div
      className="absolute cursor-move shadow-md"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `rotate(${note.rotation}deg)`,
        zIndex: isDragging ? 10 : 1,
        transition: isDragging ? "none" : "transform 0.2s ease",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="w-64 h-64 p-4 flex flex-col" style={{ backgroundColor: note.color }}>
        <div className="flex justify-end mb-2">
          <button
            onClick={handleDelete}
            className="text-gray-600 hover:text-red-500 transition-colors"
            aria-label="Delete note"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-auto whitespace-pre-wrap text-lg font-handwriting">{note.content}</div>
        <div className="text-xs text-gray-500 mt-2">{new Date(note.createdAt).toLocaleDateString()}</div>
      </div>
    </div>
  )
}

