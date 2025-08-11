'use client';

import React from 'react';
import { useChatStore } from '@/store/chatStore';
import ChatMessage from './ChatMessage';
import Skeleton from '../ui/Skeleton';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Message } from '@/utils/types';

const ITEMS_PER_PAGE = 20;

const MessageList: React.FC<{ chatroomId: string }> = ({ chatroomId }) => {
  const chatroom = useChatStore((state) => state.getChatroomById(chatroomId));
  const { visibleItems, loadingRef, hasMore } = useInfiniteScroll(
    chatroom?.messages || [], 
    ITEMS_PER_PAGE
  );

  return (
    <>
      {visibleItems.length > 0 ? (
        visibleItems.map((message: Message) => (
          <ChatMessage key={message.id} message={message} />
        ))
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">
          Start a conversation!
        </div>
      )}
      {hasMore && (
        <div ref={loadingRef} className="flex justify-center my-4">
          <Skeleton />
        </div>
      )}
    </>
  );
};

export default MessageList;