export interface User {
  id: string
  phone: string
  countryCode: string
  isAuthenticated: boolean
}

export interface Country {
  name: {
    common: string
  }
  cca2: string
  idd: {
    root: string
    suffixes: string[]
  }
  flag: string
}

export interface Chatroom {
  id: string
  title: string
  createdAt: Date
  lastMessage?: string
  lastMessageTime?: Date
  messageCount: number
}

export interface Message {
  id: string
  chatroomId: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  image?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export interface ChatState {
  chatrooms: Chatroom[]
  currentChatroom: string | null
  messages: Record<string, Message[]>
  isTyping: boolean
  searchQuery: string
  addChatroom: (chatroom: Omit<Chatroom, "id" | "createdAt">) => void
  deleteChatroom: (id: string) => void
  setCurrentChatroom: (id: string | null) => void
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void
  setTyping: (typing: boolean) => void
  setSearchQuery: (query: string) => void
  loadMoreMessages: (chatroomId: string) => void
}

export interface UIState {
  theme: "light" | "dark" | "system"
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}
