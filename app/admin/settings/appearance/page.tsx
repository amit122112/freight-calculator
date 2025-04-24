"use client"

import { useState } from "react"
import { Sun, Moon, Monitor, Check, Save } from "lucide-react"

export default function AppearanceSettings() {
  const [theme, setTheme] = useState("light")
  const [fontSize, setFontSize] = useState("medium")
  const [density, setDensity] = useState("comfortable")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

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
          <h2 className="text-xl font-semibold text-black">Appearance</h2>
          <p className="text-gray-600">Customize how the dashboard looks</p>
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
          <Check size={20} className="mr-2 flex-shrink-0" />
          <span>Your appearance settings have been saved successfully.</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Theme Selection */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium text-black mb-4">Theme</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`border rounded-lg p-4 cursor-pointer ${
                theme === "light" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => setTheme("light")}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="p-2 bg-white rounded-md shadow">
                  <Sun size={20} className="text-yellow-500" />
                </div>
                {theme === "light" && <Check size={20} className="text-blue-500" />}
              </div>
              <h4 className="font-medium text-black">Light</h4>
              <p className="text-sm text-gray-500">Light background with dark text</p>
            </div>

            <div
              className={`border rounded-lg p-4 cursor-pointer ${
                theme === "dark" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => setTheme("dark")}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="p-2 bg-gray-800 rounded-md shadow">
                  <Moon size={20} className="text-gray-100" />
                </div>
                {theme === "dark" && <Check size={20} className="text-blue-500" />}
              </div>
              <h4 className="font-medium text-black">Dark</h4>
              <p className="text-sm text-gray-500">Dark background with light text</p>
            </div>

            <div
              className={`border rounded-lg p-4 cursor-pointer ${
                theme === "system" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => setTheme("system")}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="p-2 bg-gray-100 rounded-md shadow">
                  <Monitor size={20} className="text-gray-700" />
                </div>
                {theme === "system" && <Check size={20} className="text-blue-500" />}
              </div>
              <h4 className="font-medium text-black">System</h4>
              <p className="text-sm text-gray-500">Follow system theme settings</p>
            </div>
          </div>
        </div>

        {/* Font Size */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium text-black mb-4">Font Size</h3>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="fontSize"
                checked={fontSize === "small"}
                onChange={() => setFontSize("small")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm">Small</span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="fontSize"
                checked={fontSize === "medium"}
                onChange={() => setFontSize("medium")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-base">Medium (Default)</span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="fontSize"
                checked={fontSize === "large"}
                onChange={() => setFontSize("large")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-lg">Large</span>
            </label>
          </div>
        </div>

        {/* Density */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium text-black mb-4">Density</h3>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="density"
                checked={density === "compact"}
                onChange={() => setDensity("compact")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2">Compact</span>
              <span className="ml-2 text-xs text-gray-500">Show more content with less spacing</span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="density"
                checked={density === "comfortable"}
                onChange={() => setDensity("comfortable")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2">Comfortable (Default)</span>
              <span className="ml-2 text-xs text-gray-500">Balanced spacing</span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="density"
                checked={density === "spacious"}
                onChange={() => setDensity("spacious")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2">Spacious</span>
              <span className="ml-2 text-xs text-gray-500">More breathing room between elements</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
