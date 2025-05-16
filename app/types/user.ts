export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "admin" | "user"
  company?: string
  phone?: string
  status: "active" | "inactive" | "pending"
  dateCreated?: string
  // Address fields
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  // New commission field
  commission?: number
}

export interface UserFormData {
  firstName: string
  lastName: string
  email: string
  role: "admin" | "user"
  company: string
  phone: string
  password: string
  confirmPassword: string
  // Address fields
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  // New commission field
  commission?: number
}
