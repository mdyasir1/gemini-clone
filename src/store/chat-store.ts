import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ChatState, Chatroom, Message } from "@/types"
import { generateId } from "@/lib/utils"

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chatrooms: [],
      currentChatroom: null,
      messages: {},
      isTyping: false,
      searchQuery: "",

      addChatroom: (chatroom) => {
        const newChatroom: Chatroom = {
          ...chatroom,
          id: generateId(),
          createdAt: new Date(),
          messageCount: 0,
        }
        set((state) => ({
          chatrooms: [newChatroom, ...state.chatrooms],
        }))
      },

      deleteChatroom: (id) => {
        set((state) => {
          const newMessages = { ...state.messages }
          delete newMessages[id]
          return {
            chatrooms: state.chatrooms.filter((room) => room.id !== id),
            messages: newMessages,
            currentChatroom: state.currentChatroom === id ? null : state.currentChatroom,
          }
        })
      },

      setCurrentChatroom: (id) => set({ currentChatroom: id }),

      addMessage: (message) => {
        const newMessage: Message = {
          ...message,
          id: generateId(),
          timestamp: new Date(),
        }

        set((state) => {
          const chatroomMessages = state.messages[message.chatroomId] || []
          const updatedMessages = {
            ...state.messages,
            [message.chatroomId]: [...chatroomMessages, newMessage],
          }

          // Update chatroom's last message info
          const updatedChatrooms = state.chatrooms.map((room) => {
            if (room.id === message.chatroomId) {
              return {
                ...room,
                lastMessage: message.content,
                lastMessageTime: newMessage.timestamp,
                messageCount: room.messageCount + 1,
              }
            }
            return room
          })

          return {
            messages: updatedMessages,
            chatrooms: updatedChatrooms,
          }
        })
      },

      setTyping: (isTyping) => set({ isTyping }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),

      loadMoreMessages: (chatroomId) => {
        // Simulate loading more messages with dummy data
        const dummyMessages: Message[] = Array.from({ length: 20 }, (_, i) => ({
          id: generateId(),
          chatroomId,
          content: `This is an older message #${i + 1}`,
          sender: Math.random() > 0.5 ? "user" : "ai",
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last week
        }))

        set((state) => {
          const existingMessages = state.messages[chatroomId] || []
          return {
            messages: {
              ...state.messages,
              [chatroomId]: [...dummyMessages, ...existingMessages],
            },
          }
        })
      },
    }),
    {
      name: "chat-storage",
    },
  ),
)
