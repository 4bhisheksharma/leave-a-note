import { kv } from "@vercel/kv"
import type { Note, NoteCreationData } from "./types"
import { nanoid } from "nanoid"

const NOTES_KEY = "pinboard:notes"

export async function getAllNotes(): Promise<Note[]> {
  const notes = await kv.hvals(NOTES_KEY)
  return notes.sort((a: Note, b: Note) => b.createdAt - a.createdAt)
}

export async function createNote(data: NoteCreationData): Promise<Note> {
  const id = nanoid()
  const now = Date.now()

  // Default position if not provided
  const position = data.position || {
    x: 100 + Math.random() * 600,
    y: 100 + Math.random() * 400,
  }

  // Random rotation between -5 and 5 degrees
  const rotation = Math.random() * 10 - 5

  // Default to yellow if no color provided
  const color = data.color || "#fff9c4"

  const note: Note = {
    id,
    content: data.content,
    position,
    rotation,
    createdAt: now,
    color,
  }

  await kv.hset(NOTES_KEY, { [id]: note })
  return note
}

export async function updateNotePosition(id: string, position: { x: number; y: number }): Promise<void> {
  const note = (await kv.hget(NOTES_KEY, id)) as Note | null

  if (note) {
    note.position = position
    await kv.hset(NOTES_KEY, { [id]: note })
  }
}

export async function deleteNote(id: string): Promise<void> {
  await kv.hdel(NOTES_KEY, id)
}

