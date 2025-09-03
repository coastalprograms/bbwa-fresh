'use client'

import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, FileText, AlertCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SwmsJob, SwmsSubmission } from '@/types/swms'

interface SwmsStatusIndicatorProps {
  status: SwmsJob['status'] | SwmsSubmission['status']
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

export function SwmsStatusIndicator({ 
  status, 
  size = 'md', 
  showIcon = true, 
  className 
}: SwmsStatusIndicatorProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'planned':
        return {
          label: 'Planned',
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: Clock
        }
      case 'active':
        return {
          label: 'Active',
          variant: 'default' as const,
          className: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: FileText
        }
      case 'completed':
        return {
          label: 'Completed',
          variant: 'secondary' as const,
          className: 'bg-green-100 text-green-800 border-green-300',
          icon: CheckCircle
        }
      case 'cancelled':
        return {
          label: 'Cancelled',
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 border-red-300',
          icon: XCircle
        }
      case 'submitted':
        return {
          label: 'Submitted',
          variant: 'outline' as const,
          className: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: FileText
        }
      case 'under_review':
        return {
          label: 'Under Review',
          variant: 'outline' as const,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          icon: Clock
        }
      case 'approved':
        return {
          label: 'Approved',
          variant: 'secondary' as const,
          className: 'bg-green-100 text-green-800 border-green-300',
          icon: CheckCircle
        }
      case 'rejected':
        return {
          label: 'Rejected',
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 border-red-300',
          icon: XCircle
        }
      case 'requires_changes':
        return {
          label: 'Needs Changes',
          variant: 'outline' as const,
          className: 'bg-orange-100 text-orange-800 border-orange-300',
          icon: AlertCircle
        }
      default:
        return {
          label: 'Unknown',
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: AlertCircle
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  }

  return (
    <Badge 
      variant={config.variant}
      className={cn(
        config.className,
        sizeClasses[size],
        'inline-flex items-center gap-1',
        className
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </Badge>
  )
}

interface SwmsCompletionBadgeProps {
  completionRate: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SwmsCompletionBadge({ 
  completionRate, 
  size = 'md', 
  className 
}: SwmsCompletionBadgeProps) {
  const getCompletionConfig = (rate: number) => {
    if (rate >= 100) {
      return {
        label: '100% Complete',
        className: 'bg-green-100 text-green-800 border-green-300',
        icon: CheckCircle
      }
    } else if (rate >= 80) {
      return {
        label: `${Math.round(rate)}% Complete`,
        className: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: FileText
      }
    } else if (rate >= 50) {
      return {
        label: `${Math.round(rate)}% Complete`,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: Clock
      }
    } else if (rate > 0) {
      return {
        label: `${Math.round(rate)}% Complete`,
        className: 'bg-orange-100 text-orange-800 border-orange-300',
        icon: AlertCircle
      }
    } else {
      return {
        label: 'Not Started',
        className: 'bg-gray-100 text-gray-800 border-gray-300',
        icon: Clock
      }
    }
  }

  const config = getCompletionConfig(completionRate)
  const Icon = config.icon

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  }

  return (
    <Badge 
      variant="outline"
      className={cn(
        config.className,
        sizeClasses[size],
        'inline-flex items-center gap-1',
        className
      )}
    >
      <Icon className={iconSizes[size]} />
      {config.label}
    </Badge>
  )
}