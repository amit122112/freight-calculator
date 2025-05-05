"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Calculator, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import ItemRow from "./ItemRow"
import type { ShipmentFormData, ShipmentItem } from "../app/types/shipment"

export default function ShipmentForm() {
  const router = useRouter()

  // Default empty item template
  const emptyItem: ShipmentItem = {
    description: "",
    category: "",
    quantity: "1",
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
  }

  const [formData, setFormData] = useState<ShipmentFormData>({
    pickupAddress: "",
    deliveryAddress: "",
    shippingOption: "",
    specialInstructions: "",
    items: [{ ...emptyItem }], // Start with one empty item
  })

  // New states for calculation functionality
  const [error, setError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false)
  const [calculationDone, setCalculationDone] = useState(false)
  const [calculationResults, setCalculationResults] = useState<{
    estimatedCost: number
    estimatedDeliveryTime: string
    distance: number
    fuelSurcharge: number
    taxes: number
    totalCost: number
  } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value

    setFormData({ ...formData, [name]: newValue })

    // Reset calculation when form data changes
    if (calculationDone) {
      setCalculationDone(false)
      setCalculationResults(null)
    }
  }

  const handleItemChange = (index: number, updatedItem: ShipmentItem) => {
    const updatedItems = [...formData.items]

    // Validate quantity if it was changed
    if ("quantity" in updatedItem && updatedItem.quantity !== formData.items[index].quantity) {
      const quantity = Number.parseInt(updatedItem.quantity, 10)
      if (isNaN(quantity) || !Number.isInteger(quantity) || quantity < 1) {
        // Invalid quantity - we'll let the ItemRow component handle the error message
        console.error("Invalid quantity value:", updatedItem.quantity)
      }
    }
    updatedItems[index] = updatedItem
    setFormData({ ...formData, items: updatedItems })

    // Reset calculation when items change
    if (calculationDone) {
      setCalculationDone(false)
      setCalculationResults(null)
    }
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { ...emptyItem }],
    })

    // Reset calculation when items are added
    if (calculationDone) {
      setCalculationDone(false)
      setCalculationResults(null)
    }
  }

  const removeItem = (index: number) => {
    const updatedItems = [...formData.items]
    updatedItems.splice(index, 1)
    setFormData({ ...formData, items: updatedItems })

    // Reset calculation when items are removed
    if (calculationDone) {
      setCalculationDone(false)
      setCalculationResults(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
    // Send this data to your API here

    // Simulate successful submission
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  // Calculate total weight
  const totalWeight = formData.items.reduce(
    (sum, item) => sum + (Number.parseFloat(item.weight) * Number.parseInt(item.quantity) || 0),
    0,
  )

  const isFormValid =
  formData.pickupAddress &&
  formData.deliveryAddress &&
  formData.shippingOption &&
  formData.items.length > 0 &&
  formData.items.every((item) => {
    // Check if quantity is a valid positive integer not less than 1
    const quantity = Number.parseInt(item.quantity, 10)
    const isValidQuantity = !isNaN(quantity) && Number.isInteger(quantity) && quantity >= 1

    return (
      item.description &&
      item.category &&
      isValidQuantity &&
      item.weight &&
      item.dimensions.length &&
      item.dimensions.width &&
      item.dimensions.height
    )
  })

  // Function to handle calculation
  const handleCalculate = async () => {
    // if (!isFormValid) return

    // setIsCalculating(true)

    // try {
    //   // Simulate API call to backend for calculation
    //   await new Promise((resolve) => setTimeout(resolve, 1500))

    //   // Mock calculation results
    //   const distance = Math.floor(Math.random() * 1000) + 100 // Random distance between 100-1100 km
    //   const baseRate = formData.shippingOption === "express" ? 2.5 : 1.2 // Higher rate for express
    //   const estimatedCost = totalWeight * baseRate * (distance / 100)
    //   const fuelSurcharge = estimatedCost * 0.15 // 15% fuel surcharge
    //   const taxes = (estimatedCost + fuelSurcharge) * 0.1 // 10% tax
    //   const totalCost = estimatedCost + fuelSurcharge + taxes

    //   // Determine delivery time based on shipping option
    //   let estimatedDeliveryTime
    //   switch (formData.shippingOption) {
    //     case "express":
    //       estimatedDeliveryTime = "1-2 business days"
    //       break
    //     case "air":
    //       estimatedDeliveryTime = "2-3 business days"
    //       break
    //     case "sea":
    //       estimatedDeliveryTime = "7-14 business days"
    //       break
    //     default:
    //       estimatedDeliveryTime = "3-5 business days"
    //   }

    //   // Set calculation results
    //   setCalculationResults({
    //     estimatedCost: Number.parseFloat(estimatedCost.toFixed(2)),
    //     estimatedDeliveryTime,
    //     distance,
    //     fuelSurcharge: Number.parseFloat(fuelSurcharge.toFixed(2)),
    //     taxes: Number.parseFloat(taxes.toFixed(2)),
    //     totalCost: Number.parseFloat(totalCost.toFixed(2)),
    //   })

    //   setCalculationDone(true)
    // } catch (error) {
    //   console.error("Calculation error:", error)
    // } finally {
    //   setIsCalculating(false)
    // }

    setIsCalculating(true);
  setCalculationDone(false);
  setError("");

  try {
    const token = localStorage.getItem("authToken");

    const payload = {
      pick_up_address: formData.pickupAddress,
      delivery_address: formData.deliveryAddress,
      shipping_option: formData.shippingOption,
      shipments: formData.items.map(item => ({
        description: item.description,
        category: item.category,
        quantity: item.quantity,
        weight: item.weight,
        length: item.dimensions.length,
        width: item.dimensions.width,
        height: item.dimensions.height,
      }))
    };

    const res = await fetch("https://hungryblogs.com/api/GetQuote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to get quote.");
    }

    setCalculationResults(data);
    setCalculationDone(true);
  } catch (err: any) {
    setError(err.message || "Server error");
  } finally {
    setIsCalculating(false);
  }
  }

  // Function to handle quote request
  const handleRequestQuote = async () => {
    if (!calculationDone) return

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Quote requested with data:", {
        ...formData,
        calculationResults,
      })

      // Redirect to dashboard after successful quote request
      router.push("/dashboard")
    } catch (error) {
      console.error("Error requesting quote:", error)
    }
  }

    // Function to clear the form
  const clearForm = () => {
    setFormData({
      pickupAddress: "",
      deliveryAddress: "",
      shippingOption: "",
      specialInstructions: "",
      items: [{ ...emptyItem }], // Reset to one empty item
    })
    setCalculationDone(false)
    setCalculationResults(null)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl">
      <h2 className="text-xl font-bold text-black mb-4">Shipment Details</h2>
      <p className="text-gray-600 mb-6">Enter pickup and delivery information and add your items.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Pickup Address */}
        <div>
          <label className="block font-semibold text-black mb-2">Pickup Address</label>
          <input
            type="text"
            name="pickupAddress"
            value={formData.pickupAddress}
            onChange={handleChange}
            placeholder="Enter Pickup Address"
            className="border text-black p-2 w-full rounded"
            required
          />
        </div>

        {/* Delivery Address */}
        <div>
          <label className="block font-semibold text-black mb-2">Delivery Address</label>
          <input
            type="text"
            name="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={handleChange}
            placeholder="Enter Delivery Address"
            className="border text-black p-2 w-full rounded"
            required
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-semibold text-black mb-2">Shipping Option</label>
        <select
          name="shippingOption"
          value={formData.shippingOption}
          onChange={handleChange}
          className="border text-black p-2 w-full rounded"
          required
        >
          <option value="">Select Shipping Method</option>
          <option value="air">Air Freight</option>
          <option value="sea">Sea Freight</option>
          <option value="land">Land Freight</option>
        </select>
      </div>

      {/* Items Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black">Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>

        {formData.items.map((item, index) => (
          <ItemRow
            key={index}
            item={item}
            index={index}
            onChange={handleItemChange}
            onRemove={removeItem}
            isRemovable={formData.items.length > 1}
          />
        ))}

        {/* Items Summary */}
        {formData.items.length > 0 && (
          <div className="mt-6 p-4 border rounded-md bg-blue-50">
            <h3 className="font-semibold text-black mb-2">Shipment Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-700">Total Items:</p>
                <p className="font-medium text-black">{formData.items.length} different items</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Total Quantity:</p>
                <p className="font-medium text-black">
                  {formData.items.reduce((sum, item) => sum + (Number.parseInt(item.quantity) || 0), 0)} pieces
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Total Weight:</p>
                <p className="font-medium text-black">{totalWeight.toFixed(2)} kg</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <label className="block font-semibold text-black mb-2">Instructions (Optional)</label>
        <textarea
          name="specialInstructions"
          value={formData.specialInstructions}
          onChange={handleChange}
          placeholder="Any special handling instructions or notes"
          className="border border-gray-400 text-black p-2 w-full rounded h-24 resize-none"
        ></textarea>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4 mt-8">
        <button
          type="button"
          onClick={clearForm}
          className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 text-gray-700 flex items-center gap-2"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleCalculate}
          disabled={!isFormValid || isCalculating}
          className={`px-6 py-2 rounded flex items-center gap-2 transition duration-200 ${
            !isFormValid || isCalculating
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isCalculating ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              Calculating...
            </>
          ) : (
            <>
              <Calculator size={16} />
              Calculate
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleRequestQuote}
          disabled={!calculationDone}
          className={`px-6 py-2 rounded flex items-center gap-2 transition duration-200 ${
            !calculationDone
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          <Send size={16} />
          Request Quote
        </button>
      </div>

      {/* Calculation Results Section */}
      {/* {calculationResults && (
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-bold text-black mb-4">Calculation Results</h2>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-4">Shipment Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Distance:</p>
                    <p className="font-medium text-black">{calculationResults.distance} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estimated Delivery Time:</p>
                    <p className="font-medium text-black">{calculationResults.estimatedDeliveryTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Shipping Method:</p>
                    <p className="font-medium text-black capitalize">{formData.shippingOption}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-4">Cost Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Base Cost:</p>
                    <p className="font-medium text-black">${calculationResults.estimatedCost.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Fuel Surcharge:</p>
                    <p className="font-medium text-black">${calculationResults.fuelSurcharge.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Taxes:</p>
                    <p className="font-medium text-black">${calculationResults.taxes.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <p className="font-semibold text-gray-800">Total Cost:</p>
                    <p className="font-bold text-green-700">${calculationResults.totalCost.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This is an estimated quote. Final pricing may vary based on actual weight, dimensions, and other factors. Click "Request Quote" to receive an official quote from us.
              </p>
            </div>
          </div>
        </div>
      )} */}

{calculationDone && calculationResults && (
  <div className="mt-4 space-y-4">
  {calculationResults.map((option: any, idx: number) => (
    <div key={idx} className="p-4 bg-green-100 text-green-800 rounded shadow">
      <p><strong>Transport:</strong> {option.Transport_name}</p>
      <p><strong>Price:</strong> ${option.Price}</p>
    </div>
  ))}
</div>
)}

{error && (
  <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
    <p>Error: {error}</p>
  </div>
)}

    </div>
  )
}
