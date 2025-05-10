"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Calculator, Send, Truck } from "lucide-react"
import { useRouter } from "next/navigation"
import ItemRow from "./ItemRow"
import type { ShipmentFormData, ShipmentItem } from "@/app/types/shipment"
import {API_TOKEN} from "@/lib/config"

// Define the carrier quote interface
interface CarrierQuote {
  transport_name: string
  price: number
  available: boolean
}

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

  // New state for carrier quotes
  const [carrierQuotes, setCarrierQuotes] = useState<CarrierQuote[]>([])
  const [isRequestingQuote, setIsRequestingQuote] = useState(false)
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value

    setFormData({ ...formData, [name]: newValue })

    // Reset calculation when form data changes
    if (calculationDone) {
      setCalculationDone(false)
      setCalculationResults(null)
      setCarrierQuotes([])
    }
  }

  const handleItemChange = (index: number, updatedItem: ShipmentItem) => {
    const updatedItems = [...formData.items]

    // Validate quantity if it was changed
    if ("quantity" in updatedItem && updatedItem.quantity !== formData.items[index].quantity) {
      const quantity = Number(updatedItem.quantity)
      if (isNaN(quantity) || !Number.isInteger(quantity) || quantity < 1 || updatedItem.quantity.includes(".")) {
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
      setCarrierQuotes([])
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
      setCarrierQuotes([])
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
      setCarrierQuotes([])
    }
  }

  // Calculate total weight
  const totalWeight = formData.items.reduce(
    (sum, item) => sum + (Number.parseFloat(item.weight) * Number.parseInt(item.quantity) || 0),
    0,
  )

  // Calculate total quantity
  const totalQuantity = formData.items.reduce((sum, item) => sum + (Number.parseInt(item.quantity) || 0), 0)

  const isFormValid =
    formData.pickupAddress &&
    formData.deliveryAddress &&
    formData.shippingOption &&
    formData.items.length > 0 &&
    formData.items.every((item) => {
      // Check if quantity is a valid positive integer not less than 1
      const quantity = Number(item.quantity)
      const isValidQuantity =
        !isNaN(quantity) && Number.isInteger(quantity) && quantity >= 1 && !item.quantity.includes(".")

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

  // New function to handle calculation with API call
  const handleCalculate = async () => {
    if (!isFormValid) return

    setIsCalculating(true)
    setCarrierQuotes([])

    try {
      //const token = localStorage.getItem("authToken");
      // Prepare the request payload
      const payload = {
        pick_up_address: formData.pickupAddress,
        delivery_address: formData.deliveryAddress,
        shipping_option: formData.shippingOption,
        shipments: formData.items.map((item) => ({
          description: item.description,
          category: item.category,
          quantity: item.quantity,
          weight: item.weight,
          length: item.dimensions.length,
          width: item.dimensions.width,
          height: item.dimensions.height,
        })),
      }

      // console.log("Sending to API:", JSON.stringify(payload, null, 2))

      // const token = localStorage.getItem("token")
      //   console.log(" Bearer Token being used:", token)

      //   if (!token) {
      //     alert("You are not logged in. Please log in to get a token.")
      //     return
      //   }


      const response = await fetch(`https://www.hungryblogs.com/api/GetQuote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": API_TOKEN
        },
        body: JSON.stringify(payload),
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(" Server Error Response:", errorText)
        throw new Error(`Failed to fetch carrier quotes: ${errorText}`)
      }
      
      const data: CarrierQuote[] = await response.json()
      
      console.log("API Quote Response:", data)

      // Mark unavailable carriers explicitly if not returned
      const allCarriers = ["TNT", "TGE"]
      const formattedQuotes = allCarriers.map((carrier) => {
        const match = data.find((q) => q.transport_name === carrier)
        return match
          ? { ...match, available: true }
          : { transport_name: carrier, price: 0, available: false }
      })

      
      
      setCarrierQuotes(formattedQuotes)
      

      setCalculationDone(true)
    } catch (error) {
      console.error("Calculation error:", error)
      // Handle error state here
    } finally {
      setIsCalculating(false)
    }
  }

  // Function to handle quote request for a specific carrier
  const handleRequestQuote = async (carrierName: string) => {
    setIsRequestingQuote(true)
    setSelectedCarrier(carrierName)

    try {
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Quote requested for carrier:", carrierName, "with data:", {
        ...formData,
        calculationResults,
      })

      // Redirect to dashboard after successful quote request
      router.push("/dashboard")
    } catch (error) {
      console.error("Error requesting quote:", error)
    } finally {
      setIsRequestingQuote(false)
      setSelectedCarrier(null)
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
    setCarrierQuotes([])
  }

  const totalLength = formData.items.reduce(
    (sum, item) => sum + (parseFloat(item.dimensions.length) || 0),
    0
  )
  const totalWidth = formData.items.reduce(
    (sum, item) => sum + (parseFloat(item.dimensions.width) || 0),
    0
  )
  const totalHeight = formData.items.reduce(
    (sum, item) => sum + (parseFloat(item.dimensions.height) || 0),
    0
  )
  

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
            className="border text-black border-gray-400 p-2 w-full rounded"
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
            className="border text-black border-gray-400 p-2 w-full rounded"
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
          className="border text-black border-gray-400 p-2 w-full rounded"
          required
        >
          <option value="">Select Shipping Method</option>
          <option value="air">Air Freight</option>
          <option value="sea">Sea Freight</option>
          <option value="road">Road Freight</option>
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
                <p className="font-medium text-black">{totalQuantity} pieces</p>
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
          className="border text-black border-gray-400 p-2 w-full rounded h-24 resize-none"
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
      </div>

      {/* Carrier Quotes Section */}
      {calculationDone && carrierQuotes.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-bold text-black mb-4">Shipping Quotes</h2>

          {/* Shipment Summary Header */}
          <div className="bg-white p-6 rounded-lg border text-black border-gray-400 mb-6">
            <div className="text-center mb-4">
              <p className="text-lg font-semibold">Pick-up from {formData.pickupAddress}</p>
              <p className="text-lg font-semibold">Delivery to {formData.deliveryAddress}</p>
              <div className="border-t border-gray-300 my-4"></div>
              <p className="text-lg">
                Shipment details (Quantity: {totalQuantity}, Weight: {totalWeight.toFixed(2)} kg)
              </p>
              <p className="text-lg">
                Dimensions (Length: {totalLength.toFixed(2)} m, Width: {totalWidth.toFixed(2)} m, Height: {totalHeight.toFixed(2)} m)
              </p>
            </div>
          </div>

          {/* Carrier Quote Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {carrierQuotes.map((quote, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg ${
                  quote.available ? "bg-gray-200 border text-black border-gray-400" : "bg-gray-100 border text-black border-gray-400"
                }`}
              >
                <div className="flex items-center justify-center mb-4">
                  <h3 className="text-xl font-bold text-center">
                    {quote.transport_name}
                    {quote.transport_name === "TNT" && " - FedEx"}
                  </h3>
                </div>

                {quote.available ? (
                  <>
                    <div className="mb-6">
                      <p className="text-lg font-semibold mb-2">
                        {/* Total Cost: ${quote.price.toFixed(2)} + Fuel Levy + GST */}
                        Total Cost: ${quote.price} + Fuel Levy + GST 
                      </p>
                      <p className="text-sm text-gray-700">
                        Additional charges may apply please contact Equity Logistics for final quotation
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRequestQuote(quote.transport_name)}
                      disabled={isRequestingQuote}
                      className={`w-full py-2 px-4 rounded flex items-center justify-center gap-2 ${
                        isRequestingQuote && selectedCarrier === quote.transport_name
                          ? "bg-green-500 text-white cursor-wait"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {isRequestingQuote && selectedCarrier === quote.transport_name ? (
                        <>
                          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Request Quote
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32">
                    <Truck size={32} className="text-gray-400 mb-2" />
                    <p className="text-lg font-medium text-gray-500">Delivery Services not available</p>
                    <button
                      type="button"
                      disabled
                      className="mt-4 w-full py-2 px-4 bg-gray-300 text-gray-500 rounded cursor-not-allowed"
                    >
                      Request Quote
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> These are estimated quotes based on the information provided. Final pricing may
              vary based on actual weight, dimensions, and other factors. Click "Request Quote" to receive an official
              quote from our team.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
