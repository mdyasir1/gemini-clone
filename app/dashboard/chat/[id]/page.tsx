'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useChatStore } from '@/store/chatStore';
import ChatInput from '@/components/chat/ChatInput';
import MessageList from '@/components/chat/MessageList';
import TypingIndicator from '@/components/chat/TypingIndicator';
import { getFakeAiReply } from '@/utils/helpers';
import { Message } from '@/utils/types';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import ChatroomHeader from '@/components/chat/ChatroomHeader';

const ChatroomPage: React.FC = () => {
  const { id } = useParams();
  const chatId = Array.isArray(id) ? id[0] : id;
  useAuth();
  const getChatroomById = useChatStore((state) => state.getChatroomById);
  const addMessage = useChatStore((state) => state.addMessage);

  const chatroom = chatId ? getChatroomById(chatId) : undefined;
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatroom?.messages]);

  const handleSendMessage = async (content: string, image?: string) => {
    if (!chatId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      image: image || null,
    };
    addMessage(chatId, userMessage);
    toast.success("Message sent!");

    setIsTyping(true);
    const aiMessage = await getFakeAiReply(content);
    addMessage(chatId, aiMessage);
    setIsTyping(false);
  };
  
  // This is the critical change.
  if (!chatroom || !chatId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Loading or chatroom not found...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <ChatroomHeader chatroom={chatroom} />
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col-reverse">
        <div ref={chatBottomRef} />
        {isTyping && <TypingIndicator />}
        {/* Now `chatId` is guaranteed to be a string */}
        <MessageList chatroomId={chatId} />
      </div>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatroomPage;