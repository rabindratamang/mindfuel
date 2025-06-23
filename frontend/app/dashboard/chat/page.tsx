"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, User, Heart, Brain, Sparkles, AlertCircle, ThumbsUp, Copy, RefreshCw } from "lucide-react"
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

// Simple markdown parser component
function MarkdownText({ content }: { content: string }) {
  const parseMarkdown = (text: string) => {
    // Split by lines to handle different markdown elements
    const lines = text.split("\n")
    const elements: any[] = []

    lines.forEach((line, index) => {
      if (line.trim() === "") {
        elements.push(<br key={`br-${index}`} />)
        return
      }

      // Headers
      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={index} className="text-lg font-semibold mt-3 mb-2 text-teal-600 dark:text-teal-400">
            {line.replace("### ", "")}
          </h3>,
        )
        return
      }

      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={index} className="text-xl font-bold mt-4 mb-2 text-teal-700 dark:text-teal-300">
            {line.replace("## ", "")}
          </h2>,
        )
        return
      }

      // Lists
      if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(
          <div key={index} className="flex items-start gap-2 my-1">
            <span className="text-teal-500 mt-1">•</span>
            <span>{parseInlineMarkdown(line.replace(/^[-*] /, ""))}</span>
          </div>,
        )
        return
      }

      // Numbered lists
      if (/^\d+\. /.test(line)) {
        const number = line.match(/^(\d+)\. /)?.[1]
        elements.push(
          <div key={index} className="flex items-start gap-2 my-1">
            <span className="text-teal-500 font-medium min-w-[20px]">{number}.</span>
            <span>{parseInlineMarkdown(line.replace(/^\d+\. /, ""))}</span>
          </div>,
        )
        return
      }

      // Regular paragraphs
      elements.push(
        <p key={index} className="my-2">
          {parseInlineMarkdown(line)}
        </p>,
      )
    })

    return elements
  }

  const parseInlineMarkdown = (text: string) => {
    const parts: any[] = []
    let currentText = text
    let keyCounter = 0

    // Bold text **text**
    currentText = currentText.replace(/\*\*(.*?)\*\*/g, (match, content) => {
      const key = `bold-${keyCounter++}`
      parts.push(
        <strong key={key} className="font-semibold text-slate-900 dark:text-slate-100">
          {content}
        </strong>,
      )
      return `__PLACEHOLDER_${key}__`
    })

    // Italic text *text*
    currentText = currentText.replace(/\*(.*?)\*/g, (match, content) => {
      const key = `italic-${keyCounter++}`
      parts.push(
        <em key={key} className="italic text-slate-700 dark:text-slate-300">
          {content}
        </em>,
      )
      return `__PLACEHOLDER_${key}__`
    })

    // Code `code`
    currentText = currentText.replace(/`(.*?)`/g, (match, content) => {
      const key = `code-${keyCounter++}`
      parts.push(
        <code
          key={key}
          className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-sm font-mono text-teal-600 dark:text-teal-400"
        >
          {content}
        </code>,
      )
      return `__PLACEHOLDER_${key}__`
    })

    // Split by placeholders and reconstruct
    const textParts = currentText.split(/(__PLACEHOLDER_.*?__)/g)
    const result: any[] = []

    textParts.forEach((part, index) => {
      if (part.startsWith("__PLACEHOLDER_")) {
        const key = part.replace(/__PLACEHOLDER_|__/g, "")
        const component = parts.find((p) => typeof p === "object" && p.key === key)
        if (component) result.push(component)
      } else if (part) {
        result.push(<span key={`text-${index}`}>{part}</span>)
      }
    })

    return result.length > 0 ? result : text
  }

  return <div className="markdown-content">{parseMarkdown(content)}</div>
}

