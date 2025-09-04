'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  FileText, 
  Download, 
  Plus,
  Eye,
  Calendar,
  Building,
  Users,
  ClipboardList,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabase/client'

interface ComplianceTemplate {
  id: string
  name: string
  description: string
  category: 'inspection' | 'incident' | 'training' | 'certification' | 'swms' | 'audit'
  fields: TemplateField[]
}

interface TemplateField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'date' | 'select' | 'checkbox'
  required: boolean
  options?: string[]
  placeholder?: string
}

interface ComplianceTemplatesProps {
  jobSiteId?: string
  contractorId?: string
}

export function ComplianceTemplates({
  jobSiteId,
  contractorId
}: ComplianceTemplatesProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<ComplianceTemplate | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [generationMessage, setGenerationMessage] = useState('')

  // Pre-defined compliance templates
  const templates: ComplianceTemplate[] = [
    {
      id: 'swms-inspection',
      name: 'SWMS Site Inspection Report',
      description: 'Comprehensive site inspection focusing on SWMS compliance',
      category: 'inspection',
      fields: [
        { id: 'inspector_name', label: 'Inspector Name', type: 'text', required: true },
        { id: 'inspection_date', label: 'Inspection Date', type: 'date', required: true },
        { id: 'job_site_name', label: 'Job Site Name', type: 'text', required: true },
        { id: 'weather_conditions', label: 'Weather Conditions', type: 'select', required: true, options: ['Clear', 'Overcast', 'Light Rain', 'Heavy Rain', 'Windy', 'Extreme Heat'] },
        { id: 'swms_posted', label: 'SWMS Documents Posted Visibly', type: 'checkbox', required: true },
        { id: 'workers_briefed', label: 'Workers Properly Briefed', type: 'checkbox', required: true },
        { id: 'safety_equipment', label: 'Safety Equipment Available', type: 'checkbox', required: true },
        { id: 'hazards_identified', label: 'Hazards Properly Identified', type: 'textarea', required: false, placeholder: 'List any hazards observed...' },
        { id: 'corrective_actions', label: 'Corrective Actions Required', type: 'textarea', required: false, placeholder: 'List required actions...' },
        { id: 'overall_compliance', label: 'Overall Compliance Rating', type: 'select', required: true, options: ['Excellent', 'Good', 'Satisfactory', 'Poor', 'Critical'] },
        { id: 'inspector_signature', label: 'Inspector Signature', type: 'text', required: true },
        { id: 'notes', label: 'Additional Notes', type: 'textarea', required: false }
      ]
    },
    {
      id: 'incident-report',
      name: 'Workplace Incident Report',
      description: 'Standard workplace incident reporting form',
      category: 'incident',
      fields: [
        { id: 'incident_date', label: 'Incident Date', type: 'date', required: true },
        { id: 'incident_time', label: 'Incident Time', type: 'text', required: true, placeholder: 'HH:MM' },
        { id: 'reporter_name', label: 'Reporter Name', type: 'text', required: true },
        { id: 'injured_person', label: 'Injured Person Name', type: 'text', required: false },
        { id: 'incident_location', label: 'Incident Location', type: 'text', required: true },
        { id: 'incident_type', label: 'Incident Type', type: 'select', required: true, options: ['Near Miss', 'First Aid', 'Medical Treatment', 'Lost Time', 'Property Damage', 'Environmental'] },
        { id: 'incident_description', label: 'Incident Description', type: 'textarea', required: true, placeholder: 'Describe what happened...' },
        { id: 'immediate_actions', label: 'Immediate Actions Taken', type: 'textarea', required: true },
        { id: 'root_cause', label: 'Root Cause Analysis', type: 'textarea', required: false },
        { id: 'preventive_measures', label: 'Preventive Measures', type: 'textarea', required: false },
        { id: 'swms_relevant', label: 'SWMS Requirements Relevant', type: 'checkbox', required: false },
        { id: 'witnesses', label: 'Witnesses', type: 'textarea', required: false, placeholder: 'List witness names and contact details...' }
      ]
    },
    {
      id: 'training-record',
      name: 'SWMS Training Record',
      description: 'Record of SWMS training sessions and attendees',
      category: 'training',
      fields: [
        { id: 'training_date', label: 'Training Date', type: 'date', required: true },
        { id: 'trainer_name', label: 'Trainer Name', type: 'text', required: true },
        { id: 'training_topic', label: 'Training Topic', type: 'text', required: true },
        { id: 'swms_reference', label: 'Related SWMS Document', type: 'text', required: false },
        { id: 'duration_hours', label: 'Training Duration (hours)', type: 'text', required: true },
        { id: 'training_method', label: 'Training Method', type: 'select', required: true, options: ['Classroom', 'On-site Demonstration', 'Online', 'Toolbox Talk', 'Practical Assessment'] },
        { id: 'attendees', label: 'Attendees', type: 'textarea', required: true, placeholder: 'List attendee names and signatures...' },
        { id: 'learning_objectives', label: 'Learning Objectives Covered', type: 'textarea', required: true },
        { id: 'assessment_method', label: 'Assessment Method', type: 'select', required: false, options: ['Written Test', 'Practical Test', 'Observation', 'Discussion', 'No Assessment'] },
        { id: 'training_materials', label: 'Training Materials Used', type: 'textarea', required: false },
        { id: 'follow_up_required', label: 'Follow-up Training Required', type: 'checkbox', required: false },
        { id: 'trainer_notes', label: 'Trainer Notes', type: 'textarea', required: false }
      ]
    },
    {
      id: 'monthly-compliance',
      name: 'Monthly SWMS Compliance Summary',
      description: 'Monthly summary of SWMS compliance activities',
      category: 'audit',
      fields: [
        { id: 'report_month', label: 'Report Month', type: 'text', required: true, placeholder: 'January 2024' },
        { id: 'prepared_by', label: 'Prepared By', type: 'text', required: true },
        { id: 'total_swms_jobs', label: 'Total Active SWMS Jobs', type: 'text', required: true },
        { id: 'submissions_received', label: 'Submissions Received', type: 'text', required: true },
        { id: 'submissions_approved', label: 'Submissions Approved', type: 'text', required: true },
        { id: 'submissions_rejected', label: 'Submissions Rejected', type: 'text', required: true },
        { id: 'compliance_rate', label: 'Overall Compliance Rate (%)', type: 'text', required: true },
        { id: 'training_sessions', label: 'Training Sessions Conducted', type: 'text', required: true },
        { id: 'inspections_completed', label: 'Site Inspections Completed', type: 'text', required: true },
        { id: 'incidents_reported', label: 'Incidents Reported', type: 'text', required: true },
        { id: 'corrective_actions', label: 'Corrective Actions Implemented', type: 'textarea', required: false },
        { id: 'improvement_initiatives', label: 'Improvement Initiatives', type: 'textarea', required: false },
        { id: 'next_month_goals', label: 'Next Month Goals', type: 'textarea', required: false }
      ]
    }
  ]

  const handleTemplateSelect = (template: ComplianceTemplate) => {
    setSelectedTemplate(template)
    setFormData({})
    setGenerationStatus('idle')
    setGenerationMessage('')
  }

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }

  const generateDocument = async () => {
    if (!selectedTemplate) return

    setIsGenerating(true)
    setGenerationStatus('idle')
    setGenerationMessage('')

    try {
      // Validate required fields
      const missingFields = selectedTemplate.fields
        .filter(field => field.required && !formData[field.id])
        .map(field => field.label)

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
      }

      // Generate document HTML
      const documentHtml = generateDocumentHTML()
      
      // Create and download the document
      const blob = new Blob([documentHtml], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `${selectedTemplate.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.html`
      link.click()
      
      URL.revokeObjectURL(url)

      setGenerationStatus('success')
      setGenerationMessage('Document generated successfully!')

    } catch (error) {
      console.error('Document generation error:', error)
      setGenerationStatus('error')
      setGenerationMessage(error instanceof Error ? error.message : 'Failed to generate document')
    } finally {
      setIsGenerating(false)
    }
  }

  const generateDocumentHTML = () => {
    if (!selectedTemplate) return ''

    const currentDate = new Date().toLocaleDateString('en-AU')
    const currentTime = new Date().toLocaleTimeString('en-AU')

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${selectedTemplate.name}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 20px; 
              line-height: 1.6; 
            }
            .header { 
              text-align: center; 
              border-bottom: 2px solid #333; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .header h1 { 
              margin: 0; 
              color: #333; 
              font-size: 24px; 
            }
            .header p { 
              margin: 5px 0; 
              color: #666; 
            }
            .field-group { 
              margin-bottom: 20px; 
              border-bottom: 1px solid #eee; 
              padding-bottom: 15px; 
            }
            .field-label { 
              font-weight: bold; 
              color: #333; 
              margin-bottom: 5px; 
            }
            .field-value { 
              background: #f9f9f9; 
              padding: 8px 12px; 
              border-radius: 4px; 
              border-left: 3px solid #007bff; 
              margin-bottom: 5px;
            }
            .checkbox-value { 
              color: #10b981; 
              font-weight: bold; 
            }
            .category-${selectedTemplate.category} { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 15px; 
              border-radius: 8px; 
              text-align: center; 
              margin-bottom: 30px; 
            }
            .footer { 
              margin-top: 40px; 
              padding-top: 20px; 
              border-top: 1px solid #ddd; 
              font-size: 12px; 
              color: #666; 
            }
            .signature-section { 
              margin-top: 40px; 
              border: 1px solid #ddd; 
              padding: 20px; 
              background: #f8f9fa; 
            }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${selectedTemplate.name}</h1>
            <p><strong>Document Type:</strong> ${selectedTemplate.category.toUpperCase()}</p>
            <p><strong>Generated:</strong> ${currentDate} at ${currentTime}</p>
            ${jobSiteId ? `<p><strong>Job Site ID:</strong> ${jobSiteId}</p>` : ''}
            ${contractorId ? `<p><strong>Contractor ID:</strong> ${contractorId}</p>` : ''}
          </div>

          <div class="category-${selectedTemplate.category}">
            <h2 style="margin: 0;">${selectedTemplate.description}</h2>
          </div>

          ${selectedTemplate.fields.map(field => {
            const value = formData[field.id]
            if (!value && value !== false) return ''
            
            let displayValue = value
            if (field.type === 'checkbox') {
              displayValue = value ? '✓ Yes' : '✗ No'
            }
            
            return `
              <div class="field-group">
                <div class="field-label">${field.label}${field.required ? ' *' : ''}</div>
                <div class="field-value ${field.type === 'checkbox' ? 'checkbox-value' : ''}">${displayValue}</div>
              </div>
            `
          }).join('')}

          ${selectedTemplate.category === 'inspection' || selectedTemplate.category === 'training' ? `
            <div class="signature-section">
              <h3>Signatures & Verification</h3>
              <div style="display: flex; justify-content: space-between; margin-top: 30px;">
                <div style="width: 45%;">
                  <div style="border-bottom: 1px solid #333; margin-bottom: 5px; height: 40px;"></div>
                  <p style="text-align: center; margin: 0; font-size: 12px;">Inspector/Trainer Signature</p>
                  <p style="text-align: center; margin: 5px 0 0 0; font-size: 12px;">Date: _______________</p>
                </div>
                <div style="width: 45%;">
                  <div style="border-bottom: 1px solid #333; margin-bottom: 5px; height: 40px;"></div>
                  <p style="text-align: center; margin: 0; font-size: 12px;">Site Manager Signature</p>
                  <p style="text-align: center; margin: 5px 0 0 0; font-size: 12px;">Date: _______________</p>
                </div>
              </div>
            </div>
          ` : ''}

          <div class="footer">
            <p><strong>Document Information:</strong></p>
            <p>• Generated by BBWA SWMS Compliance System</p>
            <p>• Template: ${selectedTemplate.name}</p>
            <p>• Category: ${selectedTemplate.category.toUpperCase()}</p>
            <p>• Generated on: ${currentDate} ${currentTime}</p>
            <p>• This document should be reviewed and signed by appropriate personnel</p>
          </div>
        </body>
      </html>
    `
  }

  const renderField = (field: TemplateField) => {
    const value = formData[field.id] || ''

    switch (field.type) {
      case 'text':
        return (
          <Input
            id={field.id}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="mt-1"
          />
        )
      case 'textarea':
        return (
          <Textarea
            id={field.id}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className="mt-1"
          />
        )
      case 'date':
        return (
          <Input
            id={field.id}
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="mt-1"
          />
        )
      case 'select':
        return (
          <select
            id={field.id}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Select an option...</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
      case 'checkbox':
        return (
          <div className="flex items-center mt-2">
            <input
              id={field.id}
              type="checkbox"
              checked={value === true}
              onChange={(e) => handleInputChange(field.id, e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label htmlFor={field.id} className="ml-2 text-sm text-gray-700">
              {field.placeholder || 'Yes'}
            </label>
          </div>
        )
      default:
        return null
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'inspection': return Building
      case 'incident': return AlertCircle
      case 'training': return Users
      case 'certification': return CheckCircle
      case 'swms': return ClipboardList
      case 'audit': return FileText
      default: return FileText
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'inspection': return 'bg-blue-100 text-blue-800'
      case 'incident': return 'bg-red-100 text-red-800'
      case 'training': return 'bg-green-100 text-green-800'
      case 'certification': return 'bg-purple-100 text-purple-800'
      case 'swms': return 'bg-orange-100 text-orange-800'
      case 'audit': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Compliance Document Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedTemplate ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {templates.map((template) => {
                const IconComponent = getCategoryIcon(template.category)
                return (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-300"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <IconComponent className="h-8 w-8 text-gray-500 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{template.name}</h3>
                            <Badge className={getCategoryColor(template.category)}>
                              {template.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <ClipboardList className="h-3 w-3" />
                            {template.fields.length} fields
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Template Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{selectedTemplate.name}</h3>
                  <Badge className={getCategoryColor(selectedTemplate.category)}>
                    {selectedTemplate.category}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedTemplate(null)}
                  size="sm"
                >
                  ← Back to Templates
                </Button>
              </div>

              <p className="text-gray-600">{selectedTemplate.description}</p>

              {/* Form Fields */}
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                {selectedTemplate.fields.map((field) => (
                  <div key={field.id}>
                    <Label htmlFor={field.id} className="flex items-center gap-1">
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                    </Label>
                    {renderField(field)}
                  </div>
                ))}
              </div>

              {/* Generate Button */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={generateDocument}
                  disabled={isGenerating}
                  className="flex items-center gap-2"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Generate Document
                </Button>
              </div>

              {/* Status Message */}
              {generationMessage && (
                <div className={`flex items-center gap-2 text-sm ${
                  generationStatus === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {generationStatus === 'success' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <span>{generationMessage}</span>
                </div>
              )}

              {/* Template Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700 text-sm font-medium mb-2">
                  <Calendar className="h-4 w-4" />
                  Template Information
                </div>
                <div className="text-sm text-blue-600 space-y-1">
                  <p>• Generated documents are saved as HTML files for easy viewing and printing</p>
                  <p>• All required fields must be completed before generation</p>
                  <p>• Documents include signatures sections where applicable</p>
                  <p>• Generated documents are suitable for compliance audits and reviews</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}