"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface NotificationSettings {
  emailNotifications: {
    newShipment: boolean
  }
  pushNotifications: {
    newShipment: boolean
  }
}

interface NotificationContextType {
  settings: NotificationSettings
  updateSettings: (newSettings: NotificationSettings) => Promise<boolean>
  isLoading: boolean
}

const defaultSettings: NotificationSettings = {
  emailNotifications: {
    newShipment: true,
  },
  pushNotifications: {
    newShipment: true,
  },
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(false)

  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("notification_settings")
      if (savedSettings) {
        try {
          setSettings(JSON.parse(savedSettings))
        } catch (error) {
          console.error("Error parsing notification settings:", error)
        }
      }
    }
  }, [])

  const updateSettings = async (newSettings: NotificationSettings): Promise<boolean> => {
    setIsLoading(true)

    try {
      
      if (typeof window !== "undefined") {
        localStorage.setItem("notification_settings", JSON.stringify(newSettings))
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSettings(newSettings)
      return true
    } catch (error) {
      console.error("Error updating notification settings:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <NotificationContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotificationSettings() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotificationSettings must be used within a NotificationProvider")
  }
  return context
}
