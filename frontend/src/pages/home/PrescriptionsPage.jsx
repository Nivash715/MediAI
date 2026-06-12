import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload, FileText, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from '@services/api'
import { API_ENDPOINTS } from '@config/api.config'
import PageWrapper from '@components/layout/PageWrapper'
import Badge from '@components/common/Badge'
import { formatDate } from '@utils/helpers'

const STATUS_MAP = {
  verified:  { variant: 'success', icon: CheckCircle, label: 'Verified' },
  pending:   { variant: 'warning', icon: Clock,       label: 'Pending' },
  rejected:  { variant: 'danger',  icon: XCircle,     label: 'Rejected' },
}

export default function PrescriptionsPage() {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)
  const qc = useQueryClient()

  const { data: prescriptions = [] } = useQuery({
    queryKey: ['prescriptions'],
    queryFn: () => axios.get(API_ENDPOINTS.PRESCRIPTIONS),
    select: (r) => r.data,
  })

  const uploadMutation = useMutation({
    mutationFn: (file) => {
      const fd = new FormData()
      fd.append('file', file)
      return axios.post(API_ENDPOINTS.PRESCRIPTIONS, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    },
    onSuccess: () => { toast.success('Prescription uploaded!'); qc.invalidateQueries(['prescriptions']) },
    onError: () => toast.error('Upload failed. Please try again.'),
  })

  const handleFile = (file) => {
    if (!file) return
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      toast.error('Only JPG, PNG, or PDF allowed'); return
    }
    uploadMutation.mutate(file)
  }

  return (
    <PageWrapper>
      <h1 className="text-lg font-black text-gray-900 dark:text-white mb-4">Prescriptions</h1>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-6 ${
          dragging ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}
      >
        <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
        {uploadMutation.isPending ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Uploading & extracting…</p>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 text-primary-400 mx-auto mb-3" />
            <p className="font-bold text-sm text-gray-700 dark:text-gray-300">Drop your prescription here</p>
            <p className="text-xs text-gray-400 mt-1">or tap to browse · JPG, PNG, PDF</p>
          </>
        )}
      </div>

      {/* Prescription list */}
      <h2 className="text-sm font-black text-gray-900 dark:text-white mb-3">Previous Prescriptions</h2>
      {prescriptions.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No prescriptions uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {prescriptions.map((p) => {
            const statusInfo = STATUS_MAP[p.status] || STATUS_MAP.pending
            return (
              <div key={p.id} className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{p.fileName || 'Prescription'}</p>
                  <p className="text-xs text-gray-400">{formatDate(p.uploadedAt)}</p>
                  {p.medicines?.length > 0 && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{p.medicines.join(', ')}</p>
                  )}
                </div>
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </div>
            )
          })}
        </div>
      )}
    </PageWrapper>
  )
}
