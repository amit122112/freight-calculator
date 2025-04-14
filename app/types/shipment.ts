export type ShipmentItem = {
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
  
