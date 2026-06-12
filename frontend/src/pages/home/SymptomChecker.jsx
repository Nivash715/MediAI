import { useState, useRef } from 'react'
import { Mic, MicOff, Send, AlertTriangle, CheckCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import { aiService } from '@services/aiService'
import PageWrapper from '@components/layout/PageWrapper'
import Button from '@components/common/Button'
import Badge from '@components/common/Badge'
import { symptomSchema } from '@utils/validators'

const QUICK_SYMPTOMS = ['Fever', 'Headache', 'Cold & Cough', 'Stomach pain', 'Body ache', 'Sore throat', 'Nausea', 'Fatigue']

const SEVERITY_CONFIG = {
  mild:     { label: 'Mild',     variant: 'success', icon: CheckCircle },
  moderate: { label: 'Moderate', variant: 'warning', icon: AlertTriangle },
  severe:   { label: 'Severe',   variant: 'danger',  icon: AlertTriangle },
}

export default function SymptomChecker() {
  const [tags, setTags] = useState([])
  const [result, setResult] = useState(null)
  const [listening, setListening] = useState(false)
  const inputRef = useRef(null)

  const { register, handleSubmit, setValue, watch, reset } = useForm({
    resolver: zodResolver(symptomSchema),
    defaultValues: { symptoms: '' },
  })

  const analyzeMutation = useMutation({
    mutationFn: (data) => aiService.analyzeSymptoms(data),
    onSuccess: (res) => setResult(res.data),
    onError: () => toast.error('Analysis failed. Please try again.'),
  })

  const addTag = (s) => {
    if (!tags.includes(s)) {
      const newTags = [...tags, s]
      setTags(newTags)
      setValue('symptoms', newTags.join(', '))
    }
  }

  const removeTag = (s) => {
    const newTags = tags.filter((t) => t !== s)
    setTags(newTags)
    setValue('symptoms', newTags.join(', '))
  }

  const onSubmit = (data) => {
    analyzeMutation.mutate({ symptoms: data.symptoms, tags })
  }

  const severityInfo = result ? (SEVERITY_CONFIG[result.severity] || SEVERITY_CONFIG.mild) : null

  return (
    <PageWrapper>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center shadow-medical">
          <span className="text-xl">🩺</span>
        </div>
        <div>
          <h1 className="text-lg font-black text-gray-900 dark:text-white">AI Symptom Checker</h1>
          <p className="text-xs text-gray-500">Powered by GPT-4 · For informational use only</p>
        </div>
      </div>

      {/* Quick symptoms */}
      <div className="flex flex-wrap gap-2 mb-4">
        {QUICK_SYMPTOMS.map((s) => (
          <button
            key={s}
            onClick={() => addTag(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              tags.includes(s)
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/30'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((t) => (
            <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-semibold">
              {t}
              <button onClick={() => removeTag(t)} className="text-primary-400 hover:text-primary-600 ml-0.5">×</button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit(onSubmit)} className="relative mb-4">
        <textarea
          {...register('symptoms')}
          ref={inputRef}
          rows={3}
          placeholder="Describe your symptoms in detail… e.g. 'I have a fever since yesterday with body aches'"
          className="input resize-none pr-20"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setListening((v) => !v)}
            className={`p-2 rounded-xl transition-all ${listening ? 'bg-red-100 text-red-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}
          >
            {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            type="submit"
            disabled={analyzeMutation.isPending}
            className="p-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700 active:scale-90 transition-all disabled:opacity-50"
          >
            {analyzeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>

      <Button fullWidth loading={analyzeMutation.isPending} onClick={handleSubmit(onSubmit)}>
        Analyze Symptoms
      </Button>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
            {/* Severity */}
            <div className={`p-4 rounded-2xl border ${result.severity === 'severe' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20' : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20'}`}>
              <div className="flex items-center gap-2">
                <severityInfo.icon className={`w-5 h-5 ${result.severity === 'severe' ? 'text-red-500' : 'text-amber-500'}`} />
                <span className="font-bold text-sm text-gray-900 dark:text-white">Severity: </span>
                <Badge variant={severityInfo.variant}>{severityInfo.label}</Badge>
              </div>
              {result.warning && <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{result.warning}</p>}
            </div>

            {/* Possible conditions */}
            {result.conditions?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3">Possible Conditions</h3>
                <div className="space-y-3">
                  {result.conditions.map((c) => (
                    <div key={c.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{c.name}</span>
                        <span className="text-gray-500">{c.confidence}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-teal-400" style={{ width: `${c.confidence}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended medicines */}
            {result.medicines?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3">Suggested Medicines</h3>
                <div className="space-y-2">
                  {result.medicines.map((m) => (
                    <div key={m.name} className="flex items-center justify-between py-2 border-b last:border-0 border-gray-100 dark:border-gray-800">
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">{m.name}</p>
                        {m.dosage && <p className="text-xs text-gray-500">{m.dosage}</p>}
                      </div>
                      {m.requiresPrescription && <Badge variant="warning">Rx</Badge>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-gray-400 text-center italic">
              This AI analysis is for informational purposes only. Please consult a doctor for diagnosis.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}
