// User API functions
export const userApi = {
    getUsers: async () => {
      
      return Promise.resolve([
        {
          id: "1",
          name: "John Doe",
          email: "john.doe@example.com",
          role: "admin",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          role: "user",
        },
      ])
    },
  
    getUser: async (id: string) => {
      
      return Promise.resolve({
        id,
        name: "John Doe",
        email: "john.doe@example.com",
        role: "admin",
        // address fields to mock data
        address: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "United States",
      })
    },
  
    createUser: async (userData: {
      firstName: string
      lastName: string
      email: string
      role: string
      company?: string
      phone?: string
      password: string
      address?: string
      city?: string
      state?: string
      zipCode?: string
      country?: string
    }) => {
      
      console.log("Creating user:", userData)
  
      
      return Promise.resolve({
        id: Math.random().toString(36).substring(2, 9),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        status: "active",
        // Include address fields in response
        address: userData.address,
        city: userData.city,
        state: userData.state,
        zipCode: userData.zipCode,
        country: userData.country,
      })
    },
  
    updateUser: async (
      id: string,
      data: {
        name?: string
        email?: string
        role?: string
        address?: string
        city?: string
        state?: string
        zipCode?: string
        country?: string
      },
    ) => {
      
      console.log("Updating user:", id, data)
  
      
      return Promise.resolve({
        id,
        name: data.name || "Updated User",
        email: data.email || "updated@example.com",
        role: data.role || "user",
        // Include address fields in response
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
      })
    },
  
    deleteUser: async (id: string) => {
      
      console.log("Deleting user:", id)
  
      
      return Promise.resolve({ message: "User deleted successfully" })
    },
  }
  