"use client"

import { useState, useEffect } from 'react'
import { AppSidebar } from '@/components/admin/AppSidebar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, Loader2, Save, Building, Bell, Shield, Mail } from "lucide-react"

interface AppSetting {
  key: string
  value: any
  updated_at?: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, any>>({
    // Company Information
    company_name: 'Bayside Builders WA',
    company_abn: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    
    // Notification Settings
    admin_email: '',
    admin_sms: '',
    expiry_warning_days_30: true,
    expiry_warning_days_14: true,
    expiry_warning_days_7: true,
    expiry_warning_days_1: true,
    notification_time: '09:00',
    
    // Site Configuration
    default_checkin_radius: '500',
    auto_checkout_enabled: false,
    auto_checkout_hours: '8',
    timezone: 'Australia/Perth',
    
    // Compliance Settings
    white_card_required: true,
    allow_expired_grace_period: false,
    grace_period_days: '0',
    block_expired_entry: true,
    
    // Email Configuration
    smtp_host: '',
    smtp_port: '587',
    smtp_user: '',
    smtp_password: '',
    smtp_from_email: '',
    smtp_from_name: 'Bayside Builders WA',
    
    // SMS Configuration
    sms_provider: 'twilio',
    sms_account_sid: '',
    sms_auth_token: '',
    sms_from_number: ''
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('company')
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        const settingsMap = data.reduce((acc: Record<string, any>, setting: AppSetting) => {
          acc[setting.key] = setting.value
          return acc
        }, {})
        setSettings(prev => ({ ...prev, ...settingsMap }))
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
      setMessage({type: 'error', text: 'Failed to load settings. Please try again.'})
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async (settingsToSave: Record<string, any>) => {
    setSaving(true)
    try {
      // Save all settings in batch
      const promises = Object.entries(settingsToSave).map(([key, value]) =>
        fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
        })
      )

      const results = await Promise.all(promises)
      const allSuccessful = results.every(r => r.ok)

      if (allSuccessful) {
        setMessage({type: 'success', text: 'Settings saved successfully.'})
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error('Some settings failed to save')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      setMessage({type: 'error', text: 'Failed to save settings. Please try again.'})
    } finally {
      setSaving(false)
    }
  }

  const handleSaveTab = () => {
    const tabSettings: Record<string, any> = {}
    
    switch (activeTab) {
      case 'company':
        tabSettings.company_name = settings.company_name
        tabSettings.company_abn = settings.company_abn
        tabSettings.company_email = settings.company_email
        tabSettings.company_phone = settings.company_phone
        tabSettings.company_address = settings.company_address
        break
      case 'notifications':
        tabSettings.admin_email = settings.admin_email
        tabSettings.admin_sms = settings.admin_sms
        tabSettings.expiry_warning_days_30 = settings.expiry_warning_days_30
        tabSettings.expiry_warning_days_14 = settings.expiry_warning_days_14
        tabSettings.expiry_warning_days_7 = settings.expiry_warning_days_7
        tabSettings.expiry_warning_days_1 = settings.expiry_warning_days_1
        tabSettings.notification_time = settings.notification_time
        break
      case 'site':
        tabSettings.default_checkin_radius = settings.default_checkin_radius
        tabSettings.auto_checkout_enabled = settings.auto_checkout_enabled
        tabSettings.auto_checkout_hours = settings.auto_checkout_hours
        tabSettings.timezone = settings.timezone
        break
      case 'compliance':
        tabSettings.white_card_required = settings.white_card_required
        tabSettings.allow_expired_grace_period = settings.allow_expired_grace_period
        tabSettings.grace_period_days = settings.grace_period_days
        tabSettings.block_expired_entry = settings.block_expired_entry
        break
      case 'integrations':
        if (settings.smtp_host) {
          tabSettings.smtp_host = settings.smtp_host
          tabSettings.smtp_port = settings.smtp_port
          tabSettings.smtp_user = settings.smtp_user
          tabSettings.smtp_password = settings.smtp_password
          tabSettings.smtp_from_email = settings.smtp_from_email
          tabSettings.smtp_from_name = settings.smtp_from_name
        }
        if (settings.sms_account_sid) {
          tabSettings.sms_provider = settings.sms_provider
          tabSettings.sms_account_sid = settings.sms_account_sid
          tabSettings.sms_auth_token = settings.sms_auth_token
          tabSettings.sms_from_number = settings.sms_from_number
        }
        break
    }
    
    saveSettings(tabSettings)
  }

  if (loading) {
    return (
      <AppSidebar title="Settings">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading settings...</span>
        </div>
      </AppSidebar>
    )
  }

  return (
    <AppSidebar title="Settings">
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Application Settings</h2>
          <p className="text-muted-foreground">
            Configure your company information, notifications, and system preferences.
          </p>
        </div>

        {message && (
          <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="site">Site Config</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Company Information
                </CardTitle>
                <CardDescription>
                  Basic information about your construction company.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      value={settings.company_name}
                      onChange={(e) => setSettings(prev => ({ ...prev, company_name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_abn">ABN</Label>
                    <Input
                      id="company_abn"
                      placeholder="11 222 333 444"
                      value={settings.company_abn}
                      onChange={(e) => setSettings(prev => ({ ...prev, company_abn: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_email">Main Email</Label>
                    <Input
                      id="company_email"
                      type="email"
                      placeholder="info@baysidebuilders.com.au"
                      value={settings.company_email}
                      onChange={(e) => setSettings(prev => ({ ...prev, company_email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_phone">Phone Number</Label>
                    <Input
                      id="company_phone"
                      placeholder="08 9000 0000"
                      value={settings.company_phone}
                      onChange={(e) => setSettings(prev => ({ ...prev, company_phone: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_address">Address</Label>
                  <Input
                    id="company_address"
                    placeholder="123 Builder Street, Perth WA 6000"
                    value={settings.company_address}
                    onChange={(e) => setSettings(prev => ({ ...prev, company_address: e.target.value }))}
                  />
                </div>
                <Button onClick={handleSaveTab} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Company Info
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure how and when you receive alerts about worker compliance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="admin_email">Admin Email for Alerts</Label>
                    <Input
                      id="admin_email"
                      type="email"
                      placeholder="admin@baysidebuilders.com.au"
                      value={settings.admin_email}
                      onChange={(e) => setSettings(prev => ({ ...prev, admin_email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin_sms">Admin SMS Number</Label>
                    <Input
                      id="admin_sms"
                      placeholder="0400 000 000"
                      value={settings.admin_sms}
                      onChange={(e) => setSettings(prev => ({ ...prev, admin_sms: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Certificate Expiry Warnings</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <Label htmlFor="30days" className="text-sm font-normal">30 days before expiry</Label>
                      <Switch
                        id="30days"
                        checked={settings.expiry_warning_days_30}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, expiry_warning_days_30: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <Label htmlFor="14days" className="text-sm font-normal">14 days before expiry</Label>
                      <Switch
                        id="14days"
                        checked={settings.expiry_warning_days_14}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, expiry_warning_days_14: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <Label htmlFor="7days" className="text-sm font-normal">7 days before expiry</Label>
                      <Switch
                        id="7days"
                        checked={settings.expiry_warning_days_7}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, expiry_warning_days_7: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <Label htmlFor="1day" className="text-sm font-normal">1 day before expiry</Label>
                      <Switch
                        id="1day"
                        checked={settings.expiry_warning_days_1}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, expiry_warning_days_1: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notification_time">Daily Notification Time</Label>
                  <Input
                    id="notification_time"
                    type="time"
                    value={settings.notification_time}
                    onChange={(e) => setSettings(prev => ({ ...prev, notification_time: e.target.value }))}
                  />
                </div>

                <Button onClick={handleSaveTab} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Notification Settings
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="site" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Site Configuration
                </CardTitle>
                <CardDescription>
                  Default settings for job site check-ins and attendance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default_checkin_radius">Default Check-in Radius (meters)</Label>
                  <Select
                    value={settings.default_checkin_radius}
                    onValueChange={(value) => 
                      setSettings(prev => ({ ...prev, default_checkin_radius: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100m</SelectItem>
                      <SelectItem value="250">250m</SelectItem>
                      <SelectItem value="500">500m</SelectItem>
                      <SelectItem value="1000">1km</SelectItem>
                      <SelectItem value="2000">2km</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Default radius for new job sites
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto_checkout">Auto Checkout</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically check out workers after specified hours
                      </p>
                    </div>
                    <Switch
                      id="auto_checkout"
                      checked={settings.auto_checkout_enabled}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, auto_checkout_enabled: checked }))
                      }
                    />
                  </div>
                  
                  {settings.auto_checkout_enabled && (
                    <div className="space-y-2 ml-4">
                      <Label htmlFor="auto_checkout_hours">Auto Checkout After (hours)</Label>
                      <Select
                        value={settings.auto_checkout_hours}
                        onValueChange={(value) => 
                          setSettings(prev => ({ ...prev, auto_checkout_hours: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4">4 hours</SelectItem>
                          <SelectItem value="6">6 hours</SelectItem>
                          <SelectItem value="8">8 hours</SelectItem>
                          <SelectItem value="10">10 hours</SelectItem>
                          <SelectItem value="12">12 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => 
                      setSettings(prev => ({ ...prev, timezone: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Australia/Perth">Perth (AWST)</SelectItem>
                      <SelectItem value="Australia/Adelaide">Adelaide (ACST)</SelectItem>
                      <SelectItem value="Australia/Darwin">Darwin (ACST)</SelectItem>
                      <SelectItem value="Australia/Brisbane">Brisbane (AEST)</SelectItem>
                      <SelectItem value="Australia/Sydney">Sydney (AEST)</SelectItem>
                      <SelectItem value="Australia/Melbourne">Melbourne (AEST)</SelectItem>
                      <SelectItem value="Australia/Hobart">Hobart (AEST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSaveTab} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Site Configuration
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Compliance Settings
                </CardTitle>
                <CardDescription>
                  Configure certification requirements and entry rules.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="white_card_required">White Card Required</Label>
                      <p className="text-sm text-muted-foreground">
                        All workers must have a valid white card to check in
                      </p>
                    </div>
                    <Switch
                      id="white_card_required"
                      checked={settings.white_card_required}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, white_card_required: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="block_expired">Block Expired Cards</Label>
                      <p className="text-sm text-muted-foreground">
                        Prevent check-in if white card is expired
                      </p>
                    </div>
                    <Switch
                      id="block_expired"
                      checked={settings.block_expired_entry}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, block_expired_entry: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="grace_period">Grace Period</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow check-in with recently expired cards
                      </p>
                    </div>
                    <Switch
                      id="grace_period"
                      checked={settings.allow_expired_grace_period}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, allow_expired_grace_period: checked }))
                      }
                    />
                  </div>
                  
                  {settings.allow_expired_grace_period && (
                    <div className="space-y-2 ml-4">
                      <Label htmlFor="grace_period_days">Grace Period (days)</Label>
                      <Select
                        value={settings.grace_period_days}
                        onValueChange={(value) => 
                          setSettings(prev => ({ ...prev, grace_period_days: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 day</SelectItem>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <Button onClick={handleSaveTab} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Compliance Settings
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Configuration (Optional)
                </CardTitle>
                <CardDescription>
                  Configure SMTP settings for sending email notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtp_host">SMTP Host</Label>
                    <Input
                      id="smtp_host"
                      placeholder="smtp.gmail.com"
                      value={settings.smtp_host}
                      onChange={(e) => setSettings(prev => ({ ...prev, smtp_host: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp_port">SMTP Port</Label>
                    <Input
                      id="smtp_port"
                      placeholder="587"
                      value={settings.smtp_port}
                      onChange={(e) => setSettings(prev => ({ ...prev, smtp_port: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp_user">SMTP Username</Label>
                    <Input
                      id="smtp_user"
                      placeholder="your-email@gmail.com"
                      value={settings.smtp_user}
                      onChange={(e) => setSettings(prev => ({ ...prev, smtp_user: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp_password">SMTP Password</Label>
                    <Input
                      id="smtp_password"
                      type="password"
                      placeholder="••••••••"
                      value={settings.smtp_password}
                      onChange={(e) => setSettings(prev => ({ ...prev, smtp_password: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp_from_email">From Email</Label>
                    <Input
                      id="smtp_from_email"
                      type="email"
                      placeholder="noreply@baysidebuilders.com.au"
                      value={settings.smtp_from_email}
                      onChange={(e) => setSettings(prev => ({ ...prev, smtp_from_email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp_from_name">From Name</Label>
                    <Input
                      id="smtp_from_name"
                      placeholder="Bayside Builders WA"
                      value={settings.smtp_from_name}
                      onChange={(e) => setSettings(prev => ({ ...prev, smtp_from_name: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  SMS Configuration (Optional)
                </CardTitle>
                <CardDescription>
                  Configure SMS provider for text message notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sms_provider">SMS Provider</Label>
                  <Select
                    value={settings.sms_provider}
                    onValueChange={(value) => 
                      setSettings(prev => ({ ...prev, sms_provider: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="clicksend">ClickSend</SelectItem>
                      <SelectItem value="sms_broadcast">SMS Broadcast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {settings.sms_provider === 'twilio' && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sms_account_sid">Account SID</Label>
                      <Input
                        id="sms_account_sid"
                        placeholder="ACxxxxxxxxxx"
                        value={settings.sms_account_sid}
                        onChange={(e) => setSettings(prev => ({ ...prev, sms_account_sid: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sms_auth_token">Auth Token</Label>
                      <Input
                        id="sms_auth_token"
                        type="password"
                        placeholder="••••••••"
                        value={settings.sms_auth_token}
                        onChange={(e) => setSettings(prev => ({ ...prev, sms_auth_token: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="sms_from_number">From Number</Label>
                      <Input
                        id="sms_from_number"
                        placeholder="+61400000000"
                        value={settings.sms_from_number}
                        onChange={(e) => setSettings(prev => ({ ...prev, sms_from_number: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                <Button onClick={handleSaveTab} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Integration Settings
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppSidebar>
  )
}