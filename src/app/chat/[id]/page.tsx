"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { useChatStore } from "@/store/chat-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/common/theme-toggle"
import { MessageSkeleton } from "@/components/common/loading-skeleton"
import { formatTime, generateAIResponse, copyToClipboard } from "@/lib/utils"
import toast from "react-hot-toast"
import { ArrowLeft, Send, Copy, User, Bot, Paperclip } from "lucide-react"

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const chatroomId = params.id as string

  const { user } = useAuthStore()
  const { chatrooms, messages, isTyping, addMessage, setTyping, loadMoreMessages } = useChatStore()

  const [messageInput, setMessageInput] = useState("")
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentChatroom = chatrooms.find((room) => room.id === chatroomId)
  const chatroomMessages = messages[chatroomId] || []

  useEffect(() => {
    if (!user?.isAuthenticated) {
      router.push("/auth/login")
      return
    }

    if (!currentChatroom) {
      router.push("/dashboard")
      return
    }
  }, [user, currentChatroom, router])

  useEffect(() => {
    scrollToBottom()
  }, [chatroomMessages, isTyping])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleScroll = () => {
    const container = messagesContainerRef.current
    if (!container) return

    if (container.scrollTop === 0 && hasMoreMessages && !isLoadingMore) {
      setIsLoadingMore(true)
      setTimeout(() => {
        loadMoreMessages(chatroomId)
        setIsLoadingMore(false)
        // Simulate reaching end of messages after a few loads
        if (chatroomMessages.length > 100) {
          setHasMoreMessages(false)
        }
      }, 1000)
    }
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return

    const userMessage = messageInput.trim()
    setMessageInput("")

    // Add user message
    addMessage({
      chatroomId,
      content: userMessage,
      sender: "user",
    })

    // Show typing indicator
    setTyping(true)

    try {
      // Generate AI response
      const aiResponse = await generateAIResponse()

      // Add AI message
      addMessage({
        chatroomId,
        content: aiResponse,
        sender: "ai",
      })

      toast.success("Message sent!")
    } catch (error) {
      toast.error("Failed to get AI response")
    } finally {
      setTyping(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result as string
      addMessage({
        chatroomId,
        content: "Shared an image",
        sender: "user",
        image: imageData,
      })
      toast.success("Image uploaded!")
    }
    reader.readAsDataURL(file)
  }

  const handleCopyMessage = async (content: string) => {
    try {
      await copyToClipboard(content)
      toast.success("Message copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy message")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!currentChatroom) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Chatroom not found</h2>
          <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold">{currentChatroom.title}</h1>
              <p className="text-xs text-muted-foreground">{chatroomMessages.length} messages</p>
            </div>
          </div>
        </div>

        <ThemeToggle />
      </header>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4"
      >
        {isLoadingMore && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <MessageSkeleton key={i} />
            ))}
          </div>
        )}

        {chatroomMessages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 message-hover p-2 rounded-lg group ${
              message.sender === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div className="flex-shrink-0">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"
                }`}
              >
                {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
            </div>

            <div className={`flex-1 max-w-xs sm:max-w-md lg:max-w-lg ${message.sender === "user" ? "text-right" : ""}`}>
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.image && (
                  <div className="mb-2">
                    <img
                      src={message.image || "/placeholder.svg"}
                      alt="Shared image"
                      className="max-w-full h-auto rounded-md"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>

              <div
                className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${
                  message.sender === "user" ? "justify-end" : ""
                }`}
              >
                <span>{formatTime(message.timestamp)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleCopyMessage(message.content)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 p-2">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
            </div>
            <div className="flex-1">
              <div className="inline-block p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span>Gemini is typing</span>
                  <div className="typing-indicator ml-2">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t bg-card p-4">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="flex-shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

          <div className="flex-1 relative">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="pr-12 min-h-[44px] resize-none"
              disabled={isTyping}
            />
          </div>

          <Button onClick={handleSendMessage} disabled={!messageInput.trim() || isTyping} className="flex-shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
