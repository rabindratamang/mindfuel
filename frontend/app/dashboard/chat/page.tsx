"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, User, Heart, Brain, Sparkles, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AnimatedIcon } from "@/components/animated-icon"
import { apiClient } from "@/lib/api-client"

interface Message {
  id: string
  chatId: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  mood?: string
  suggestions?: string[]
  resources?: Array<{
    title: string
    type: "video" | "article" | "playlist"
    url: string
  }>
}

interface ChatResponse {
  message: string
  mood?: string
  suggestions?: string[]
  resources?: Array<{
    title: string
    type: "video" | "article" | "playlist"
    url: string
  }>
}

export default function ChatPage() {
  const [chatId, setChatId] = useState<string>("")
  const [isInitializing, setIsInitializing] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    initializeChat()
  }, [])

  const initializeChat = async () => {
    try {
      setIsInitializing(true)
      const response = await apiClient.post<{ chatId: string }>("/chat/initialize")
      setChatId(response.chatId)

      setMessages([
        {
          id: "welcome",
          chatId: response.chatId,
          content:
            "Hello! I'm MindFuel AI, your compassionate mental wellness companion. I'm here to listen, support, and guide you on your journey to better mental health. How are you feeling today? 💙",
          sender: "ai",
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error("Failed to initialize chat:", error)
      // Fallback to local chatId
      const fallbackChatId = `chat_${Date.now()}`
      setChatId(fallbackChatId)
      setMessages([
        {
          id: "welcome",
          chatId: fallbackChatId,
          content:
            "Hello! I'm MindFuel AI, your compassionate mental wellness companion. I'm here to listen, support, and guide you on your journey to better mental health. How are you feeling today? 💙",
          sender: "ai",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsInitializing(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !chatId) return

    const userMessage: Message = {
      id: Date.now().toString(),
      chatId: chatId,
      content: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)
    setIsTyping(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const response = await apiClient.post<ChatResponse>(`/chat/${chatId}/message`, {
        message: userMessage.content,
        context: {
          recentMessages: messages.slice(-5).map((m) => ({
            content: m.content,
            sender: m.sender,
            mood: m.mood || "",
            suggestions: m.suggestions || [],
            resources: m.resources || [],
          })),
        },
      })

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        chatId: chatId,
        content: response.message,
        sender: "ai",
        timestamp: new Date(),
        mood: response.mood,
        suggestions: response.suggestions,
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        chatId: chatId,
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again in a moment. If you're in crisis, please reach out to the 988 Suicide & Crisis Lifeline or your local emergency services. 💙",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    textareaRef.current?.focus()
  }

  if (isInitializing) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-teal-950/30">
        <div className="text-center space-y-4">
          <AnimatedIcon icon={Brain} hoverEffect="pulse" color="#14b8a6" size={48} />
          <p className="text-slate-600 dark:text-slate-400">Initializing your chat session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-teal-950/30">
      {/* Header */}
      <motion.div
        className="flex-shrink-0 p-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <AnimatedIcon icon={Brain} hoverEffect="pulse" color="#14b8a6" size={32} />
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              MindFuel AI
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Your mental wellness companion</p>
          </div>
        </div>
      </motion.div>

      {/* Crisis Alert */}
      <motion.div
        className="flex-shrink-0 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Alert className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Crisis Support:</strong> If you're having thoughts of self-harm, please call{" "}
            <a href="tel:988" className="font-semibold underline hover:no-underline">
              988
            </a>{" "}
            or your local emergency services immediately.
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gradient-to-br from-teal-500 to-blue-500 text-white"
                  }`}
                >
                  {message.sender === "user" ? <User size={16} /> : <Brain size={16} />}
                </div>

                {/* Message Content */}
                <div className="space-y-2">
                  <Card
                    className={`p-4 ${
                      message.sender === "user"
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    {message.mood && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          <Heart size={12} className="mr-1" />
                          Detected mood: {message.mood}
                        </Badge>
                      </div>
                    )}
                  </Card>

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Sparkles size={12} />
                        Suggested responses:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            className="text-xs h-auto py-1 px-2 hover:bg-teal-50 hover:border-teal-300 dark:hover:bg-teal-950"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="flex gap-3 max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 text-white flex items-center justify-center">
                  <Brain size={16} />
                </div>
                <Card className="p-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-teal-500 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div
        className="flex-shrink-0 p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind... I'm here to listen and support you 💙"
              className="min-h-[60px] max-h-[120px] resize-none border-slate-300 dark:border-slate-600 focus:border-teal-500 dark:focus:border-teal-400 rounded-xl"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="h-[60px] px-6 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Send size={20} />
            </motion.div>
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "I'm feeling anxious today",
            "Help me with sleep",
            "I need motivation",
            "Feeling overwhelmed",
            "Share a breathing exercise",
          ].map((quickAction) => (
            <Button
              key={quickAction}
              variant="ghost"
              size="sm"
              className="text-xs h-auto py-1 px-3 text-slate-600 dark:text-slate-400 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-950 dark:hover:text-teal-300 rounded-full"
              onClick={() => handleSuggestionClick(quickAction)}
            >
              {quickAction}
            </Button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
