"use client";

import { useState } from "react";

export default function ShipmentForm() {
  const [formData, setFormData] = useState({
    pickupAddress: "",
    deliveryAddress: "",
    quantity: "",
    weight: "",
    shippingOption: "",
    length: "",
    breadth: "",
    height: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl text-black font-bold text-center">Shipment Details</h2>
      <p className="text-gray-500 text-center mb-4">
        Enter pickup and delivery address, quantity, dimensions, and weight.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {/* Pickup Address */}
        <div>
          <label className="block font-semibold text-black">Pickup Address</label>
          <input
            type="text"
            name="pickupAddress"
            value={formData.pickupAddress}
            onChange={handleChange}
            placeholder="Enter Pickup Address"
            className="border text-black p-2 w-full rounded"
          />
        </div>

        {/* Delivery Address */}
        <div>
          <label className="block text-black font-semibold">Delivery Address</label>
          <input
            type="text"
            name="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={handleChange}
            placeholder="Enter Delivery Address"
            className="border p-2 w-full rounded text-black"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-black font-semibold">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Enter Quantity"
            className="border p-2 w-full text-black rounded"
          />
        </div>

        {/* Dimensions */}

        <div className="mb-4">
        <label className="block text-black font-semibold">Dimensions (cm)</label>
        <div className="flex gap-2">
            {/* Length */}
            <input
            type="number"
            step="0.01"
            name="length"
            value={formData.length}
            onChange={handleChange}
            className="w-1/3 border p-2 text-black rounded-md"
            placeholder="Length"
            required
            />
            
            {/* Breadth */}
            <input
            type="number"
            step="0.01"
            name="breadth"
            value={formData.breadth}
            onChange={handleChange}
            className="w-1/3 border p-2 rounded-md text-black"
            placeholder="Breadth"
            required
            />
            
            {/* Height */}
            <input
            type="number"
            step="0.01"
            name="height"
            value={formData.height}
            onChange={handleChange}
            className="w-1/3 border p-2 rounded-md text-black"
            placeholder="Height"
            required
            />
        </div>
        </div>


        {/* Weight */}
        <div>
          <label className="block font-semibold text-black">Weight</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Enter Weight"
            className="border p-2 w-full text-black rounded"
          />
        </div>

        {/* Shipping Option */}
        <div>
          <label className="block text-black font-semibold">Shipping Option</label>
          <select
            name="shippingOption"
            value={formData.shippingOption}
            onChange={handleChange}
            className="border p-2 w-full  text-black rounded"
          >
            <option value="">Select Shipping Method</option>
            <option value="air" className="text-black">Air Freight</option>
            <option value="sea" className="text-black">Sea Freight</option>
            <option value="land" className="text-black">Land Freight</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center space-x-4 mt-6">
        <button className="border text-black px-6 py-2 rounded">Reset</button>
        <button
          type="submit"
          disabled={
            !formData.length || !formData.breadth || !formData.height || 
            !formData.weight || !formData.pickupAddress || !formData.deliveryAddress
          }
          className={`w-full py-2 rounded transition duration-200 ${
            !formData.length || !formData.breadth || !formData.height || 
            !formData.weight || !formData.pickupAddress || !formData.deliveryAddress
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Get Quote
        </button>
      </div>
    </div>
  );
}
