
// Base API URL - change this to Laravel backend URL later
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hungryblogs.com/api"

// Save auth token to localStorage
export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)
  }
}

// Get auth token from localStorage
export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

// Remove auth token from localStorage
export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
  }
}

// Save user data to localStorage
export const setUser = (user: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user))
  }
}

// Get user data from localStorage
export const getUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  }
  return null
}

// Remove user data from localStorage
export const removeUser = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user")
  }
}

// Check if user is authenticated
export const isAuthenticated = () => {
  if (typeof window !== "undefined") {
    return !!getToken()
  }
  return false
}

// Login user
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      //credentials: "include", // This will be mportant for cookies if using Laravel Sanctum
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Login failed")
    }

    // Store the token 
    if (data.token) {
      setToken(data.token)
    }

    if (data.user) {
      setUser(data.user)
    }

    return data
  } catch (error: any) {
    throw new Error(error.message || "An error occurred during login")
  }
}

// Logout user
export const logoutUser = async () => {
  try {
    const token = getToken()
    
    if (token) {
      // Call the logout endpoint
      // await fetch(`${API_URL}/logout`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Accept": "application/json",
      //     "Authorization": `Bearer ${token}`,
      //   },
      //   credentials: "include",
      // })
    }
    
    // Clear local storage regardless of API response
    removeToken()
    removeUser()
    
    return true
  } catch (error) {
    console.error("Logout error:", error)
    // clear local storage even if API call fails
    removeToken()
    removeUser()
    return false
  }
}

// Get authenticated user data from API
export const fetchUserData = async () => {
  try {
    const token = getToken()
    
    if (!token) {
      throw new Error("No authentication token found")
    }
    
    const response = await fetch(`${API_URL}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include",
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch user data")
    }
    
    // Update stored user data
    setUser(data)
    
    return data
  } catch (error: any) {
    console.error("Error fetching user data:", error)
    throw new Error(error.message || "An error occurred while fetching user data")
  }
}

// Create a reusable fetch function with authentication
export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = getToken()
  
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...options.headers,
  }
  
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
    credentials: "include",
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || "API request failed")
  }
  
  return data
}