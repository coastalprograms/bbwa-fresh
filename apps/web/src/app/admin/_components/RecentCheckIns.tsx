import type { RecentCheckIn } from '@/types/dashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MapPin, Clock, UserCheck } from 'lucide-react'

interface RecentCheckInsProps {
  items: RecentCheckIn[]
}

export default function RecentCheckIns({ items }: RecentCheckInsProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return diffMinutes === 0 ? 'Just now' : `${diffMinutes}m ago`
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else {
      return date.toLocaleDateString('en-AU', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Recent Check-ins</CardTitle>
            <CardDescription className="text-xs">Last 24 hours activity</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <ScrollArea className="h-[320px] px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-4 rounded-2xl bg-slate-100 mb-4">
                <MapPin className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-600">No check-ins yet</p>
              <p className="text-xs text-muted-foreground mt-1">Workers will appear here when they check in</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="group relative">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-sm">
                        <UserCheck className="h-5 w-5 text-white" />
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
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{item.job_site?.name || 'Unknown Site'}</span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {formatTime(item.checked_in_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {index < items.length - 1 && (
                    <div className="absolute left-5 top-full h-3 w-px bg-gradient-to-b from-green-200 to-transparent" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        {items.length > 0 && (
          <div className="p-4 border-t border-slate-100">
            <Button variant="ghost" className="w-full text-xs hover:bg-slate-50" size="sm">
              View all check-ins →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}