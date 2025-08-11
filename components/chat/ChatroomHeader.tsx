'use client';

import React from 'react';
import { Chatroom } from '@/utils/types';
import { useRouter } from 'next/navigation';

interface ChatroomHeaderProps {
  chatroom: Chatroom;
}

const ChatroomHeader: React.FC<ChatroomHeaderProps> = ({ chatroom }) => {
  const router = useRouter();

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-4">
      <button onClick={() => router.push('/dashboard')} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
        &larr;
      </button>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {chatroom.title}
      </h2>
    </div>
  );
};

export default ChatroomHeader;