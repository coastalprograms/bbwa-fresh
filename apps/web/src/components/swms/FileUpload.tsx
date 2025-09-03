'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, FileText, Image, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { uploadSwmsDocument } from '@/app/swms-portal/actions/upload-actions'

interface FileUploadProps {
  swmsJobId: string
  contractorId: string
  token: string
}

interface UploadFile {
  id: string
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  previewUrl?: string
}

const ACCEPTED_FILE_TYPES = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'image/jpeg': 'JPG',
  'image/png': 'PNG'
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function FileUpload({ swmsJobId, contractorId, token }: FileUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 10MB limit (${Math.round(file.size / 1024 / 1024)}MB)`
    }
    
    if (!Object.keys(ACCEPTED_FILE_TYPES).includes(file.type)) {
      return `File type not supported. Please upload PDF, DOC, DOCX, JPG, or PNG files.`
    }
    
    return null
  }, [])

  const createUploadFile = useCallback((file: File): UploadFile => {
    const id = Math.random().toString(36).substr(2, 9)
    const uploadFile: UploadFile = {
      id,
      file,
      progress: 0,
      status: 'pending'
    }

    // Create preview for images
    if (file.type.startsWith('image/')) {
      uploadFile.previewUrl = URL.createObjectURL(file)
    }

    return uploadFile
  }, [])

  const handleFileSelect = useCallback((selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles)
    const newFiles: UploadFile[] = []

    fileArray.forEach(file => {
      const error = validateFile(file)
      if (error) {
        // Add file with error status
        newFiles.push({
          ...createUploadFile(file),
          status: 'error',
          error
        })
      } else {
        newFiles.push(createUploadFile(file))
      }
    })

    setFiles(prev => [...prev, ...newFiles])
  }, [validateFile, createUploadFile])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const { files: droppedFiles } = e.dataTransfer
    if (droppedFiles?.length) {
      handleFileSelect(droppedFiles)
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { files: selectedFiles } = e.target
    if (selectedFiles?.length) {
      handleFileSelect(selectedFiles)
    }
    // Clear the input value to allow selecting the same file again
    e.target.value = ''
  }, [handleFileSelect])

  const uploadFile = useCallback(async (uploadFile: UploadFile) => {
    setFiles(prev => 
      prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'uploading', progress: 0 }
          : f
      )
    )

    try {
      // Create FormData
      const formData = new FormData()
      formData.append('file', uploadFile.file)
      formData.append('swmsJobId', swmsJobId)
      formData.append('contractorId', contractorId)
      formData.append('token', token)

      // Simulate upload progress (in real implementation, this would come from the upload API)
      const progressInterval = setInterval(() => {
        setFiles(prev => 
          prev.map(f => 
            f.id === uploadFile.id && f.progress < 90
              ? { ...f, progress: f.progress + 10 }
              : f
          )
        )
      }, 200)

      const result = await uploadSwmsDocument(formData)
      clearInterval(progressInterval)

      if (result.success) {
        setFiles(prev => 
          prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, status: 'success', progress: 100 }
              : f
          )
        )
      } else {
        setFiles(prev => 
          prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, status: 'error', error: result.error, progress: 0 }
              : f
          )
        )
      }
    } catch (error) {
      setFiles(prev => 
        prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'error', error: 'Upload failed', progress: 0 }
            : f
        )
      )
    }
  }, [swmsJobId, contractorId, token])

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId)
      if (fileToRemove?.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl)
      }
      return prev.filter(f => f.id !== fileId)
    })
  }, [])

  const retryUpload = useCallback((fileToRetry: UploadFile) => {
    setFiles(prev => 
      prev.map(f => 
        f.id === fileToRetry.id 
          ? { ...f, status: 'pending', error: undefined }
          : f
      )
    )
  }, [])

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return Image
    }
    return FileText
  }

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'success':
        return CheckCircle2
      case 'error':
        return AlertCircle
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Drop files here or click to browse
        </h3>
        <p className="text-sm text-gray-600">
          Accepts PDF, DOC, DOCX, JPG, PNG files up to 10MB
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">
            Files to Upload ({files.length})
          </h4>
          
          {files.map((uploadFile) => {
            const FileIcon = getFileIcon(uploadFile.file)
            const StatusIcon = getStatusIcon(uploadFile.status)
            
            return (
              <div
                key={uploadFile.id}
                className="flex items-center space-x-4 p-4 border rounded-lg bg-white"
              >
                {/* File Preview/Icon */}
                <div className="flex-shrink-0">
                  {uploadFile.previewUrl ? (
                    <img
                      src={uploadFile.previewUrl}
                      alt={uploadFile.file.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                      <FileIcon className="h-6 w-6 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* File Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {uploadFile.file.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {ACCEPTED_FILE_TYPES[uploadFile.file.type as keyof typeof ACCEPTED_FILE_TYPES]} • {Math.round(uploadFile.file.size / 1024)} KB
                  </p>
                  
                  {/* Progress Bar */}
                  {uploadFile.status === 'uploading' && (
                    <div className="mt-2">
                      <Progress value={uploadFile.progress} className="h-2" />
                      <p className="text-xs text-gray-600 mt-1">
                        Uploading... {uploadFile.progress}%
                      </p>
                    </div>
                  )}
                  
                  {/* Error Message */}
                  {uploadFile.status === 'error' && uploadFile.error && (
                    <Alert className="mt-2 py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        {uploadFile.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="flex items-center space-x-2">
                  {StatusIcon && (
                    <StatusIcon 
                      className={`h-5 w-5 ${
                        uploadFile.status === 'success' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`} 
                    />
                  )}
                  
                  {uploadFile.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => uploadFile(uploadFile)}
                      disabled={uploadFile.status === 'uploading'}
                    >
                      Upload
                    </Button>
                  )}
                  
                  {uploadFile.status === 'error' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => retryUpload(uploadFile)}
                    >
                      Retry
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(uploadFile.id)}
                    disabled={uploadFile.status === 'uploading'}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
          
          {/* Upload All Button */}
          {files.some(f => f.status === 'pending') && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={() => {
                  files
                    .filter(f => f.status === 'pending')
                    .forEach(uploadFile)
                }}
                disabled={files.some(f => f.status === 'uploading')}
              >
                Upload All Files ({files.filter(f => f.status === 'pending').length})
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}