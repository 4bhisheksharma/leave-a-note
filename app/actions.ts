"use server"

import { revalidatePath } from "next/cache"
import { createNote, deleteNote, updateNotePosition } from "@/lib/redis"
import type { NoteCreationData } from "@/lib/types"

export async function addNote(data: NoteCreationData) {
  const note = await createNote(data)
  revalidatePath("/")
  return note
}

export async function moveNote(id: string, position: { x: number; y: number }) {
  await updateNotePosition(id, position)
  revalidatePath("/")
}

export async function removeNote(id: string) {
  await deleteNote(id)
  revalidatePath("/")
}

