import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { Chatroom, Message } from '@/utils/types';

interface ChatState {
  chatrooms: Chatroom[];
  addChatroom: (title: string) => void;
  deleteChatroom: (id: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  getChatroomById: (id: string) => Chatroom | undefined;
}

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set, get) => ({
        chatrooms: [],
        addChatroom: (title) => {
          const newChatroom = {
            id: Date.now().toString(),
            title,
            messages: [],
            createdAt: new Date().toISOString(),
          };
          set((state) => ({ chatrooms: [newChatroom, ...state.chatrooms] }));
        },
        deleteChatroom: (id) => {
          set((state) => ({
            chatrooms: state.chatrooms.filter((room) => room.id !== id),
          }));
        },
        addMessage: (chatId, message) => {
          set((state) => ({
            chatrooms: state.chatrooms.map((room) =>
              room.id === chatId
                ? { ...room, messages: [...room.messages, message] }
                : room
            ),
          }));
        },
        getChatroomById: (id) => {
          return get().chatrooms.find((room) => room.id === id);
        },
      }),
      {
        name: 'chat-storage',
      }
    )
  )
);