export default function ChatPage() {
  const [chatId, setChatId] = useState<string>("")
  const [isInitializing, setIsInitializing] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
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
            "Hello! I'm **MindFuel AI**, your compassionate mental wellness companion. 🧠💙\n\nI'm here to:\n- Listen without judgment\n- Provide personalized support\n- Guide you on your wellness journey\n- Help you understand your emotions\n\nHow are you feeling today? *I'm genuinely here to help.* ✨",
          sender: "ai",
          timestamp: new Date(),
          suggestions: [
            "I'm feeling anxious",
            "I had a good day",
            "I'm struggling with sleep",
            "I need some motivation",
          ],
        },
      ])
    } catch (error) {
      console.error("Failed to initialize chat:", error)
      const fallbackChatId = `chat_${Date.now()}`
      setChatId(fallbackChatId)
      setMessages([
        {
          id: "welcome",
          chatId: fallbackChatId,
          content:
            "Hello! I'm **MindFuel AI**, your compassionate mental wellness companion. 🧠💙\n\nI'm here to:\n- Listen without judgment\n- Provide personalized support\n- Guide you on your wellness journey\n- Help you understand your emotions\n\nHow are you feeling today? *I'm genuinely here to help.* ✨",
          sender: "ai",
          timestamp: new Date(),
          suggestions: [
            "I'm feeling anxious",
            "I had a good day",
            "I'm struggling with sleep",
            "I need some motivation",
          ],
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
    setShowSuggestions(false)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

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

      // Show suggestions after AI response
      setTimeout(() => setShowSuggestions(true), 1000)
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        chatId: chatId,
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again in a moment. 🔄\n\n**If you're in crisis**, please reach out to:\n- **988 Suicide & Crisis Lifeline**\n- Your local emergency services\n\n*You're not alone, and help is available.* 💙",
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

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const reactToMessage = (messageId: string) => {
    // Add reaction logic here
    console.log("Reacted to message:", messageId)
  }

  if (isInitializing) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-teal-950/30">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <AnimatedIcon icon={Brain} hoverEffect="pulse" color="#14b8a6" size={48} />
          </motion.div>
          <motion.p
            className="text-slate-600 dark:text-slate-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            Initializing your wellness companion...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-teal-950/30 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-teal-200/20 dark:bg-teal-800/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 2,
            }}
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        className="flex-shrink-0 p-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm relative z-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <AnimatedIcon icon={Brain} hoverEffect="pulse" color="#14b8a6" size={32} />
            </motion.div>
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
          <div>
            <motion.h1
              className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              MindFuel AI
            </motion.h1>
            <motion.p
              className="text-sm text-slate-600 dark:text-slate-400"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              Your mental wellness companion
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Crisis Alert */}
      <motion.div
        className="flex-shrink-0 p-4 relative z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Alert className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/20 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <AlertCircle className="h-4 w-4 text-amber-600 relative z-10" />
          <AlertDescription className="text-sm text-amber-800 dark:text-amber-200 relative z-10">
            <strong>Crisis Support:</strong> If you're having thoughts of self-harm, please call{" "}
            <a href="tel:988" className="font-semibold underline hover:no-underline">
              988
            </a>{" "}
            or your local emergency services immediately.
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <motion.div
                className={`flex gap-3 max-w-[85%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {/* Avatar */}
                <motion.div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.sender === "user"
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                      : "bg-gradient-to-br from-teal-500 to-blue-500 text-white"
                  }`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {message.sender === "user" ? <User size={18} /> : <Brain size={18} />}
                </motion.div>

                {/* Message Content */}
                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, x: message.sender === "user" ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ delay: 0.1 }}
                  >
                    <Card
                      className={`p-4 relative overflow-hidden ${
                        message.sender === "user"
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-shadow"
                      }`}
                    >
                      {message.sender === "ai" && (
                        <motion.div
                          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-blue-500"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                        />
                      )}

                      <div className="text-sm leading-relaxed">
                        {message.sender === "ai" ? (
                          <MarkdownText content={message.content} />
                        ) : (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>

                      {message.mood && (
                        <motion.div
                          className="mt-3"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Badge
                            variant="secondary"
                            className="text-xs bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300"
                          >
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            >
                              <Heart size={12} className="mr-1" />
                            </motion.div>
                            Detected mood: {message.mood}
                          </Badge>
                        </motion.div>
                      )}

                      {/* Message Actions */}
                      {message.sender === "ai" && (
                        <motion.div
                          className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs hover:bg-teal-50 dark:hover:bg-teal-950"
                            onClick={() => reactToMessage(message.id)}
                          >
                            <ThumbsUp size={12} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-700"
                            onClick={() => copyMessage(message.content)}
                          >
                            <Copy size={12} />
                          </Button>
                        </motion.div>
                      )}
                    </Card>
                  </motion.div>

                  {/* Suggestions */}
                  <AnimatePresence>
                    {message.suggestions && message.suggestions.length > 0 && showSuggestions && (
                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: 0.5 }}
                      >
                        <motion.p
                          className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1"
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          <Sparkles size={12} />
                          Suggested responses:
                        </motion.p>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.6 + idx * 0.1 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-auto py-2 px-3 hover:bg-teal-50 hover:border-teal-300 dark:hover:bg-teal-950 transition-all duration-200 hover:shadow-md"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.p
                    className="text-xs text-slate-500 dark:text-slate-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </motion.p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Enhanced Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="flex justify-start"
            >
              <div className="flex gap-3 max-w-[80%]">
                <motion.div
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 text-white flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Brain size={18} />
                </motion.div>
                <Card className="p-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-teal-500 rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1.2,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                    <motion.span
                      className="text-xs text-slate-500 dark:text-slate-400"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      MindFuel is thinking...
                    </motion.span>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Input */}
      <motion.div
        className="flex-shrink-0 p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind... I'm here to listen and support you 💙"
                className="min-h-[60px] max-h-[120px] resize-none border-slate-300 dark:border-slate-600 focus:border-teal-500 dark:focus:border-teal-400 rounded-xl transition-all duration-200 focus:shadow-lg"
                disabled={isLoading}
              />
            </motion.div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="h-[60px] px-6 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              <motion.div
                whileHover={{ rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                animate={isLoading ? { rotate: 360 } : {}}
                transition={
                  isLoading ? { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" } : { duration: 0.2 }
                }
              >
                {isLoading ? <RefreshCw size={20} /> : <Send size={20} />}
              </motion.div>
            </Button>
          </motion.div>
        </div>

        {/* Enhanced Quick Actions */}
        <motion.div
          className="mt-3 flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {[
            "I'm feeling anxious today",
            "Help me with sleep",
            "I need motivation",
            "Feeling overwhelmed",
            "Share a quiet exercise",
          ].map((quickAction, index) => (
            <motion.div
              key={quickAction}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-auto py-2 px-3 text-slate-600 dark:text-slate-400 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-950 dark:hover:text-teal-300 rounded-full transition-all duration-200 hover:shadow-md border border-transparent hover:border-teal-200 dark:hover:border-teal-800"
                onClick={() => handleSuggestionClick(quickAction)}
              >
                {quickAction}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
