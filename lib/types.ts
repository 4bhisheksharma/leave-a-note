export interface Note {
  id: string
  content: string
  position: { x: number; y: number }
  rotation: number
  createdAt: number
  color: string
  author?: string
}

export interface NoteCreationData {
  content: string
  position?: { x: number; y: number }
  color?: string
}

