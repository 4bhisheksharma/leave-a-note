import { getAllNotes } from "@/lib/redis"
import { Pinboard } from "@/components/pinboard"

export default async function Home() {
  const initialNotes = await getAllNotes()

  return (
    <main className="min-h-screen bg-white">
      <Pinboard initialNotes={initialNotes} />
    </main>
  )
}

