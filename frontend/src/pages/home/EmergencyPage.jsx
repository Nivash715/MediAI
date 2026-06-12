import { useState } from 'react'
import { Phone, AlertTriangle, MapPin, ChevronDown, ChevronUp, Siren } from 'lucide-react'
import { motion } from 'framer-motion'
import PageWrapper from '@components/layout/PageWrapper'

const EMERGENCY_SERVICES = [
  { name: 'Ambulance',        number: '108',  emoji: '🚑', color: 'from-red-500 to-red-700' },
  { name: 'Police',           number: '100',  emoji: '🚔', color: 'from-blue-500 to-blue-700' },
  { name: 'Fire',             number: '101',  emoji: '🚒', color: 'from-orange-500 to-orange-700' },
  { name: 'Poison Control',   number: '1800-11-6117', emoji: '☠️', color: 'from-purple-500 to-purple-700' },
  { name: 'Women Helpline',   number: '1091', emoji: '🆘', color: 'from-pink-500 to-pink-700' },
  { name: 'Child Helpline',   number: '1098', emoji: '👶', color: 'from-teal-500 to-teal-700' },
]

const FIRST_AID = [
  {
    title: 'Choking',
    steps: ['Ask if the person is choking', 'Give 5 back blows between shoulder blades', 'Give 5 abdominal thrusts (Heimlich)', 'Repeat until object expelled or unconscious'],
  },
  {
    title: 'Heart Attack',
    steps: ['Call 108 immediately', 'Have the person sit or lie down', 'Loosen tight clothing', 'Give aspirin if not allergic and available', 'Start CPR if unconscious and not breathing'],
  },
  {
    title: 'Severe Bleeding',
    steps: ['Apply firm direct pressure with clean cloth', 'Do not remove cloth — add more if soaked', 'Elevate the injured area above heart level', 'Seek emergency care immediately'],
  },
  {
    title: 'Burns',
    steps: ['Cool the burn under cool running water for 10 min', 'Do NOT use ice, butter, or toothpaste', 'Cover with clean non-fluffy material', 'Do not burst blisters — seek medical help'],
  },
]

export default function EmergencyPage() {
  const [expanded, setExpanded] = useState(null)

  return (
    <PageWrapper>
      {/* SOS Button */}
      <div className="flex flex-col items-center py-6 mb-6">
        <motion.a
          href="tel:108"
          whileTap={{ scale: 0.95 }}
          className="relative w-32 h-32 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-2xl cursor-pointer select-none"
        >
          {/* Pulse rings */}
          {[1,2,3].map((i) => (
            <span
              key={i}
              className="absolute rounded-full bg-red-500/30 animate-ping"
              style={{ width: `${100 + i * 40}%`, height: `${100 + i * 40}%`, animationDelay: `${i * 300}ms`, animationDuration: '1.5s' }}
            />
          ))}
          <div className="relative flex flex-col items-center gap-1">
            <Siren className="w-8 h-8 text-white" />
            <span className="text-white font-black text-lg">SOS</span>
          </div>
        </motion.a>
        <p className="text-xs text-gray-500 mt-3">Tap to call Ambulance (108)</p>
      </div>

      {/* Emergency numbers grid */}
      <h2 className="text-sm font-black text-gray-900 dark:text-white mb-3">Emergency Services</h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {EMERGENCY_SERVICES.map(({ name, number, emoji, color }) => (
          <a
            key={name}
            href={`tel:${number.replace(/-/g, '')}`}
            className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card active:scale-95 transition-all"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-xl flex-shrink-0`}>
              {emoji}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{name}</p>
              <p className="text-xs text-gray-500 flex items-center gap-0.5"><Phone className="w-2.5 h-2.5" />{number}</p>
            </div>
          </a>
        ))}
      </div>

      {/* First Aid Guides */}
      <h2 className="text-sm font-black text-gray-900 dark:text-white mb-3">First Aid Guides</h2>
      <div className="space-y-2">
        {FIRST_AID.map((guide) => (
          <div key={guide.title} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3"
              onClick={() => setExpanded(expanded === guide.title ? null : guide.title)}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">{guide.title}</span>
              </div>
              {expanded === guide.title ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {expanded === guide.title && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                className="px-4 pb-4 overflow-hidden"
              >
                <ol className="space-y-1.5">
                  {guide.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <span className="flex-shrink-0 w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold flex items-center justify-center mt-0.5">{i+1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}
