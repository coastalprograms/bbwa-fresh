'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { signInAction } from './actions'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Building2, ShieldCheck, HardHat, Hammer } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [csrfToken, setCsrfToken] = useState('')
  const errorRef = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    async function fetchToken() {
      try {
        const res = await fetch('/api/csrf', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to obtain CSRF token')
        const data = (await res.json()) as { token: string }
        setCsrfToken(data.token)
      } catch (e) {
        setError('Unable to initialise security token. Please refresh and try again.')
      }
    }
    fetchToken()
  }, [])

  useEffect(() => {
    if (error && errorRef.current) errorRef.current.focus()
  }, [error])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await signInAction({ email, password, csrfToken })
    if (result?.error) setError(result.error)
    setLoading(false)
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>
      
      {/* Centered Login Form */}
      <div className="relative z-10 w-full max-w-sm p-6">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-xl">
            <CardHeader className="space-y-3 pb-6">
              <div className="flex items-center justify-center mb-2">
                <Image 
                  src="/Logo.svg" 
                  alt="Bayside Builders Logo" 
                  width={64}
                  height={64}
                  className="h-16 w-auto"
                />
              </div>
              <CardTitle className="text-2xl text-center bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-center">
                Sign in to Bayside Builders Management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} noValidate>
                <div className="flex flex-col gap-5">
                  <div className="grid gap-2.5">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@baysidebuilders.com.au"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      disabled={loading}
                      className="h-11 bg-white"
                    />
                  </div>
                  <div className="grid gap-2.5">
                    <div className="flex items-center">
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-xs underline-offset-4 hover:underline text-muted-foreground hover:text-primary transition-colors"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                      autoComplete="current-password"
                      disabled={loading}
                      className="h-11 bg-white"
                    />
                  </div>
                  <input type="hidden" name="csrfToken" value={csrfToken} />
                  {error && (
                    <Alert variant="destructive" className="text-sm">
                      <AlertDescription ref={errorRef} tabIndex={-1}>
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg" 
                    disabled={loading || !csrfToken}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </Button>
                </div>
                <div className="mt-6 text-center text-xs text-muted-foreground">
                  Need access to the system?{" "}
                  <a href="#" className="font-medium underline underline-offset-4 hover:text-primary transition-colors">
                    Contact your administrator
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
      </div>
    </div>
  )
}
