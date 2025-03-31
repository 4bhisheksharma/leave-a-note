import type { NextRequest } from "next/server"
import { WebSocketServer } from "ws"
import { getAllNotes } from "@/lib/redis"

// Initialize WebSocket server
let wss: WebSocketServer

if (!wss) {
  wss = new WebSocketServer({ noServer: true })

  wss.on("connection", (ws) => {
    console.log("Client connected")

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString())

        // Broadcast the message to all clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === 1) {
            client.send(JSON.stringify(data))
          }
        })
      } catch (error) {
        console.error("Error processing message:", error)
      }
    })

    ws.on("close", () => {
      console.log("Client disconnected")
    })
  })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")

  // Simple authentication check
  if (token !== "pinboard-socket-token") {
    return new Response("Unauthorized", { status: 401 })
  }

  // This is a WebSocket upgrade request
  if (req.headers.get("upgrade") === "websocket") {
    const notes = await getAllNotes()

    const res = new Response(null, {
      status: 101,
      webSocket: {
        accept: () => {},
        send: (message: string) => {
          wss.clients.forEach((client) => {
            if (client.readyState === 1) {
              client.send(message)
            }
          })
        },
      },
    })

    return res
  }

  return new Response("Expected Upgrade: websocket", { status: 426 })
}

