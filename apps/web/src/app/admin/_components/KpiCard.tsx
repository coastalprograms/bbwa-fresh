import Link from 'next/link'
import type { Route } from 'next'
import type { KpiCardProps } from '@/types/dashboard'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Users, CheckCircle, AlertTriangle, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IconConfig {
  icon: any
  color: string
  bgColor: string
}

const iconMap: Record<string, IconConfig> = {
  'Active Workers': {
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  'Recent Check-ins': {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  'Expiring Soon': {
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  'default': {
    icon: TrendingUp,
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  }
}

export default function KpiCard({ title, value, subtitle, href }: KpiCardProps) {
  const config = iconMap[title] || iconMap.default
  const Icon = config.icon
  
  const isPositive = title === 'Active Workers' || title === 'Recent Check-ins'
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight
  const trendColor = isPositive ? 'text-green-600' : 'text-orange-600'
  
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (href) {
      return (
        <Link 
          href={href as Route}
          className="block group"
        >
          {children}
        </Link>
      )
    }
    return <>{children}</>
  }

  return (
    <CardWrapper>
      <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5" />
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">{value}</span>
                {title !== 'Expiring Soon' && (
                  <TrendIcon className={cn('h-4 w-4', trendColor)} />
                )}
              </div>
            </div>
            <div className={cn('p-2.5 rounded-xl', config.bgColor)}>
              <Icon className={cn('h-5 w-5', config.color)} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          {subtitle && (
            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
          {href && (
            <div className="flex items-center gap-1 mt-3 text-xs font-medium text-primary group-hover:translate-x-1 transition-transform">
              <span>View details</span>
              <ArrowUpRight className="h-3 w-3" />
            </div>
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  )
}