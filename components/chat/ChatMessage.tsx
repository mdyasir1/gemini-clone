'use client';

import React, { useState } from 'react';
import { Message } from '@/utils/types';
import { formatTimestamp } from '@/utils/helpers';
import toast from 'react-hot-toast';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast.success('Message copied!');
  };

  return (
    <div
      className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative max-w-sm px-4 py-2 rounded-lg break-words
          ${isUser
            ? 'bg-indigo-500 text-white rounded-br-none'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
          }
        `}
      >
        {message.image && (
          // Naive image handling, but serves the purpose
          <img src={message.image} alt="Uploaded" className="max-w-full rounded-md mb-2" />
        )}
        {message.content && <p>{message.content}</p>}
        <span className="block text-xs mt-1 text-gray-500 dark:text-gray-400">
          {formatTimestamp(message.timestamp)}
        </span>
        {isHovered && (
          <button
            onClick={handleCopy}
            className="absolute top-1 right-1 text-xs text-gray-400 hover:text-white"
            title="Copy to clipboard"
          >
            📋
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;