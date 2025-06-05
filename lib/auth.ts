// Base API URL - change this to Laravel backend URL later
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hungryblogs.com/api"

// Token storage with expiration
export const setToken = (token: string, rememberMe = false) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)

    // Set expiration based on remember me
    const expirationTime = rememberMe
      ? Date.now() + 14 * 24 * 60 * 60 * 1000 // 14 days (good standard time for security and user convenience)
      : Date.now() + 2 * 60 * 60 * 1000 // 2 hours

    localStorage.setItem("token_expiration", expirationTime.toString())
    localStorage.setItem("remember_me", rememberMe.toString())

    console.log(`Token set with ${rememberMe ? "14 days" : "2 hours"} expiration`)
  }
}

// Check if token is expired
export const isTokenExpired = () => {
  if (typeof window !== "undefined") {
    const expiration = localStorage.getItem("token_expiration")
    if (!expiration) return true

    const isExpired = Date.now() > Number.parseInt(expiration)
    return isExpired
  }
  return true
}

// Get auth token from localStorage with expiration check
export const getToken = () => {
  if (typeof window !== "undefined") {
    if (isTokenExpired()) {
      removeToken()
      return null
    }
    return localStorage.getItem("auth_token")
  }
  return null
}

// Remove auth token from localStorage
export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("token_expiration")
    localStorage.removeItem("remember_me")
    localStorage.removeItem("user")
    localStorage.removeItem("user_id")
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

// Check if user is authenticated with token validation
export const isAuthenticated = () => {
  if (typeof window !== "undefined") {
    const token = getToken()
    return !!token && !isTokenExpired()
  }
  return false
}

// Get remember me preference
export const getRememberMe = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("remember_me") === "true"
  }
  return false
}

// Get token expiration info for display
export const getTokenExpirationInfo = () => {
  if (typeof window !== "undefined") {
    const expiration = localStorage.getItem("token_expiration")
    const rememberMe = getRememberMe()

    if (expiration) {
      const expirationDate = new Date(Number.parseInt(expiration))
      const timeLeft = Number.parseInt(expiration) - Date.now()

      return {
        expirationDate,
        timeLeft,
        rememberMe,
        isExpired: timeLeft <= 0,
      }
    }
  }
  return null
}

// Login user with remember me option
export const loginUser = async (email: string, password: string, rememberMe = false) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Login failed")
    }

    // Store the token with remember me preference
    if (data.token) {
      setToken(data.token, rememberMe)
    }

    if (data.user) {
      setUser(data.user)
      localStorage.setItem("user_id", JSON.stringify(data.user.id))
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
      try {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (error) {
        console.warn("Logout API call failed, but continuing with local cleanup:", error)
      }
    }

    removeToken()
    removeUser()
    return true
  } catch (error) {
    console.error("Logout error:", error)
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
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        removeToken()
        removeUser()
      }
      throw new Error(data.message || "Failed to fetch user data")
    }

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

  if (!token) {
    throw new Error("No authentication token available")
  }

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    removeToken()
    removeUser()
    window.location.href = "/login"
    throw new Error("Session expired. Please login again.")
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "API request failed")
  }

  return data
}
