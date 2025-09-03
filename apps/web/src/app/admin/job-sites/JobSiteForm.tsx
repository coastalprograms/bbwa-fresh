'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Save, MapPin, AlertCircle } from 'lucide-react'

interface JobSiteFormProps {
  jobSite?: {
    id: string
    name: string
    address?: string
    lat: number
    lng: number
    radius_m?: number
    active?: boolean
  }
}

export default function JobSiteForm({ jobSite }: JobSiteFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [gettingLocation, setGettingLocation] = useState(false)
  
  const [formData, setFormData] = useState({
    name: jobSite?.name || '',
    address: jobSite?.address || '',
    lat: jobSite?.lat?.toString() || '',
    lng: jobSite?.lng?.toString() || '',
    radius_m: jobSite?.radius_m?.toString() || '500',
    active: jobSite?.active ?? true
  })

  const handleGetCurrentLocation = () => {
    setGettingLocation(true)
    setError(null)
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          lat: position.coords.latitude.toString(),
          lng: position.coords.longitude.toString()
        }))
        setGettingLocation(false)
      },
      (error) => {
        console.error('Geolocation error:', error)
        setError('Unable to get your location. Please enter coordinates manually.')
        setGettingLocation(false)
      }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate required fields
    if (!formData.name || !formData.lat || !formData.lng) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    // Validate coordinates
    const lat = parseFloat(formData.lat)
    const lng = parseFloat(formData.lng)
    
    if (isNaN(lat) || isNaN(lng)) {
      setError('Please enter valid coordinates')
      setLoading(false)
      return
    }

    if (lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90')
      setLoading(false)
      return
    }

    if (lng < -180 || lng > 180) {
      setError('Longitude must be between -180 and 180')
      setLoading(false)
      return
    }

    const radius = parseInt(formData.radius_m) || 500
    if (radius < 50 || radius > 5000) {
      setError('Radius must be between 50 and 5000 meters')
      setLoading(false)
      return
    }

    try {
      const url = jobSite 
        ? `/api/admin/job-sites/${jobSite.id}`
        : '/api/admin/job-sites'
      
      const method = jobSite ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address || null,
          lat,
          lng,
          radius_m: radius,
          active: formData.active
        }),
      })

      if (response.ok) {
        router.push('/admin/job-sites')
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to save job site')
      }
    } catch (error) {
      console.error('Error saving job site:', error)
      setError('An error occurred while saving the job site')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{jobSite ? 'Edit Job Site' : 'Add New Job Site'}</CardTitle>
          <CardDescription>
            Configure the job site details and geolocation for worker check-ins
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Site Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Site Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Bayside Plaza Construction"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="e.g., 123 Main St, Perth WA 6000"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            />
            <p className="text-sm text-muted-foreground">
              Optional: Help workers identify the site location
            </p>
          </div>

          {/* Coordinates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>GPS Coordinates *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGetCurrentLocation}
                disabled={gettingLocation}
              >
                {gettingLocation ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Use Current Location
                  </>
                )}
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lat">Latitude *</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  placeholder="e.g., -31.9505"
                  value={formData.lat}
                  onChange={(e) => setFormData(prev => ({ ...prev, lat: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lng">Longitude *</Label>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  placeholder="e.g., 115.8605"
                  value={formData.lng}
                  onChange={(e) => setFormData(prev => ({ ...prev, lng: e.target.value }))}
                  required
                />
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              These coordinates will be used to verify worker check-ins
            </p>
          </div>

          {/* Check-in Radius */}
          <div className="space-y-2">
            <Label htmlFor="radius">Check-in Radius (meters)</Label>
            <Input
              id="radius"
              type="number"
              min="50"
              max="5000"
              step="50"
              value={formData.radius_m}
              onChange={(e) => setFormData(prev => ({ ...prev, radius_m: e.target.value }))}
            />
            <p className="text-sm text-muted-foreground">
              Workers must be within this distance to check in (50-5000m)
            </p>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="active">Site Active</Label>
              <p className="text-sm text-muted-foreground">
                Allow workers to check in at this site
              </p>
            </div>
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, active: checked }))
              }
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {jobSite ? 'Update Job Site' : 'Create Job Site'}
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/job-sites')}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}