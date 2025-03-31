"use client"

import { useEffect, useRef, useState } from "react"
import type { Note } from "@/lib/types"

type WebSocketEvent =
  | { type: "add"; note: Note }
  | { type: "move"; id: string; position: { x: number; y: number } }
  | { type: "delete"; id: string }

export function useWebSocket(onEvent: (event: WebSocketEvent) => void) {
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const host = window.location.host
    const url = `${protocol}//${host}/api/socket?token=pinboard-socket-token`

    const socket = new WebSocket(url)
    socketRef.current = socket

    socket.onopen = () => {
      console.log("WebSocket connected")
      setIsConnected(true)
    }

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onEvent(data)
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }

    socket.onclose = () => {
      console.log("WebSocket disconnected")
      setIsConnected(false)
    }

    return () => {
      socket.close()
    }
  }, [onEvent])

  const sendEvent = (event: WebSocketEvent) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(event))
    }
  }

  return { isConnected, sendEvent }
}

