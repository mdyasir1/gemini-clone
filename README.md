# Gemini Frontend Clone - Kuvaka Tech Assignment

A fully functional, responsive Gemini-style conversational AI chat application built with Next.js 15, TypeScript, and modern React patterns.

## 🚀 Live Demo
[Live Deployment Link](https://your-deployment-url.vercel.app)

## 📋 Features

### Authentication
- OTP-based login/signup with country code selection
- Country data fetched from restcountries.com API
- Simulated OTP sending and validation
- Form validation using React Hook Form + Zod

### Dashboard
- List of user chatrooms
- Create and delete chatrooms
- Toast notifications for all actions
- Debounced search to filter chatrooms

### Chat Interface
- Real-time chat UI with user and AI messages
- Timestamps for all messages
- "Gemini is typing..." indicator
- Throttled AI responses with realistic delays
- Auto-scroll to latest messages
- Reverse infinite scroll for message history
- Client-side pagination (20 messages per page)
- Image upload support with preview
- Copy-to-clipboard on message hover

### Global UX
- Fully responsive mobile design
- Dark/Light mode toggle
- Loading skeletons for better UX
- localStorage persistence for auth and chat data
- Keyboard accessibility
- Toast notifications for user feedback

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **State Management**: Zustand
- **Form Validation**: React Hook Form + Zod
- **Styling**: Tailwind CSS
- **Notifications**: react-hot-toast
- **Dark Mode**: next-themes
- **Deployment**: Vercel

## 🚀 Setup & Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd gemini-chat-clone
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

\`\`\`
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── chat/              # Chat interface
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── auth/             # Auth-specific components
│   ├── chat/             # Chat-specific components
│   └── common/           # Common components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── store/                # Zustand store
└── types/                # TypeScript type definitions
\`\`\`

## 🔧 Key Implementation Details

### Throttling & AI Responses
- AI responses are throttled using setTimeout with random delays (1-3 seconds)
- Typing indicator shows during response generation
- Responses are generated from a pool of realistic AI-style replies

### Pagination & Infinite Scroll
- Messages are paginated client-side (20 per page)
- Reverse infinite scroll loads older messages when scrolling to top
- Smooth scrolling behavior with auto-scroll to latest messages

### Form Validation
- Zod schemas for type-safe validation
- React Hook Form for form state management
- Real-time validation feedback
- Country code validation for phone numbers

### State Management
- Zustand stores for auth, chat, and UI state
- localStorage persistence for data retention
- Optimistic updates for better UX

## 🎨 UI/UX Features

- Clean, modern interface inspired by Google's Gemini
- Smooth animations and transitions
- Loading states and skeletons
- Error handling with user-friendly messages
- Accessible keyboard navigation
- Mobile-first responsive design

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)

## 🌙 Dark Mode

Toggle between light and dark themes with persistent preference storage.

## 🔐 Authentication Flow

1. User enters phone number with country code
2. OTP is "sent" (simulated with setTimeout)
3. User enters OTP for verification
4. Authentication state is persisted in localStorage

## 💬 Chat Features

- Real-time message display
- Image upload with preview
- Message timestamps
- Copy message functionality
- Typing indicators
- Message history with pagination

## 🚀 Deployment

The application is deployed on Vercel with automatic deployments from the main branch.

## 📝 Notes

This project demonstrates modern React patterns, TypeScript usage, and responsive design principles while maintaining clean, readable code structure suitable for a frontend developer with 1+ years of experience.
