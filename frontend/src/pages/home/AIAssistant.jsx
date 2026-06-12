import { useState, useRef, useEffect } from 'react'
import { Send, Mic, Bot, User, Loader2, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { aiService } from '@services/aiService'
import PageWrapper from '@components/layout/PageWrapper'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'mr', label: 'मराठी' },
]

const QUICK_PROMPTS = [
  'What are the side effects of Paracetamol?',
  'How to manage high blood pressure?',
  'Can I take ibuprofen with antibiotics?',
  'What foods should I avoid with diabetes?',
]

const WELCOME = {
  role: 'assistant',
  content: "Hi! I'm MediAI, your personal health assistant. I can help with medicine information, symptoms, dosage guidance, and more. What would you like to know today?",
  id: 'welcome',
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [lang, setLang] = useState('en')
  const bottomRef = useRef(null)

  const chatMutation = useMutation({
    mutationFn: (msgs) => aiService.chat(msgs),
    onSuccess: (res) => {
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.message, id: Date.now() + 'a' }])
    },
    onError: () => {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.', id: Date.now() + 'e' }])
    },
  })

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, chatMutation.isPending])

  const send = (text) => {
    const t = text.trim()
    if (!t || chatMutation.isPending) return
    const newMsg = { role: 'user', content: t, id: Date.now() }
    const updated = [...messages, newMsg]
    setMessages(updated)
    setInput('')
    chatMutation.mutate(updated.filter((m) => m.role !== 'welcome').map(({ role, content }) => ({ role, content })))
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100dvh - var(--nav-height) - var(--bottom-nav) - var(--safe-bottom))' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">MediAI Assistant</p>
            <p className="text-[10px] text-green-500 font-medium">● Online</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 rounded-xl px-2 py-1.5">
          <Globe className="w-3.5 h-3.5 text-gray-500" />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="text-xs bg-transparent text-gray-600 dark:text-gray-300 outline-none"
          >
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50 dark:bg-gray-950">
        {/* Quick prompts (initial state) */}
        {messages.length === 1 && (
          <div className="grid grid-cols-1 gap-2 mb-4">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="text-left text-xs px-3 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-primary-300 hover:text-primary-600 transition-all"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center ${
              msg.role === 'user'
                ? 'bg-primary-100 dark:bg-primary-900/30'
                : 'bg-gradient-to-br from-purple-500 to-pink-500'
            }`}>
              {msg.role === 'user'
                ? <User className="w-3.5 h-3.5 text-primary-600" />
                : <Bot className="w-3.5 h-3.5 text-white" />}
            </div>
            <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-primary-600 text-white rounded-tr-sm'
                : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-800 rounded-tl-sm'
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {chatMutation.isPending && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 border border-gray-100 dark:border-gray-800">
              {[0,1,2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send(input))}
            placeholder="Ask about medicines, symptoms…"
            className="flex-1 text-sm bg-transparent text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none"
          />
          <button className="text-gray-400 hover:text-primary-600 transition-colors">
            <Mic className="w-4 h-4" />
          </button>
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || chatMutation.isPending}
            className="w-8 h-8 rounded-xl bg-primary-600 disabled:opacity-40 flex items-center justify-center active:scale-90 transition-all"
          >
            {chatMutation.isPending ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
          </button>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-1.5">MediAI can make mistakes. Verify important medical info.</p>
      </div>
    </div>
  )
}
