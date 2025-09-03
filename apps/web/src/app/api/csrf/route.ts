import { NextResponse } from 'next/server'
import crypto from 'node:crypto'

export async function GET() {
  const token = crypto.randomBytes(16).toString('hex')
  const res = NextResponse.json({ token })
  // httpOnly so client JS can't read it; the form will send the token value from the API response
  res.cookies.set({
    name: 'csrf_token',
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
  return res
}
