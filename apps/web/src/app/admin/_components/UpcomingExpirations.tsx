import type { UpcomingExpiration } from '@/types/dashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Shield, AlertCircle, AlertTriangle } from 'lucide-react'

interface UpcomingExpirationsProps {
  items: UpcomingExpiration[]
}

export default function UpcomingExpirations({ items }: UpcomingExpirationsProps) {
  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 0) {
      return { text: 'Expired', className: 'text-red-600 bg-red-100' }
    } else if (diffDays <= 7) {
      return { text: `${diffDays} day${diffDays === 1 ? '' : 's'}`, className: 'text-red-600 bg-red-100' }
    } else if (diffDays <= 30) {
      return { text: `${diffDays} days`, className: 'text-yellow-600 bg-yellow-100' }
    } else {
      return { text: `${diffDays} days`, className: 'text-gray-600 bg-gray-100' }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getUrgencyBadge = (daysLeft: string) => {
    const days = parseInt(daysLeft)
    if (days <= 0) {
      return { variant: 'destructive' as const, text: 'Expired' }
    } else if (days <= 7) {
      return { variant: 'destructive' as const, text: `${days} day${days === 1 ? '' : 's'}` }
    } else if (days <= 30) {
      return { variant: 'secondary' as const, text: `${days} days` }
    } else {
      return { variant: 'outline' as const, text: `${days} days` }
    }
  }

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Upcoming Expirations</CardTitle>
            <CardDescription className="text-xs">Certifications expiring soon</CardDescription>
          </div>
          {items.length > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100">
              <AlertTriangle className="h-3.5 w-3.5 text-orange-600" />
              <span className="text-xs font-medium text-orange-700">{items.length} Expiring</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <ScrollArea className="h-[320px] px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-4 rounded-2xl bg-slate-100 mb-4">
                <Shield className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-600">All certifications up to date</p>
              <p className="text-xs text-muted-foreground mt-1">No expirations in the next 30 days</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => {
                const daysLeft = formatDate(item.expiry_date)
                const urgency = getUrgencyBadge(daysLeft)
                const urgencyColors = {
                  destructive: 'from-red-400 to-red-600',
                  outline: 'from-orange-400 to-orange-600',
                  secondary: 'from-yellow-400 to-yellow-600'
                }
                
                return (
                  <div key={item.id} className="group relative">
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex-shrink-0">
                        <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${urgencyColors[urgency.variant as keyof typeof urgencyColors] || 'from-slate-400 to-slate-600'} flex items-center justify-center shadow-sm`}>
                          <Shield className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {item.worker ? 
                            `${item.worker.first_name} ${item.worker.last_name || ''}`.trim() || item.worker.email || 'Unknown Worker'
                            : 'Unknown Worker'
                          }
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <AlertCircle className="h-3 w-3" />
                            <span className="truncate">{item.certification_type || 'Unknown Certification'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={urgency.variant} 
                          className={`mb-1 ${
                            urgency.variant === 'destructive' ? 'bg-red-100 text-red-700 border-red-200' :
                            urgency.variant === 'outline' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                            'bg-yellow-100 text-yellow-700 border-yellow-200'
                          }`}
                        >
                          {urgency.text}
                        </Badge>
                        <p className="text-xs text-slate-400">
                          {new Date(item.expiry_date).toLocaleDateString('en-AU', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    {index < items.length - 1 && (
                      <div className="absolute left-5 top-full h-3 w-px bg-gradient-to-b from-orange-200 to-transparent" />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
        {items.length > 0 && (
          <div className="p-4 border-t border-slate-100">
            <Button variant="ghost" className="w-full text-xs hover:bg-slate-50" size="sm">
              Manage certifications →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}