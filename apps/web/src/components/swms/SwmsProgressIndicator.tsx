'use client'

import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react'

interface SwmsProgressIndicatorProps {
  total: number
  submitted: number
  pending: number
  overdue: number
  completionPercentage: number
  showLabels?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function SwmsProgressIndicator({
  total,
  submitted,
  pending,
  overdue,
  completionPercentage,
  showLabels = true,
  size = 'md'
}: SwmsProgressIndicatorProps) {
  
  // Calculate percentages for the stacked progress bar
  const submittedPercentage = total > 0 ? (submitted / total) * 100 : 0
  const pendingPercentage = total > 0 ? (pending / total) * 100 : 0
  const overduePercentage = total > 0 ? (overdue / total) * 100 : 0
  
  const barHeight = size === 'sm' ? 'h-2' : size === 'lg' ? 'h-4' : 'h-3'
  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
  
  return (
    <div className="space-y-2">
      {/* Progress Bar */}
      <div className="relative w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`${barHeight} bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300`}
          style={{ width: `${submittedPercentage}%` }}
        />
        <div 
          className={`${barHeight} bg-gradient-to-r from-yellow-500 to-yellow-600 transition-all duration-300`}
          style={{ 
            width: `${pendingPercentage}%`,
            marginLeft: `${submittedPercentage}%`,
            marginTop: size === 'sm' ? '-8px' : size === 'lg' ? '-16px' : '-12px'
          }}
        />
        <div 
          className={`${barHeight} bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300`}
          style={{ 
            width: `${overduePercentage}%`,
            marginLeft: `${submittedPercentage + pendingPercentage}%`,
            marginTop: size === 'sm' ? '-8px' : size === 'lg' ? '-16px' : '-12px'
          }}
        />
      </div>
      
      {/* Labels and Statistics */}
      {showLabels && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <CheckCircle className={`${iconSize} text-green-600`} />
              <span className={`${textSize} font-medium text-green-700`}>
                {submitted}
              </span>
              <span className={`${textSize} text-muted-foreground`}>submitted</span>
            </div>
            
            {pending > 0 && (
              <div className="flex items-center gap-1">
                <Clock className={`${iconSize} text-yellow-600`} />
                <span className={`${textSize} font-medium text-yellow-700`}>
                  {pending}
                </span>
                <span className={`${textSize} text-muted-foreground`}>pending</span>
              </div>
            )}
            
            {overdue > 0 && (
              <div className="flex items-center gap-1">
                <AlertTriangle className={`${iconSize} text-red-600`} />
                <span className={`${textSize} font-medium text-red-700`}>
                  {overdue}
                </span>
                <span className={`${textSize} text-muted-foreground`}>overdue</span>
              </div>
            )}
          </div>
          
          <Badge 
            variant={completionPercentage >= 90 ? 'default' : completionPercentage >= 70 ? 'secondary' : 'outline'}
            className={
              completionPercentage >= 90 ? 'bg-green-100 text-green-800' :
              completionPercentage >= 70 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }
          >
            {Math.round(completionPercentage)}% complete
          </Badge>
        </div>
      )}
      
      {/* Summary text for accessibility */}
      <div className="sr-only">
        SWMS progress: {submitted} of {total} submitted ({Math.round(completionPercentage)}% complete),
        {pending > 0 && ` ${pending} pending,`}
        {overdue > 0 && ` ${overdue} overdue`}
      </div>
    </div>
  )
}