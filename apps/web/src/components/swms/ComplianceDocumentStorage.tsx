'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Upload, 
  File, 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  FolderOpen
} from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabase/client'

interface ComplianceDocument {
  id: string
  filename: string
  original_name: string
  file_size: number
  mime_type: string
  document_type: 'swms' | 'certification' | 'audit_report' | 'inspection' | 'compliance_evidence' | 'other'
  storage_path: string
  upload_date: string
  uploaded_by?: string
  job_site_id?: string
  contractor_id?: string
  swms_job_id?: string
  description?: string
  tags?: string[]
  status: 'pending' | 'approved' | 'rejected' | 'archived'
  retention_date?: string
  metadata?: any
}

interface DocumentUpload {
  file: File
  document_type: string
  description: string
  tags: string[]
}

interface ComplianceDocumentStorageProps {
  jobSiteId?: string
  contractorId?: string
  swmsJobId?: string
  showUpload?: boolean
}

export function ComplianceDocumentStorage({
  jobSiteId,
  contractorId,
  swmsJobId,
  showUpload = true
}: ComplianceDocumentStorageProps) {
  const [documents, setDocuments] = useState<ComplianceDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [showUploadForm, setShowUploadForm] = useState(false)

  // Upload form state
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [documentType, setDocumentType] = useState('swms')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const supabase = supabaseBrowser
      let query = supabase
        .from('compliance_documents')
        .select('*')
        .order('upload_date', { ascending: false })

      // Apply filters based on props
      if (jobSiteId) {
        query = query.eq('job_site_id', jobSiteId)
      }
      if (contractorId) {
        query = query.eq('contractor_id', contractorId)
      }
      if (swmsJobId) {
        query = query.eq('swms_job_id', swmsJobId)
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        throw fetchError
      }

      setDocuments(data || [])
    } catch (err) {
      console.error('Error fetching documents:', err)
      setError(err instanceof Error ? err.message : 'Failed to load documents')
    } finally {
      setIsLoading(false)
    }
  }, [jobSiteId, contractorId, swmsJobId])

  const uploadDocument = async (upload: DocumentUpload): Promise<void> => {
    const supabase = supabaseBrowser
    const fileId = crypto.randomUUID()
    
    try {
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))

      // Generate secure file path
      const timestamp = new Date().toISOString().split('T')[0]
      const sanitizedName = upload.file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const storePath = `compliance/${timestamp}/${fileId}_${sanitizedName}`

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('compliance-documents')
        .upload(storePath, upload.file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      setUploadProgress(prev => ({ ...prev, [fileId]: 50 }))

      // Calculate retention date (7 years for compliance documents)
      const retentionDate = new Date()
      retentionDate.setFullYear(retentionDate.getFullYear() + 7)

      // Create document record in database
      const documentRecord = {
        id: fileId,
        filename: sanitizedName,
        original_name: upload.file.name,
        file_size: upload.file.size,
        mime_type: upload.file.type,
        document_type: upload.document_type,
        storage_path: storePath,
        upload_date: new Date().toISOString(),
        job_site_id: jobSiteId || null,
        contractor_id: contractorId || null,
        swms_job_id: swmsJobId || null,
        description: upload.description || null,
        tags: upload.tags.length > 0 ? upload.tags : null,
        status: 'pending' as const,
        retention_date: retentionDate.toISOString(),
        metadata: {
          uploaded_via: 'web_interface',
          original_size: upload.file.size,
          upload_session: crypto.randomUUID()
        }
      }

      const { error: dbError } = await supabase
        .from('compliance_documents')
        .insert(documentRecord)

      if (dbError) {
        // If database insert fails, clean up the uploaded file
        await supabase.storage
          .from('compliance-documents')
          .remove([storePath])
        throw new Error(`Database error: ${dbError.message}`)
      }

      setUploadProgress(prev => ({ ...prev, [fileId]: 100 }))
      
      // Refresh documents list
      await fetchDocuments()

      alert(`Document "${upload.file.name}" uploaded successfully!`)

    } catch (error) {
      console.error('Upload error:', error)
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      // Clean up progress tracking
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[fileId]
          return newProgress
        })
      }, 2000)
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert('Please select files to upload')
      return
    }

    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)

    // Upload each file
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      const upload: DocumentUpload = {
        file,
        document_type: documentType,
        description,
        tags: tagArray
      }

      await uploadDocument(upload)
    }

    // Reset form
    setSelectedFiles(null)
    setDescription('')
    setTags('')
    setShowUploadForm(false)
  }

  const downloadDocument = async (document: ComplianceDocument) => {
    try {
      const supabase = supabaseBrowser
      
      // Get signed URL for download
      const { data, error } = await supabase.storage
        .from('compliance-documents')
        .createSignedUrl(document.storage_path, 3600) // 1 hour expiry

      if (error || !data?.signedUrl) {
        throw new Error('Failed to generate download link')
      }

      // Trigger download
      const link = window.document.createElement('a')
      link.href = data.signedUrl
      link.download = document.original_name
      link.click()

      // Log download activity
      await supabase
        .from('document_access_log')
        .insert({
          document_id: document.id,
          access_type: 'download',
          accessed_at: new Date().toISOString()
        })

    } catch (error) {
      console.error('Download error:', error)
      alert(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const deleteDocument = async (document: ComplianceDocument) => {
    if (!confirm(`Are you sure you want to delete "${document.original_name}"? This action cannot be undone.`)) {
      return
    }

    try {
      const supabase = supabaseBrowser

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('compliance-documents')
        .remove([document.storage_path])

      if (storageError) {
        console.warn('Storage deletion failed:', storageError)
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('compliance_documents')
        .delete()
        .eq('id', document.id)

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`)
      }

      // Refresh documents list
      await fetchDocuments()
      alert('Document deleted successfully')

    } catch (error) {
      console.error('Delete error:', error)
      alert(`Delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const getDocumentIcon = (document: ComplianceDocument) => {
    if (document.mime_type.includes('pdf')) return FileText
    if (document.mime_type.includes('image')) return Eye
    return File
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>
      case 'pending':
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-AU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  // Initialize data fetch
  useState(() => {
    fetchDocuments()
  })

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <h3 className="font-semibold">Error loading documents</h3>
          </div>
          <p className="text-sm text-red-600 mt-2">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3"
            onClick={fetchDocuments}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      {showUpload && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Document Upload
              </CardTitle>
              <Button
                onClick={() => setShowUploadForm(!showUploadForm)}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload Documents
              </Button>
            </div>
          </CardHeader>
          
          {showUploadForm && (
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="files">Select Files</Label>
                <Input
                  id="files"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Accepted formats: PDF, DOC, DOCX, JPG, PNG, TXT (Max 10MB per file)
                </p>
              </div>

              <div>
                <Label htmlFor="docType">Document Type</Label>
                <select
                  id="docType"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="swms">SWMS Document</option>
                  <option value="certification">Certification</option>
                  <option value="audit_report">Audit Report</option>
                  <option value="inspection">Inspection Record</option>
                  <option value="compliance_evidence">Compliance Evidence</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description of the document..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="safety, inspection, monthly, etc."
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleFileUpload} disabled={!selectedFiles}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowUploadForm(false)}
                >
                  Cancel
                </Button>
              </div>

              {/* Upload Progress */}
              {Object.keys(uploadProgress).length > 0 && (
                <div className="space-y-2">
                  {Object.entries(uploadProgress).map(([fileId, progress]) => (
                    <div key={fileId} className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Compliance Documents ({documents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Clock className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading documents...</span>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No documents found</p>
              <p className="text-sm text-gray-400 mt-1">
                Upload compliance documents to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => {
                const IconComponent = getDocumentIcon(doc)
                
                return (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3 flex-1">
                      <IconComponent className="h-8 w-8 text-gray-400" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {doc.original_name}
                          </h4>
                          {getStatusBadge(doc.status)}
                        </div>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p>{doc.description || 'No description'}</p>
                          <div className="flex items-center gap-4">
                            <span>Type: {doc.document_type.replace('_', ' ')}</span>
                            <span>Size: {formatFileSize(doc.file_size)}</span>
                            <span>Uploaded: {formatDate(doc.upload_date)}</span>
                          </div>
                          {doc.tags && doc.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {doc.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadDocument(doc)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteDocument(doc)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}