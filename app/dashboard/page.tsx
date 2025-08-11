'use client';

import React, { useState } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useDebounce } from '@/hooks/useDebounce';
import { useRouter } from 'next/navigation';
import ChatListItem from '@/components/dashboard/ChatListItem';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const chatrooms = useChatStore((state) => state.chatrooms);
  const addChatroom = useChatStore((state) => state.addChatroom);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleCreateChat = () => {
    const newChatTitle = `New Chat ${chatrooms.length + 1}`;
    addChatroom(newChatTitle);
    toast.success('New chatroom created!');
    const newRoom = chatrooms.find(room => room.title === newChatTitle);
    if (newRoom) {
      router.push(`/chat/${newRoom.id}`);
    }
  };

  const filteredChatrooms = chatrooms.filter(room =>
    room.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Chats
        </h1>
        <input
          type="text"
          placeholder="Search chats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-4 w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleCreateChat}
          className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          + New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="p-4 space-y-2">
          {filteredChatrooms.length > 0 ? (
            filteredChatrooms.map((room) => (
              <ChatListItem key={room.id} chatroom={room} />
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No chatrooms found.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;