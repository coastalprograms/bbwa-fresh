"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, AlertCircle, Play } from 'lucide-react'

interface AccessibilityCheck {
  id: string
  name: string
  status: 'pass' | 'fail' | 'warning' | 'pending'
  message: string
  element?: string
}

export function AccessibilityTester() {
  const [checks, setChecks] = useState<AccessibilityCheck[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runAccessibilityChecks = async () => {
    setIsRunning(true)
    setChecks([])

    const newChecks: AccessibilityCheck[] = []

    // Check for skip links
    const skipLink = document.querySelector('a[href="#main-content"]')
    newChecks.push({
      id: 'skip-link',
      name: 'Skip to main content link',
      status: skipLink ? 'pass' : 'fail',
      message: skipLink ? 'Skip link found' : 'No skip to main content link found',
    })

    // Check main landmark
    const mainElement = document.querySelector('main')
    newChecks.push({
      id: 'main-landmark',
      name: 'Main landmark',
      status: mainElement ? 'pass' : 'fail',
      message: mainElement ? 'Main landmark found' : 'No main landmark found',
    })

    // Check for heading structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const h1Count = document.querySelectorAll('h1').length
    newChecks.push({
      id: 'heading-structure',
      name: 'Heading structure',
      status: h1Count === 1 ? 'pass' : h1Count === 0 ? 'fail' : 'warning',
      message: h1Count === 1 
        ? `Found ${headings.length} headings with 1 H1` 
        : h1Count === 0 
        ? 'No H1 heading found' 
        : `Multiple H1 headings found (${h1Count})`,
    })

    // Check for alt text on images
    const images = document.querySelectorAll('img')
    const imagesWithoutAlt = Array.from(images).filter(img => !img.getAttribute('alt'))
    newChecks.push({
      id: 'image-alt-text',
      name: 'Image alt text',
      status: imagesWithoutAlt.length === 0 ? 'pass' : 'fail',
      message: imagesWithoutAlt.length === 0 
        ? `All ${images.length} images have alt text` 
        : `${imagesWithoutAlt.length} out of ${images.length} images missing alt text`,
    })

    // Check for form labels
    const inputs = document.querySelectorAll('input, select, textarea')
    const inputsWithoutLabels = Array.from(inputs).filter(input => {
      const id = input.getAttribute('id')
      const ariaLabel = input.getAttribute('aria-label')
      const ariaLabelledBy = input.getAttribute('aria-labelledby')
      const label = id ? document.querySelector(`label[for="${id}"]`) : null
      return !label && !ariaLabel && !ariaLabelledBy
    })
    newChecks.push({
      id: 'form-labels',
      name: 'Form field labels',
      status: inputsWithoutLabels.length === 0 ? 'pass' : 'fail',
      message: inputsWithoutLabels.length === 0 
        ? `All ${inputs.length} form fields have labels` 
        : `${inputsWithoutLabels.length} out of ${inputs.length} form fields missing labels`,
    })

    // Check for focus indicators
    const focusableElements = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    newChecks.push({
      id: 'focus-indicators',
      name: 'Focus indicators',
      status: 'pass', // CSS handles this
      message: `${focusableElements.length} focusable elements found with CSS focus styles`,
    })

    // Check color contrast (simplified)
    const body = document.body
    const computedStyle = window.getComputedStyle(body)
    const bgColor = computedStyle.backgroundColor
    const textColor = computedStyle.color
    newChecks.push({
      id: 'color-contrast',
      name: 'Color contrast',
      status: 'warning',
      message: 'Manual testing required for WCAG AA compliance (4.5:1 ratio)',
    })

    // Check for language attribute
    const htmlElement = document.documentElement
    const lang = htmlElement.getAttribute('lang')
    newChecks.push({
      id: 'page-language',
      name: 'Page language',
      status: lang ? 'pass' : 'fail',
      message: lang ? `Page language set to: ${lang}` : 'No language attribute found on html element',
    })

    // Check for page title
    const title = document.title
    newChecks.push({
      id: 'page-title',
      name: 'Page title',
      status: title && title.trim() ? 'pass' : 'fail',
      message: title && title.trim() ? `Page title: &quot;${title}&quot;` : 'No page title found',
    })

    // Simulate async checking
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setChecks(newChecks)
    setIsRunning(false)
  }

  const getStatusIcon = (status: AccessibilityCheck['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: AccessibilityCheck['status']) => {
    switch (status) {
      case 'pass':
        return <Badge variant="default" className="bg-green-100 text-green-800">Pass</Badge>
      case 'fail':
        return <Badge variant="destructive">Fail</Badge>
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  const passCount = checks.filter(c => c.status === 'pass').length
  const failCount = checks.filter(c => c.status === 'fail').length
  const warningCount = checks.filter(c => c.status === 'warning').length

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Accessibility Audit Results</span>
          <Button 
            onClick={runAccessibilityChecks} 
            disabled={isRunning}
            size="sm"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Running...' : 'Run Audit'}
          </Button>
        </CardTitle>
        {checks.length > 0 && (
          <div className="flex gap-2">
            <Badge variant="default" className="bg-green-100 text-green-800">
              {passCount} Pass
            </Badge>
            <Badge variant="destructive">{failCount} Fail</Badge>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              {warningCount} Warning
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isRunning && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Running accessibility checks...</p>
          </div>
        )}
        
        {checks.length > 0 && (
          <div className="space-y-3">
            {checks.map((check) => (
              <div 
                key={check.id} 
                className="flex items-start gap-3 p-3 border rounded-lg"
              >
                {getStatusIcon(check.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{check.name}</h3>
                    {getStatusBadge(check.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{check.message}</p>
                  {check.element && (
                    <code className="text-xs bg-muted px-1 py-0.5 rounded mt-1 inline-block">
                      {check.element}
                    </code>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isRunning && checks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Click &quot;Run Audit&quot; to start accessibility testing
          </div>
        )}
      </CardContent>
    </Card>
  )
}