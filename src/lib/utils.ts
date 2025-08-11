import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date)
}

export function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return "Today"
  } else if (days === 1) {
    return "Yesterday"
  } else if (days < 7) {
    return `${days} days ago`
  } else {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date)
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = text
    textArea.style.position = "absolute"
    textArea.style.left = "-999999px"
    document.body.prepend(textArea)
    textArea.select()
    try {
      document.execCommand("copy")
    } catch (error) {
      console.error(error)
    } finally {
      textArea.remove()
    }
    return Promise.resolve()
  }
}

// Simulate AI responses with realistic delays
export function generateAIResponse(): Promise<string> {
  const responses = [
    "That's an interesting question! Let me think about that for a moment.",
    "I understand what you're asking. Here's my perspective on this topic.",
    "Great point! I'd be happy to help you with that.",
    "That's a thoughtful question. Let me provide you with some insights.",
    "I see what you mean. Here's how I would approach this.",
    "Thanks for sharing that with me. I have some thoughts on this.",
    "That's a complex topic. Let me break it down for you.",
    "I appreciate you asking. Here's what I think about this situation.",
    "Interesting! I'd love to explore this topic with you further.",
    "That's a good observation. Let me share my thoughts on this.",
  ]

  return new Promise((resolve) => {
    const delay = Math.random() * 2000 + 1000 // 1-3 seconds
    setTimeout(() => {
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      resolve(randomResponse)
    }, delay)
  })
}

export function validatePhoneNumber(phone: string, countryCode: string): boolean {
  // Basic phone number validation
  const phoneRegex = /^\d{7,15}$/
  return phoneRegex.test(phone.replace(/\s+/g, ""))
}

export function formatPhoneNumber(phone: string): string {
  // Simple phone number formatting
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length >= 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
  }
  return phone
}
