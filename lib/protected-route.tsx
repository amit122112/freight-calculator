"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../components/AuthProvider"

export function withAuth(Component: React.ComponentType) {
  return function ProtectedRoute(props: any) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && !user) {
        router.push("/login")
      }
    }, [loading, user, router])

    // Show loading or null while checking authentication
    if (loading || !user) {
      return <div>Loading...</div>
    }

    return <Component {...props} />
  }
}
