import { AccessibilityTester } from '@/components/accessibility/AccessibilityTester'

export default function AccessibilityTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Accessibility Testing</h1>
        <p className="text-muted-foreground">
          Use this tool to perform basic accessibility audits on the current page.
          This is a development tool and should not be visible in production.
        </p>
      </div>
      
      <AccessibilityTester />
      
      <div className="mt-8 text-sm text-muted-foreground">
        <p>
          <strong>Note:</strong> This tool performs basic automated checks. 
          For comprehensive accessibility testing, also use:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>axe DevTools browser extension</li>
          <li>Manual keyboard navigation testing</li>
          <li>Screen reader testing (NVDA, JAWS)</li>
          <li>Color contrast analyzers</li>
          <li>Real user testing with assistive technologies</li>
        </ul>
      </div>
    </div>
  )
}