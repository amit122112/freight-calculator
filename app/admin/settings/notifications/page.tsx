"use client"

import { useState, useEffect } from "react"
import { Bell, AlertTriangle, Save } from "lucide-react"
import { useNotificationSettings } from "@/contexts/NotificationContext"

export default function NotificationSettings() {
  const { settings, updateSettings, isLoading } = useNotificationSettings()
  const [localSettings, setLocalSettings] = useState(settings)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState("")

  // Update local settings when context settings change
  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handlePushToggle = (setting: keyof typeof settings.pushNotifications) => {
    setLocalSettings((prev) => ({
      ...prev,
      pushNotifications: {
        ...prev.pushNotifications,
        [setting]: !prev.pushNotifications[setting],
      },
    }))
    setSaveSuccess(false)
    setSaveError("")
  }

  const handleSave = async () => {
    setSaveSuccess(false)
    setSaveError("")

    const success = await updateSettings(localSettings)

    if (success) {
      setSaveSuccess(true)
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } else {
      setSaveError("Failed to save notification preferences. Please try again.")
    }
  }

  // Check if settings have changed
  const hasChanges = JSON.stringify(localSettings) !== JSON.stringify(settings)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-black">Notification Preferences</h2>
          <p className="text-gray-600">Manage how you receive notifications</p>
        </div>

        <button
          onClick={handleSave}
          disabled={isLoading || !hasChanges}
          className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
            hasChanges && !isLoading
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Preferences
            </>
          )}
        </button>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center text-green-700">
          <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
          <span>Your notification preferences have been saved successfully.</span>
        </div>
      )}

      {saveError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
          <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Push Notifications */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-md text-purple-700">
              <Bell size={20} />
            </div>
            <h3 className="text-lg font-medium text-black">Push Notifications</h3>
          </div>

          <div className="space-y-4">
            {Object.entries(localSettings.pushNotifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800 capitalize">
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  </p>
                  <p className="text-sm text-gray-500">{getNotificationDescription("push", key)}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={value}
                    onChange={() => handlePushToggle(key as keyof typeof settings.pushNotifications)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to get notification descriptions
function getNotificationDescription(type: string, key: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    push: {
      newShipment: "Receive push notifications",
    },
  }

  return descriptions[type]?.[key] || "Notification preference"
}
