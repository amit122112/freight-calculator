"use client"

import type React from "react"

//import { useState } from "react"
//import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
//import ItemRow from "../../components/ItemRow"
//import type { ShipmentFormData, ShipmentItem } from "../../types/shipment"
import ShipmentForm from "@/app/components/ShipmentForm"

export default function NewShipment() {
  

  return (
    <div className="bg-white">
      <Link href="/dashboard" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
        <ArrowLeft size={16} className="mr-1" />
        Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-black mb-6">Create New Shipment</h1>

      <ShipmentForm/>
    </div>
  )
}
