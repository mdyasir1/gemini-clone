"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { useChatStore } from "@/store/chat-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/common/theme-toggle"
import { ChatroomSkeleton } from "@/components/common/loading-skeleton"
import { debounce, formatDate } from "@/lib/utils"
import toast from "react-hot-toast"
import { Plus, Search, MessageCircle, Trash2, LogOut } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { chatrooms, searchQuery, addChatroom, deleteChatroom, setCurrentChatroom, setSearchQuery } = useChatStore()

  const [isLoading, setIsLoading] = useState(true)
  const [newChatroomTitle, setNewChatroomTitle] = useState("")
  const [showNewChatroom, setShowNewChatroom] = useState(false)

  useEffect(() => {
    if (!user?.isAuthenticated) {
      router.push("/auth/login")
    } else {
      setIsLoading(false)
    }
  }, [user, router])

  const debouncedSearch = debounce((query: string) => {
    setSearchQuery(query)
  }, 300)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }

  const handleCreateChatroom = () => {
    if (!newChatroomTitle.trim()) {
      toast.error("Please enter a chatroom title")
      return
    }

    addChatroom({
      title: newChatroomTitle.trim(),
      messageCount: 0,
    })

    setNewChatroomTitle("")
    setShowNewChatroom(false)
    toast.success("Chatroom created successfully!")
  }

  const handleDeleteChatroom = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteChatroom(id)
      toast.success("Chatroom deleted successfully!")
    }
  }

  const handleOpenChatroom = (id: string) => {
    setCurrentChatroom(id)
    router.push(`/chat/${id}`)
  }

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout()
      toast.success("Logged out successfully!")
      router.push("/auth/login")
    }
  }

  const filteredChatrooms = chatrooms.filter((room) => room.title.toLowerCase().includes(searchQuery.toLowerCase()))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 max-w-4xl">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <ChatroomSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-4xl">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Gemini Chat</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user?.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 max-w-4xl">
        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search chatrooms..." className="pl-10" onChange={handleSearch} />
          </div>

          <Button onClick={() => setShowNewChatroom(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* New Chatroom Form */}
        {showNewChatroom && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter chatroom title..."
                  value={newChatroomTitle}
                  onChange={(e) => setNewChatroomTitle(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleCreateChatroom()}
                  autoFocus
                />
                <Button onClick={handleCreateChatroom}>Create</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNewChatroom(false)
                    setNewChatroomTitle("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chatrooms List */}
        <div className="space-y-3">
          {filteredChatrooms.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No chatrooms found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "Try adjusting your search terms" : "Create your first chatroom to get started"}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setShowNewChatroom(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Chatroom
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredChatrooms.map((room) => (
              <Card
                key={room.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleOpenChatroom(room.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MessageCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{room.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{room.messageCount} messages</span>
                            {room.lastMessageTime && (
                              <>
                                <span>•</span>
                                <span>{formatDate(room.lastMessageTime)}</span>
                              </>
                            )}
                          </div>
                          {room.lastMessage && (
                            <p className="text-sm text-muted-foreground truncate mt-1">{room.lastMessage}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteChatroom(room.id, room.title)
                      }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
