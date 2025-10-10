"use client";

import { useState, useRef, useEffect } from "react";
import { SectionHeading } from "../ui/section-heading";
import { GlassCard } from "../ui/glass-card";
import { Send, Sparkles, User, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestedQuestions = [
  "What's your experience with AI development?",
  "Are you a good fit for a React/Angular position?",
  "Tell me about your unique background",
  "What projects have you worked on recently?",
  "What's your experience with microservices?",
];

export function AIChatSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(10);
  const [limitReached, setLimitReached] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (question?: string) => {
    const messageText = question || input;
    if (!messageText.trim() || isLoading || limitReached) return;

    const userMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Update question count and limit status
      if (data.questionCount !== undefined) {
        setQuestionCount(data.questionCount);
      }
      if (data.maxQuestions !== undefined) {
        setMaxQuestions(data.maxQuestions);
      }
      if (data.limitReached) {
        setLimitReached(true);
      }
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section
      id="ai-chat"
      className="py-20 px-6 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:via-blue-950/10"
    >
      <div className="container mx-auto max-w-4xl">
        <SectionHeading
          title="Ask AI About Me"
          subtitle="Curious if I'm the right fit? Ask away!"
          centered
        />

        <GlassCard className="mt-16 p-0 overflow-hidden" hover={false}>
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6" aria-hidden="true" />
                <div>
                  <h3 className="font-bold text-lg">AI Assistant</h3>
                  <p className="text-sm opacity-90">
                    Ask me anything about Renato's experience and skills
                  </p>
                </div>
              </div>
              {questionCount > 0 && (
                <div
                  className="text-right"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <p className="text-sm font-semibold">
                    {questionCount}/{maxQuestions}
                  </p>
                  <p className="text-xs opacity-75">questions</p>
                </div>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div
            ref={chatContainerRef}
            className="h-[400px] overflow-y-auto p-6 space-y-4"
            role="log"
            aria-live="polite"
            aria-atomic="false"
            aria-label="Chat messages"
          >
            {messages.length === 0 && !limitReached && (
              <div className="text-center py-8">
                <Sparkles
                  className="w-12 h-12 mx-auto mb-4 text-purple-500"
                  aria-hidden="true"
                />
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start a conversation! Try one of these questions:
                </p>
                <div className="space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(question)}
                      disabled={limitReached}
                      className="block w-full text-left px-4 py-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 text-sm text-gray-700 dark:text-gray-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      aria-label={`Ask question: ${question}`}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center flex-shrink-0"
                      aria-hidden="true"
                    >
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                        : "glass"
                    }`}
                    role={message.role === "assistant" ? "article" : undefined}
                    aria-label={
                      message.role === "assistant"
                        ? "AI response"
                        : "Your message"
                    }
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <div
                      className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center flex-shrink-0"
                      aria-hidden="true"
                    >
                      <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
                role="status"
                aria-live="polite"
                aria-label="AI is typing"
              >
                <div
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="glass px-4 py-3 rounded-2xl">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            {limitReached ? (
              <div
                className="text-center py-4"
                role="status"
                aria-live="polite"
              >
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You've reached the question limit for this session.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Let's continue the conversation directly! 👇
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <label htmlFor="ai-chat-input" className="sr-only">
                  Ask a question about Renato's experience
                </label>
                <input
                  id="ai-chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about my experience, skills, or anything else..."
                  className="flex-1 px-4 py-3 rounded-2xl glass border-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-gray-200"
                  disabled={isLoading}
                  aria-describedby="ai-chat-description"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-2xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" aria-hidden="true" />
                </button>
              </form>
            )}
          </div>
        </GlassCard>

        <p
          className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6"
          id="ai-chat-description"
        >
          Powered by AI • Responses based on my resume and experience
        </p>
      </div>
    </section>
  );
}
