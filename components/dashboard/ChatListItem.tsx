'use client';

import React from 'react';
import Link from 'next/link';
import { Chatroom } from '@/utils/types';
import { useChatStore } from '@/store/chatStore';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ChatListItemProps {
  chatroom: Chatroom;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chatroom }) => {
  const deleteChatroom = useChatStore((state) => state.deleteChatroom);
  const router = useRouter();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteChatroom(chatroom.id);
    toast.error(`Chat "${chatroom.title}" deleted.`);
    router.push('/dashboard');
  };

  return (
    <Link href={`/dashboard/chat/${chatroom.id}`} passHref>
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <span className="text-gray-900 dark:text-gray-100 font-medium truncate">
          {chatroom.title}
        </span>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700"
          title="Delete Chat"
        >
          &times;
        </button>
      </div>
    </Link>
  );
};

export default ChatListItem;