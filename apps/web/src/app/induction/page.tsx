"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function InductionRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace("/induction-booklet")
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p>Redirecting to induction booklet...</p>
    </div>
  )
}