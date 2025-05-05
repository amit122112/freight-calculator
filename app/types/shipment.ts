export interface ShipmentItem {
    description: string
    category: string
    quantity: string
    weight: string
    dimensions: {
        length: string
        width: string
        height: string
    }
}

export interface ShipmentFormData {
    pickupAddress: string
    deliveryAddress: string
    shippingOption: string
    specialInstructions: string
    items: ShipmentItem[]
}

export interface CarrierQuote {
    transport_name: string
    price: number
    currency?: string
    fuel_levy_percentage?: number
    gst_percentage?: number
    available: boolean
  }
  
