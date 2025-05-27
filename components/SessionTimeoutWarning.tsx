"use client"

//import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import {useEffect} from "react"

interface SessionTimeoutWarningProps {
  timeLeft: number
  onContinue: () => void
}

export function SessionTimeoutWarning({ timeLeft, onContinue }: SessionTimeoutWarningProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center gap-2 text-amber-600 mb-4">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Session Timeout Warning</h2>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Your session is about to expire due to inactivity. You will be logged out in{" "}
            <span className="font-bold text-red-600">{timeLeft}</span> seconds.
          </p>
          <p className="text-gray-700 dark:text-gray-300">Click "Continue Session" to stay logged in.</p>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onContinue}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Continue Session
          </button>
        </div>
      </div>
    </div>
  )
}

// Make sure to export as default as well
export default SessionTimeoutWarning
