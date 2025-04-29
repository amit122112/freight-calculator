"use client"

import type React from "react"
import { useState } from "react"
import { Plus } from 'lucide-react'
import { useRouter } from "next/navigation"
import ItemRow from "./ItemRow"
import type { ShipmentFormData, ShipmentItem } from "../app/types/shipment"

export default function ShipmentForm() {
  const router = useRouter()

  // Default empty item template
  const emptyItem: ShipmentItem ={
    description: "",
    category: "",
    quantity: "1",
    weight:"",
    dimensions: {
      length: "",
      width: "",
      height: ""
    },
  }
  

  const [formData, setFormData] = useState<ShipmentFormData>({
    pickupAddress: "",
    deliveryAddress: "",
    shippingOption: "",
    specialInstructions: "",
    items: [{ ...emptyItem }], // Start with one empty item
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleItemChange = (index: number, updatedItem: ShipmentItem) => {
    const updatedItems = [...formData.items]
    updatedItems[index] = updatedItem
    setFormData({ ...formData, items: updatedItems })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { ...emptyItem }],
    })
  }

  const removeItem = (index: number) => {
    const updatedItems = [...formData.items]
    updatedItems.splice(index, 1)
    setFormData({ ...formData, items: updatedItems })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
    // You would typically send this data to your API here

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
    formData.items.every(
      (item) =>
        item.description &&
        item.category &&
        item.quantity &&
        item.weight &&
        item.dimensions.length &&
        item.dimensions.width &&
        item.dimensions.height,
    )
  

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-4xl">
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
            className="border border-gray-400 text-black p-2 w-full rounded"
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
            className="border border-gray-400 text-black p-2 w-full rounded"
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
          className="border border-gray-400 text-black p-2 w-full rounded"
          required
        >
          <option value="">Select Shipping Method</option>
          <option value="air">Air Freight</option>
          <option value="sea">Sea Freight</option>
          <option value="land">Land Freight</option>
        </select>
      </div>

      {/* Items Section */}
      <div className="mb-6 text-gray-500">
        <div className="flex border-gray-400 text-black justify-between items-center mb-4">
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
        <label className="block font-semibold text-black mb-2">Special Instructions (Optional)</label>
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
          onClick={() => router.push("/dashboard")}
          className="px-6 py-2 border rounded hover:bg-gray-100 text-black"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isFormValid}
          className={`px-6 py-2 rounded transition duration-200 ${
            !isFormValid ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Request Quote
        </button>
      </div>
    </form>
  )
}
