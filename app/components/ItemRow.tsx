"use client"

import type React from "react"

import { X } from "lucide-react"
import type { ShipmentItem } from "../types/shipment"

interface ItemRowProps {
  item: ShipmentItem
  index: number
  onChange: (index: number, updatedItem: ShipmentItem) => void
  onRemove: (index: number) => void
  isRemovable: boolean
}

export default function ItemRow({ item, index, onChange, onRemove, isRemovable }: ItemRowProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    onChange(index, { ...item, [name]: value })
  }

  return (
    <div className="p-4 border rounded-md bg-gray-50 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-black">Item #{index + 1}</h3>
        {isRemovable && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
          >
            <X size={18} />
            <span className="sr-only">Remove Item</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">Description</label>
          <input
            type="text"
            name="description"
            value={item.description}
            onChange={handleChange}
            placeholder="Item description"
            className="w-full border p-2 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Category</label>
          <select
            name="category"
            value={item.category}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          >
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="furniture">Furniture</option>
            <option value="documents">Documents</option>
            <option value="fragile">Fragile Items</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={item.quantity}
            onChange={handleChange}
            min="1"
            placeholder="Qty"
            className="w-full border p-2 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={item.weight}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            placeholder="Weight"
            className="w-full border p-2 rounded-md"
            required
          />
        </div>


      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">Length (cm)</label>
          <input
            type="number"
            name="length"
            value={item.dimensions.length}
            onChange={(e) => {
              onChange(index, {
                ...item,
                dimensions: { ...item.dimensions, length: e.target.value },
              })
            }}
            step="0.1"
            min="0.1"
            placeholder="Length"
            className="w-full border p-2 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Width (cm)</label>
          <input
            type="number"
            name="width"
            value={item.dimensions.width}
            onChange={(e) => {
              onChange(index, {
                ...item,
                dimensions: { ...item.dimensions, width: e.target.value },
              })
            }}
            step="0.1"
            min="0.1"
            placeholder="Width"
            className="w-full border p-2 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Height (cm)</label>
          <input
            type="number"
            name="height"
            value={item.dimensions.height}
            onChange={(e) => {
              onChange(index, {
                ...item,
                dimensions: { ...item.dimensions, height: e.target.value },
              })
            }}
            step="0.1"
            min="0.1"
            placeholder="Height"
            className="w-full border p-2 rounded-md"
            required
          />
        </div>
      </div>
    </div>
  )
}
