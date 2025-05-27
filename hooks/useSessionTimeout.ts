"use client"

import { useEffect, useState, useRef, useCallback } from "react"

type UseSessionTimeoutProps = {
  timeoutInMinutes: number
  warningInSeconds: number
  onTimeout: () => Promise<void> | void
  isAuthenticated: boolean
}

export const useSessionTimeout = ({
  timeoutInMinutes,
  warningInSeconds,
  onTimeout,
  isAuthenticated,
}: UseSessionTimeoutProps) => {
  const [showWarning, setShowWarning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  // Convert minutes to milliseconds
  const timeoutInMs = timeoutInMinutes * 60 * 1000
  const warningInMs = warningInSeconds * 1000

  // Refs to store timers
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const warningRef = useRef<NodeJS.Timeout | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityRef = useRef<number>(Date.now())
  const isAuthenticatedRef = useRef<boolean>(isAuthenticated)

  // Update the ref when isAuthenticated changes
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated
  }, [isAuthenticated])

  // Debug logging
  //useEffect(() => {
    // console.log("🔧 Session timeout hook initialized:", {
  //     isAuthenticated,
  //     timeoutInMinutes,
  //     warningInSeconds,
  //     timeoutInMs,
  //     warningInMs,
  //   })
  // }, [isAuthenticated, timeoutInMinutes, warningInSeconds, timeoutInMs, warningInMs])

  // Handle timeout
  const handleTimeout = useCallback(async () => {
    // console.log("⏰ Session timeout triggered! isAuthenticated:", isAuthenticatedRef.current)
    if (isAuthenticatedRef.current) {
      setShowWarning(false)
      // console.log("🚪 Calling onTimeout function...")
      await onTimeout()
      // console.log("✅ onTimeout completed") // ✅ Add this
    } else {
      // console.log("❌ User not authenticated, skipping timeout")
    }
  }, [onTimeout])

  // Clear all timers
  const clearAllTimers = useCallback(() => {
    if (timeoutRef.current) {
      console.log("🧹 Clearing timeout timer")
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (warningRef.current) {
      console.log("🧹 Clearing warning timer")
      clearTimeout(warningRef.current)
      warningRef.current = null
    }
    if (intervalRef.current) {
      console.log("🧹 Clearing interval timer")
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Reset timers and start countdown again
  const resetTimeout = useCallback(() => {
    const now = Date.now()
    lastActivityRef.current = now

    console.log(
      "🔄 Resetting timeout. isAuthenticated:",
      isAuthenticatedRef.current,
      "Time:",
      new Date(now).toLocaleTimeString(),
    )

    if (!isAuthenticatedRef.current) {
      console.log("❌ User not authenticated, skipping timeout setup")
      clearAllTimers()
      setShowWarning(false)
      return
    }

    // Clear existing timers
    clearAllTimers()

    // Hide warning if it's showing
    setShowWarning(false)

    const warningTime = timeoutInMs - warningInMs

    // console.log("⏱️ Setting up new timers...")
    // console.log(`📢 Warning will show in: ${warningTime / 1000} seconds (${warningTime / 60000} minutes)`)
    // console.log(`⏰ Timeout will occur in: ${timeoutInMs / 1000} seconds (${timeoutInMs / 60000} minutes)`)

    // Set warning timer
    warningRef.current = setTimeout(() => {
      // console.log("⚠️ WARNING TIMER TRIGGERED - showing warning dialog")
      setShowWarning(true)
      setTimeLeft(warningInSeconds)

      // Start countdown interval
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1
          // console.log("⏳ Countdown:", newTime)
          if (newTime <= 0) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            // console.log("🚨 Countdown hit zero. Triggering auto-logout.")
            handleTimeout() // Force logout
            return 0
          }
          return newTime
        })
      }, 1000)
    }, warningTime)

    // Set timeout timer
    timeoutRef.current = setTimeout(() => {
      //console.log("💥 TIMEOUT TIMER TRIGGERED - calling handleTimeout")
      handleTimeout()
    }, timeoutInMs)

    // console.log("✅ Timers set up successfully")
    // console.log("🎯 Warning timer ID:", warningRef.current)
    // console.log("🎯 Timeout timer ID:", timeoutRef.current)
  }, [timeoutInMs, warningInMs, warningInSeconds, handleTimeout, clearAllTimers])

  // Function to dismiss warning and reset timeout
  const dismissWarning = useCallback(() => {
    //console.log("✋ Warning dismissed by user")
    setShowWarning(false)
    resetTimeout()
  }, [resetTimeout])

  // Track user activity - ONLY set up once when component mounts
  useEffect(() => {
    //console.log("🎮 Setting up activity tracking. isAuthenticated:", isAuthenticated)

    if (!isAuthenticated) {
      //console.log("❌ User not authenticated, skipping activity tracking")
      clearAllTimers()
      setShowWarning(false)
      return
    }

    // Reset timeout on mount
    resetTimeout()

    // Events to track
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]

    // Event handler
    const handleUserActivity = (event: Event) => {
      const now = Date.now()
      const timeSinceLastActivity = now - lastActivityRef.current

      // Only reset if it's been more than 1 second since last activity (debounce)
      if (timeSinceLastActivity > 1000) {
        console.log("👆 User activity detected:", event.type, "at", new Date(now).toLocaleTimeString())
        resetTimeout()
      }
    }

    console.log("📡 Adding event listeners for:", events)

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity, true)
    })

    // Cleanup function - ONLY runs when component unmounts or isAuthenticated changes
    return () => {
      console.log("🧹 Cleaning up session timeout - component unmounting or auth changed")
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity, true)
      })
      clearAllTimers()
    }
  }, [isAuthenticated]) // ONLY depend on isAuthenticated, not resetTimeout

  // Separate effect to handle resetTimeout updates without recreating the entire activity tracking
  useEffect(() => {
    if (isAuthenticated) {
      resetTimeout()
    }
  }, [resetTimeout, isAuthenticated])

  // Debug state changes
  useEffect(() => {
    console.log("📊 Session timeout state changed:", {
      showWarning,
      timeLeft,
      isAuthenticated,
      hasWarningTimer: !!warningRef.current,
      hasTimeoutTimer: !!timeoutRef.current,
      hasIntervalTimer: !!intervalRef.current,
    })
  }, [showWarning, timeLeft, isAuthenticated])

  return { showWarning, timeLeft, dismissWarning }
}

export default useSessionTimeout
