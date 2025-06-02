"use client"

import { useState } from "react"
import { Bell, Mail, AlertTriangle, Save } from "lucide-react"

// Define proper types for our notification settings
type EmailNotificationSettings = {
  newShipment: boolean
}

type PushNotificationSettings = {
  newShipment: boolean
}


type NotificationSettings = {
  emailNotifications: EmailNotificationSettings
  pushNotifications: PushNotificationSettings
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: {
      newShipment: true
    },
    pushNotifications: {
      newShipment: true
    }
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Type-safe toggle handlers for each category
  const handleEmailToggle = (setting: keyof EmailNotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [setting]: !prev.emailNotifications[setting],
      },
    }))
    setSaveSuccess(false)
  }

  const handlePushToggle = (setting: keyof PushNotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      pushNotifications: {
        ...prev.pushNotifications,
        [setting]: !prev.pushNotifications[setting],
      },
    }))
    setSaveSuccess(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSaving(false)
    setSaveSuccess(true)

    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false)
    }, 3000)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-black">Notification Preferences</h2>
          <p className="text-gray-600">Manage how you receive notifications</p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {isSaving ? (
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

      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-md text-blue-700">
              <Mail size={20} />
            </div>
            <h3 className="text-lg font-medium text-black">Email Notifications</h3>
          </div>

          <div className="space-y-4">
            {Object.entries(settings.emailNotifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800 capitalize">
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  </p>
                  <p className="text-sm text-gray-500">{getNotificationDescription("email", key)}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={value}
                    onChange={() => handleEmailToggle(key as keyof EmailNotificationSettings)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-md text-purple-700">
              <Bell size={20} />
            </div>
            <h3 className="text-lg font-medium text-black">Push Notifications</h3>
          </div>

          <div className="space-y-4">
            {Object.entries(settings.pushNotifications).map(([key, value]) => (
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
                    onChange={() => handlePushToggle(key as keyof PushNotificationSettings)}
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
    email: {
      newShipment: "Receive emails when new shipments are created"
    },
    push: {
      newShipment: "Receive push notifications for new shipments"
    },
  }

  return descriptions[type]?.[key] || "Notification preference"
}
